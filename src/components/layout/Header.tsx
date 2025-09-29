import React, { ChangeEvent } from 'react';
import { useGlobalState } from '../../state/useGlobalState';
import FilterControl from '../ui/FilterControl';
import HamburgerIcon from '../ui/HamburgerIcon';
import MonthPicker from '../ui/MonthPicker';

type SelectOption = { id: string; name: string };

export interface HeaderProps {
    onToggleDrawer: () => void;
    /** 현재 페이지의 제목 */
    title?: string;
    /** 헤더에 표시할 회사 선택 옵션 (선택) */
    companyOptions?: SelectOption[];
    /** 현재 선택된 회사 ID (선택) */
    selectedCompanyId?: string;
    /** 회사 선택 변경 핸들러 (선택) */
    onChangeCompany?: (id: string) => void;
    /** 헤더에 표시할 국가 선택 옵션 (선택) */
    countryOptions?: SelectOption[];
    /** 현재 선택된 국가 ID (선택) */
    selectedCountryId?: string;
    /** 국가 선택 변경 핸들러 (선택) */
    onChangeCountry?: (id: string) => void;
}

const Header: React.FC<HeaderProps> = ({
    onToggleDrawer,
    title,
    companyOptions,
    selectedCompanyId,
    onChangeCompany,
    countryOptions,
    selectedCountryId,
    onChangeCountry,
}) => {
    const { period, setPeriod, carbonPrice, setCarbonPrice } = useGlobalState();

    const handlePriceChange = (e: ChangeEvent<HTMLInputElement>) => {
        const val = parseFloat(e.target.value);
        setCarbonPrice(isNaN(val) ? 0 : val);
    };

    return (
        <header className="sticky top-0 z-30 flex items-center justify-between bg-neutral-800 px-4 py-3 shadow-md">
            {/* 왼쪽: 햄버거 아이콘과 페이지 제목 */}
            <div className="flex items-center">
                <button
                    onClick={onToggleDrawer}
                    className="p-2"
                    aria-label="메뉴 열기"
                >
                    <HamburgerIcon className="w-6 h-6 text-neutral-100" />
                </button>
                {title && (
                    <h1 className="pl-4 text-lg font-semibold text-neutral-100">
                        {title}
                    </h1>
                )}
            </div>

            <div className="flex items-center gap-2">
                {/* 회사 선택 (옵션이 전달된 경우에만 표시) */}
                {companyOptions && companyOptions.length > 0 && onChangeCompany && (
                    <FilterControl label="회사">
                        <select
                            value={selectedCompanyId ?? ''}
                            onChange={(e) => onChangeCompany(e.target.value)}
                            className="px-3 py-1 rounded-full border border-neutral-600 bg-neutral-700 text-neutral-100 text-sm hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            {companyOptions.map((c) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </FilterControl>
                )}
                {/* 국가 선택 (옵션이 전달된 경우에만 표시) */}
                {countryOptions && countryOptions.length > 0 && onChangeCountry && (
                    <FilterControl label="국가">
                        <select
                            value={selectedCountryId ?? ''}
                            onChange={(e) => onChangeCountry(e.target.value)}
                            className="px-3 py-1 rounded-full border border-neutral-600 bg-neutral-700 text-neutral-100 text-sm hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            {countryOptions.map((c) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </FilterControl>
                )}
                {/* 시작 기간 입력 */}
                <FilterControl label="검색 범위 설정">
                    <MonthPicker
                        value={period.from}
                        onChange={(v) =>
                            setPeriod((p) => (v > p.to ? { ...p, from: v, to: v } : { ...p, from: v }))
                        }
                    />
                </FilterControl>
                {/* 끝 기간 입력 */}
                <FilterControl label="~">
                    <MonthPicker
                        value={period.to}
                        onChange={(v) =>
                            setPeriod((p) => (v < p.from ? { ...p, from: v, to: v } : { ...p, to: v }))
                        }
                    />
                </FilterControl>
                {/* 탄소세 단가 입력 */}
                <FilterControl label="단가 설정 ( $ / t )">
                    <input
                        id="carbon-price"
                        type="number"
                        value={carbonPrice}
                        onChange={handlePriceChange}
                        step="1"
                        className="w-20 px-3 py-1 rounded-full border border-neutral-600 bg-neutral-700 text-neutral-100 text-sm hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </FilterControl>

            </div>
        </header>
    );
};

export default Header;