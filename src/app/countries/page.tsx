'use client';

import React, { useEffect, useMemo, useState } from 'react';
import NavDrawer from '../../components/layout/NavDrawer';
import Header from '../../components/layout/Header';

// 전역 상태와 데이터 패칭
import { useGlobalState } from '../../state/useGlobalState';
import { useQuery } from '@tanstack/react-query';
import { fetchCompanies } from '../../lib/api';

import { useDashboardData } from '../../hooks/useDashboardData';

// KPI 및 차트 컴포넌트
import KpiCard from '../../components/kpi/KpiCard';
import LineChart from '../../components/charts/LineChart';
import DonutChart from '../../components/charts/DonutChart';
import BarChart from '../../components/charts/Barchart';

export default function CountriesPage() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    // 전역 상태에서 기간과 탄소세 단가 로드
    const { period, carbonPrice, selectedCountry, setSelectedCountry } = useGlobalState();
    // 회사 데이터 로드 (React Query)
    const {
        data: companies,
        isPending: companiesPending,
        isError: companiesError,
    } = useQuery({ queryKey: ['companies'], queryFn: fetchCompanies });

    // 첫 로딩 후 기본 선택 국가 설정
    useEffect(() => {
        if (!selectedCountry && companies && companies.length > 0) {
            setSelectedCountry(companies[0].country);
        }
    }, [companies, selectedCountry, setSelectedCountry]);

    // 현재 선택된 국가에 속한 회사 목록
    const companiesInCountry = useMemo(() => {
        return companies?.filter((c) => c.country === selectedCountry) || [];
    }, [companies, selectedCountry]);

    // KPI와 차트 데이터를 계산
    const dashboardData = useDashboardData(companiesInCountry, period);
    // 예상 탄소세
    const estimatedTax = dashboardData.total * carbonPrice;

    return (
        <>
            <NavDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
            <div className="min-h-screen bg-neutral-900">
                <Header
                    onToggleDrawer={() => setDrawerOpen((v) => !v)}
                    title="국가별 분석"
                    countryOptions={
                        (companies ? Array.from(new Set(companies.map((c) => c.country))) : [])
                            .map((code) => ({ id: code, name: code }))
                    }
                    selectedCountryId={selectedCountry ?? ''}
                    onChangeCountry={(id) => setSelectedCountry(id)}
                />
                <main className="p-4 space-y-6">
                    {/* 로딩 및 에러 처리 */}
                    {companiesPending && <p className="text-neutral-300">데이터를 불러오는 중입니다…</p>}
                    {companiesError && <p className="text-red-400">회사 데이터를 불러오지 못했습니다.</p>}

                    {/* KPI 카드 */}
                    {companiesInCountry.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            <KpiCard
                                label="총 배출량(톤)"
                                value={dashboardData.total.toLocaleString()}
                                numericValue={dashboardData.total}
                                yoyPrevTotal={dashboardData.prevYearTotal}
                            />
                            <KpiCard
                                label="예상 탄소세"
                                value={estimatedTax.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + ' USD'}
                            />
                            <KpiCard label="전년도 배출량(톤)" value={dashboardData.prevYearTotal.toLocaleString()} />
                        </div>
                    )}

                    {/* 차트 영역 */}
                    {companiesInCountry.length > 0 && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                <div className="bg-neutral-800 p-4 rounded-4xl border border-white/10 shadow">
                                    <h2 className="text-lg font-semibold text-neutral-200 mb-2">
                                        월별 배출량 추세 ({selectedCountry})
                                    </h2>
                                    <LineChart data={dashboardData.lineData} label="배출량" />
                                </div>
                                <div className="bg-neutral-800 p-4 rounded-4xl border border-white/10 shadow">
                                    <h2 className="text-lg font-semibold text-neutral-200 mb-2">에너지원별 비중</h2>
                                    <DonutChart data={dashboardData.donutData} label="에너지원" />
                                </div>
                            </div>
                            <div className="bg-neutral-800 p-4 rounded-4xl border border-white/10 shadow">
                                <h2 className="text-lg font-semibold text-neutral-200 mb-2">
                                    회사별 배출량 ({selectedCountry})
                                </h2>
                                <BarChart data={dashboardData.barData} label="회사" />
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </>
    );
}