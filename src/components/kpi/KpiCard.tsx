import React from 'react';
import clsx from 'clsx';

export interface KpiCardProps {
    label: string;
    value: string | number;
    // 이전 기간 대비 변화량
    delta?: number;
    invertColors?: boolean;
    // 전년도(또는 비교군) 총합 value와 비교
    yoyPrevTotal?: number;
    numericValue?: number;
}

const KpiCard: React.FC<KpiCardProps> = ({ label, value, delta, invertColors = false, yoyPrevTotal, numericValue }) => {
    const coerceNumber = (v: string | number | undefined): number | undefined => {
        if (typeof v === 'number') return v;
        if (typeof v === 'string') {
            const n = Number(v.replace(/,/g, ''));
            return Number.isFinite(n) ? n : undefined;
        }
        return undefined;
    };

    const currentNumeric = numericValue ?? coerceNumber(value);
    let effectiveDelta: number | undefined = undefined; // percent
    if (typeof yoyPrevTotal === 'number' && Number.isFinite(yoyPrevTotal) && yoyPrevTotal !== 0 && typeof currentNumeric === 'number') {
        effectiveDelta = ((currentNumeric - yoyPrevTotal) / yoyPrevTotal) * 100;
    } else if (typeof delta === 'number') {
        effectiveDelta = delta; // backward-compat %라고 가정
    }
    const isPositive = effectiveDelta !== undefined ? effectiveDelta >= 0 : true;

    return (
        <div className="p-6 rounded-4xl border border-white/10 shadow bg-neutral-800">
            <div className="text-sm text-neutral-400 mb-1">
                {label}
            </div>
            <div className='flex gap-2 items-center'>
                <span className="text-2xl font-bold text-white">
                    {value}
                </span>
                {effectiveDelta !== undefined && (
                    <span
                        className={clsx(
                            'text-sm font-medium',
                            {
                                'text-green-600': (isPositive && !invertColors) || (!isPositive && invertColors),
                                'text-red-600': (!isPositive && !invertColors) || (isPositive && invertColors),
                            }
                        )}
                        title={typeof yoyPrevTotal === 'number' ? '전년도 대비' : '증감률'}
                    >
                        {isPositive ? '+' : '-'}
                        {Math.abs(Number(effectiveDelta.toFixed(2)))}%
                    </span>
                )}
            </div>
        </div>
    );
};

export default KpiCard;