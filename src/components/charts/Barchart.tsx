import React from 'react';
import {
    BarChart as ReBarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

export interface BarChartProps {
    // 차트에 전달할 데이터 배열
    data: { name: string;[key: string]: string | number }[];
    // 값을 가져올 속성명
    valueKey?: string;
    // 범례에 표시할 라벨입니다
    label?: string;
    maxBarSize?: number;
    barSize?: number;
    barGap?: number;
    barCategoryGap?: number | string;
    barColor?: string;
}

const BarChart: React.FC<BarChartProps> = ({ data, valueKey = 'value', label, maxBarSize, barSize, barGap, barCategoryGap, barColor = '#8884d8' }) => {
    const _maxBarSize = maxBarSize ?? 150;
    const _barGap = barGap ?? 8;
    const _barCategoryGap = barCategoryGap ?? '10%';

    return (
        <div className='w-full h-[300px]'
            onMouseDown={(e) => e.preventDefault()}
        >
            <ResponsiveContainer>
                <ReBarChart data={data} margin={{ top: 16, right: 16, left: 0, bottom: 16 }} barGap={_barGap} barCategoryGap={_barCategoryGap}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name"
                        tick={{ fill: '#f9fafb', fontSize: 14 }}
                    />
                    <YAxis tick={{ fill: '#f9fafb', fontSize: 12 }} />
                    <Tooltip
                        isAnimationActive={false}
                        cursor={{ fill: 'rgba(59,130,246,0.15)' }}
                        contentStyle={{
                            backgroundColor: '#ffffff',
                            borderRadius: 20,
                            color: '#111111',
                            padding: '8px 14px 3px 14px',
                        }}
                        itemStyle={{ color: '#111111' }}
                        labelStyle={{ color: '#111111', fontWeight: 600 }}
                        formatter={(val: string | number) => [
                            typeof val === 'number' ? val.toLocaleString() : val,
                            '배출량',
                        ]}
                    />
                    <Bar dataKey={valueKey} maxBarSize={_maxBarSize} barSize={barSize} fill={"#60a5fa"} />
                </ReBarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default BarChart;