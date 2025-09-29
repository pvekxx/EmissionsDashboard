import React from 'react';
import type { Company } from '../lib/api';

export function useDashboardData(
    companies: Company[],
    period: { from: string; to: string }
) {
    // 기간 범위를 월 단위 배열로 변환
    function getMonthRange(from: string, to: string): string[] {
        const [fromYear, fromMonth] = from.split('-').map((v) => parseInt(v, 10));
        const [toYear, toMonth] = to.split('-').map((v) => parseInt(v, 10));
        const result: string[] = [];
        const startDate = new Date(fromYear, fromMonth - 1, 1);
        const endDate = new Date(toYear, toMonth - 1, 1);
        const current = new Date(startDate);
        while (current <= endDate) {
            const y = current.getFullYear();
            const m = String(current.getMonth() + 1).padStart(2, '0');
            result.push(`${y}-${m}`);
            current.setMonth(current.getMonth() + 1);
        }
        return result;
    }

    // 전년도 동일 기간 반환
    function getPreviousYearPeriod(current: { from: string; to: string }) {
        const [fromY, fromM] = current.from.split('-').map((v) => parseInt(v, 10));
        const [toY, toM] = current.to.split('-').map((v) => parseInt(v, 10));
        const prevFrom = new Date(fromY - 1, fromM - 1, 1);
        const prevTo = new Date(toY - 1, toM - 1, 1);
        const pfY = prevFrom.getFullYear();
        const pfM = String(prevFrom.getMonth() + 1).padStart(2, '0');
        const ptY = prevTo.getFullYear();
        const ptM = String(prevTo.getMonth() + 1).padStart(2, '0');
        return { from: `${pfY}-${pfM}`, to: `${ptY}-${ptM}` };
    }

    return React.useMemo(() => {
        if (!companies || companies.length === 0) {
            return {
                total: 0,
                prevYearTotal: 0,
                delta: undefined as number | undefined,
                lineData: [] as { name: string; value: number }[],
                donutData: [] as { name: string; value: number }[],
                barData: [] as { name: string; value: number }[],
            };
        }

        const months = getMonthRange(period.from, period.to);

        // 라인차트
        const lineData = months.map((month) => {
            let sum = 0;
            companies.forEach((company) => {
                company.emissions.forEach((e) => {
                    if (e.yearMonth === month) sum += e.emissions;
                });
            });
            return { name: month, value: sum };
        });

        // 바차트
        const barData = companies.map((company) => {
            let sum = 0;
            company.emissions.forEach((e) => {
                if (e.yearMonth >= period.from && e.yearMonth <= period.to) {
                    sum += e.emissions;
                }
            });
            return { name: company.name, value: sum };
        });

        const total = barData.reduce((acc, cur) => acc + cur.value, 0);

        // 도넛차트
        const donutMap = new Map<string, number>();
        companies.forEach((company) => {
            company.emissions.forEach((e) => {
                if (e.yearMonth >= period.from && e.yearMonth <= period.to) {
                    donutMap.set(e.source, (donutMap.get(e.source) || 0) + e.emissions);
                }
            });
        });
        const donutData = Array.from(donutMap.entries()).map(([name, value]) => ({
            name,
            value,
        }));

        // 전년도 대비
        const prevYear = getPreviousYearPeriod(period);
        let prevYearTotal = 0;
        companies.forEach((company) => {
            company.emissions.forEach((e) => {
                if (e.yearMonth >= prevYear.from && e.yearMonth <= prevYear.to) {
                    prevYearTotal += e.emissions;
                }
            });
        });

        const delta =
            prevYearTotal === 0
                ? undefined
                : ((total - prevYearTotal) / prevYearTotal) * 100;

        return { total, prevYearTotal, delta, lineData, donutData, barData };
    }, [companies, period]);
}