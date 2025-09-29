'use client';

import React, { useState } from 'react';
import NavDrawer from '../../components/layout/NavDrawer';
import Header from '../../components/layout/Header';

// React Query 및 데이터 호출
import { useQuery } from '@tanstack/react-query';
import { fetchCompanies, fetchPosts } from '../../lib/api';

// 전역 상태 및 타입
import { useGlobalState } from '../../state/useGlobalState';

// 차트 및 KPI 컴포넌트
import KpiCard from '../../components/kpi/KpiCard';
import LineChart from '../../components/charts/LineChart';
import DonutChart from '../../components/charts/DonutChart';

// 게시물 목록 컴포넌트
import PostList from '../../components/posts/PostList';

import { useDashboardData } from '../../hooks/useDashboardData';

export default function CompaniesPage() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    // 선택된 회사 ID 상태. 데이터 로딩 후 첫 회사를 기본값으로 설정
    const [selectedId, setSelectedId] = useState<string>('');

    // 전역 기간 및 탄소세 단가 상태
    const { period, carbonPrice } = useGlobalState();

    // 회사 및 게시물 데이터 가져오기
    const {
        data: companies,
        isPending: companiesPending,
        isError: companiesError,
    } = useQuery({ queryKey: ['companies'], queryFn: fetchCompanies });
    const {
        data: posts,
        isPending: postsPending,
        isError: postsError,
    } = useQuery({ queryKey: ['posts'], queryFn: fetchPosts });

    // 로딩 이후 기본 선택값 설정
    React.useEffect(() => {
        if (!selectedId && companies && companies.length > 0) {
            setSelectedId(companies[0].id);
        }
    }, [companies, selectedId]);

    // 선택된 회사 객체
    const selectedCompany = companies?.find((c) => c.id === selectedId);

    // 선택된 회사 기준으로 공용 훅 적용 (단일 회사 배열로 전달)
    const dashboardData = useDashboardData(selectedCompany ? [selectedCompany] : [], period);

    const estimatedTax = dashboardData.total * carbonPrice;

    return (
        <>
            {/* 내비게이션 드로어 */}
            <NavDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
            {/* 페이지 래퍼 */}
            <div className="min-h-screen bg-neutral-900">
                {/* 헤더: 드로어 토글 및 페이지 제목 */}
                <Header
                    onToggleDrawer={() => setDrawerOpen((v) => !v)}
                    title="회사별 분석"
                    companyOptions={companies?.map(c => ({ id: c.id, name: c.name })) ?? []}
                    selectedCompanyId={selectedId}
                    onChangeCompany={(id) => setSelectedId(id)} />
                {/* 메인 콘텐츠 영역 */}
                <main className="p-4 space-y-6">
                    {/* 회사 선택 및 로딩/에러 처리 */}
                    {companiesPending && <p className="text-neutral-300">데이터를 불러오는 중입니다…</p>}
                    {companiesError && <p className="text-red-400">회사 데이터를 불러오지 못했습니다.</p>}
                    {/* {companies && companies.length > 0 && (
                        <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                            <label htmlFor="company-select" className="text-sm text-neutral-300">
                                회사 선택
                            </label>
                            <select
                                id="company-select"
                                value={selectedId}
                                onChange={(e) => setSelectedId(e.target.value)}
                                className=" bg-neutral-700 text-neutral-100 border-neutral-600 px-2 py-1 text-sm"
                            >
                                {companies.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )} */}
                    {/* KPI 카드 */}
                    {selectedCompany && (
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
                            <KpiCard
                                label="전년도 배출량(톤)"
                                value={dashboardData.prevYearTotal.toLocaleString()}
                            />
                        </div>
                    )}
                    {/* 차트 영역 */}
                    {selectedCompany && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div className="bg-neutral-800 p-4 rounded-4xl border border-white/10 shadow">
                                <h2 className="text-lg font-semibold text-neutral-200 mb-2">
                                    월별 배출량 추세 ({selectedCompany.name})
                                </h2>
                                <LineChart data={dashboardData.lineData} label="배출량" />
                            </div>
                            <div className="bg-neutral-800 p-4 rounded-4xl border border-white/10 shadow">
                                <h2 className="text-lg font-semibold text-neutral-200 mb-2">
                                    에너지원
                                </h2>
                                <DonutChart data={dashboardData.donutData} label="에너지원" />
                            </div>
                        </div>
                    )}
                    {/* 게시물 목록 */}
                    {selectedCompany && posts && (
                        <div className="bg-neutral-800 p-4 rounded-4xl border border-white/10 shadow">
                            <PostList posts={posts} companyId={selectedCompany.id} />
                        </div>
                    )}
                    {/* 게시물 로딩/에러 처리 */}
                    {postsPending && <p className="text-neutral-300">게시물을 불러오는 중입니다…</p>}
                    {postsError && <p className="text-red-400">게시물을 불러오지 못했습니다.</p>}
                </main>
            </div>
        </>
    );
}