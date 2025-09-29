import React from 'react';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';

export interface DonutChartProps {
    data: { name: string; value: number }[];
    // 각 조각에 지정할 색상 배열
    colors?: string[];
    // 범례에 표시할 라벨
    label?: string;
}

const DEFAULT_COLORS = [
    '#8884d8',
    '#82ca9d',
    '#ffc658',
    '#ff8a65',
    '#a1887f',
    '#90a4ae',
];

const DonutChart: React.FC<DonutChartProps> = ({ data, colors = DEFAULT_COLORS, label }) => {
    return (
        <div className='w-full h-[300px]'
            onMouseDown={(e) => e.preventDefault()}
        >
            <ResponsiveContainer>
                <PieChart>
                    <Pie
                        data={data}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        label
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#ffffff',
                            borderRadius: 20,
                            color: '#111111',
                            padding: '8px 14px 8px 14px',
                        }}
                    />
                    {label && <Legend />}
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default DonutChart;