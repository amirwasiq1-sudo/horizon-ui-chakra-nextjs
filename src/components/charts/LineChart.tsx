'use client';
import dynamic from 'next/dynamic';
import React from 'react';

// Dynamically import Chart to avoid SSR issues
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface LineChartProps {
  chartData?: { name: string; data: number[] }[];
  chartOptions?: any;
  width?: string | number;
  height?: string | number;
}

const LineChart: React.FC<LineChartProps> = ({
  chartData,
  chartOptions,
  width = '100%',
  height = '100%',
}) => {
  // Provide default series if none is passed
  const series = chartData || [
    { name: 'Series 1', data: [10, 20, 30, 40, 50, 60, 70] },
  ];

  // Provide default options if none is passed
  const options = chartOptions || {
    chart: { id: 'line-chart', toolbar: { show: false } },
    xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'] },
    stroke: { curve: 'smooth' },
  };

  return <Chart options={options} series={series} type="line" width={width} height={height} />;
};

export default LineChart;
