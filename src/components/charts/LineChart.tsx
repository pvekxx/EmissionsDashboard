import React from 'react';
import {
    LineChart as ReLineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';

export interface LineChartProps {
    // 차트에 전달할 데이터 배열
    data: { name: string;[key: string]: string | number }[];
    // Y축 값
    valueKey?: string;
    // 범례에 표시할 라벨
    label?: string;
}

const LineChart: React.FC<LineChartProps> = ({ data, valueKey = 'value', label }) => {
    return (
        <div className='min-w-0 w-full h-[300px]'
            onMouseDown={(e) => e.preventDefault()}
        >
            <ResponsiveContainer debounce={120}>
                <ReLineChart data={data} margin={{ top: 16, right: 32, left: 0, bottom: 16 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" interval="preserveEnd"
                        tick={{ fill: '#f9fafb', fontSize: 12 }}
                    />
                    <YAxis
                        tick={{ fill: '#f9fafb', fontSize: 12 }} />
                    <Tooltip
                        isAnimationActive={false}
                        // cursor={{ strokeDasharray: '3 3' }}
                        contentStyle={{
                            backgroundColor: '#ffffff',
                            borderRadius: 20,
                            color: '#111111',
                            padding: '8px 14px 3px 14px',
                        }}
                        itemStyle={{ color: '#111111' }}
                        labelStyle={{ color: '#111111', fontWeight: 600 }}
                    />
                    {label && <Legend />}
                    <Line
                        type="monotone"
                        dataKey={valueKey}
                        name={label}
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={{ r: 2 }}
                        connectNulls
                    />
                </ReLineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default LineChart;