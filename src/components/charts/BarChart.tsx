'use client';

import dynamic from 'next/dynamic';
import React from 'react';

// Dynamically import Chart to avoid SSR issues
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface BarChartProps {
  chartData: { name: string; data: number[] }[];
  chartOptions: any;
  height?: number;
}

const BarChart: React.FC<BarChartProps> = ({ chartData, chartOptions, height = 350 }) => {
  // If chartData is not passed, provide a default series
  const chartSeries = chartData || [
    {
      name: 'Sales',
      data: [30, 40, 35, 50, 49, 60],
    },
  ];

  return <Chart options={chartOptions} series={chartSeries} type="bar" height={height} />;
};

export default BarChart;
