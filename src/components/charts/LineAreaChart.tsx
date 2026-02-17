'use client';

import dynamic from 'next/dynamic';
import React from 'react';

// Dynamically import Chart to avoid SSR issues
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface LineAreaChartProps {
  chartData?: { name: string; data: number[] }[];
  chartOptions?: any;
  width?: string | number;
  height?: string | number;
}

const LineAreaChart: React.FC<LineAreaChartProps> = ({
  chartData,
  chartOptions,
  width = '100%',
  height = '100%',
}) => {
  // Provide default series if none is passed
  const series = chartData || [
    {
      name: 'Revenue',
      data: [10, 41, 35, 51, 49, 62, 69],
    },
  ];

  // Provide default options if none is passed
  const options = chartOptions || {
    chart: { id: 'area-chart', toolbar: { show: false } },
    xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'] },
    stroke: { curve: 'smooth' },
  };

  return <Chart options={options} series={series} type="area" width={width} height={height} />;
};

export default LineAreaChart;
