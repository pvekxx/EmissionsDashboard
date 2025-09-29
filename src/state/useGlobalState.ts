import { atom, useAtom } from "jotai";

// 대시보드 필터에 사용되는 기간 범위
export type PeriodRange = {
    from: string;
    to: string;
};

// 현재 연도 1월 ~ 현재 월을 기본값으로 반환하는 함수
function getDefaultPeriod(): PeriodRange {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0"); // 현재 월
    return { from: `${year}-01`, to: `${year}-${month}` };
}

// 대시보드에서 현재 선택된 기간 범위atom
export const periodAtom = atom<PeriodRange>(getDefaultPeriod());

// 톤당 탄소세 단가atom
export const carbonPriceAtom = atom<number>(50);
export const groupByAtom = atom<'company' | 'country'>('company');


//  현재 선택된 회사와 국가atom
export const selectedCompanyAtom = atom<string | null>(null);
export const selectedCountryAtom = atom<string | null>(null);

// 전역 상태 atom들을 한 번에 가져와 사용할 수 있는 편의 훅
export function useGlobalState() {
    const [period, setPeriod] = useAtom(periodAtom);
    const [carbonPrice, setCarbonPrice] = useAtom(carbonPriceAtom);
    const [groupBy, setGroupBy] = useAtom(groupByAtom);
    const [selectedCompany, setSelectedCompany] = useAtom(selectedCompanyAtom);
    const [selectedCountry, setSelectedCountry] = useAtom(selectedCountryAtom);
    return {
        period,
        setPeriod,
        carbonPrice,
        setCarbonPrice,
        groupBy,
        setGroupBy,
        selectedCompany,
        setSelectedCompany,
        selectedCountry,
        setSelectedCountry,
    };
}