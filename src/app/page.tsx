'use client';

import React, { useState, useMemo } from 'react';
import NavDrawer from '../components/layout/NavDrawer';
import Header from '../components/layout/Header';
import { useDashboardData } from '../hooks/useDashboardData';

// 전역 상태와 데이터 패칭 훅
import { useGlobalState } from '../state/useGlobalState';
import { useQuery } from '@tanstack/react-query';
import { fetchCompanies } from '../lib/api';

// KPI 카드와 차트 컴포넌트
import KpiCard from '../components/kpi/KpiCard';
import LineChart from '../components/charts/LineChart';
import BarChart from '../components/charts/Barchart';
import DonutChart from '../components/charts/DonutChart';

export default function DashboardPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  // 전역 상태에서 기간, 탄소세 단가, 그룹기준 가져오기
  const { period, carbonPrice, groupBy } = useGlobalState();

  // 회사 데이터를 비동기 로드 React Query
  const {
    data: companies,
    isPending: companiesPending,
    isError: companiesError,
  } = useQuery({
    queryKey: ['companies'],
    queryFn: fetchCompanies,
  });

  // 공용 훅 (라인/도넛/총합/YoY)
  const base = useDashboardData(companies ?? [], period);

  // 이 페이지 전용 - 회사/국가 기준 바 차트만 메모이제이션
  const barData = useMemo(() => {
    if (!companies) return [] as { name: string; value: number }[];
    const barMap = new Map<string, number>();
    companies.forEach((company) => {
      let sum = 0;
      company.emissions.forEach((e) => {
        if (e.yearMonth >= period.from && e.yearMonth <= period.to) {
          sum += e.emissions;
        }
      });
      const key = groupBy === 'company' ? company.name : company.country;
      barMap.set(key, (barMap.get(key) || 0) + sum);
    });
    return Array.from(barMap.entries()).map(([name, value]) => ({ name, value }));
  }, [companies, period, groupBy]);

  // 최종 대시보드 데이터 (불변성 유지를 위해 메모이제이션)
  const dashboardData = useMemo(() => ({
    totalEmissions: base.total,
    prevYearTotal: base.prevYearTotal,
    delta: base.delta,
    lineData: base.lineData,
    donutData: base.donutData,
    barData,
  }), [base, barData]);

  // 예상 탄소세 = 총 배출량 × 단가
  const estimatedTax = dashboardData.totalEmissions * carbonPrice;

  return (
    <>
      {/* 네비게이션 드로어 */}
      <NavDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      {/* 페이지 래퍼 */}
      <div className="min-h-screen bg-neutral-900">
        {/* 헤더 - 페이지 제목 전달 */}
        <Header
          onToggleDrawer={() => setDrawerOpen((v) => !v)}
          title="대시보드 홈" />
        {/* 메인 콘텐츠 */}
        <main className="p-4 space-y-6">
          {/* 로딩/에러 처리 */}
          {companiesPending && (<div className='h-[calc(100vh-64px)] flex justify-center items-center'>
            <p className="text-neutral-600 dark:text-neutral-300">데이터를 불러오는 중입니다…</p>
          </div>
          )}
          {companiesError && (<div className='h-[calc(100vh-64px)] flex justify-center items-center'>
            <p className="text-red-600 dark:text-red-400 flex justify-center">데이터를 불러오지 못했습니다. 다시 시도해 주세요.</p>
          </div>
          )}

          {/* 데이터가 준비되면 KPI와 차트 표시 */}
          {companies && (
            <>
              {/* KPI 카드 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <KpiCard
                  label="총 배출량(톤)"
                  value={dashboardData.totalEmissions.toLocaleString()}
                  numericValue={dashboardData.totalEmissions}
                  yoyPrevTotal={dashboardData.prevYearTotal}
                />
                <KpiCard
                  label="예상 탄소세"
                  value={estimatedTax.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + ' USD'}
                />
                <KpiCard
                  label="전년도 배출량(톤)"
                  value={dashboardData.prevYearTotal.toLocaleString()}
                />
              </div>

              {/* 차트 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-neutral-800 p-4 rounded-4xl border border-white/10 shadow">
                  <h2 className="text-lg font-semibold text-neutral-200 mb-2">월별 배출량 추세</h2>
                  <LineChart data={dashboardData.lineData} label="배출량" />
                </div>
                <div className="bg-neutral-800 p-4 rounded-4xl border border-white/10 shadow">
                  <h2 className="text-lg font-semibold text-neutral-200 mb-2">에너지원별 비중</h2>
                  <DonutChart data={dashboardData.donutData} label="에너지원" />
                </div>
              </div>

              {/* 비교 차트 (회사/국가) */}
              <div className="bg-neutral-800 p-4 rounded-4xl border border-white/10 shadow">
                <h2 className="text-lg font-semibold text-neutral-200 mb-2">
                  {groupBy === 'company' ? '회사별 배출량' : '국가별 배출량'}
                </h2>
                <BarChart data={dashboardData.barData} label={groupBy === 'company' ? '회사' : '국가'} />
              </div>
            </>
          )}
        </main>
      </div>
    </>
  );
}