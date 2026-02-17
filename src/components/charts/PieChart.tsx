'use client';
import dynamic from 'next/dynamic';
import React from 'react';

// Dynamically import Chart to avoid SSR issues
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface PieChartProps {
  chartData?: number[];
  chartOptions?: any;
  width?: string | number;
  height?: string | number;
}

const PieChart: React.FC<PieChartProps> = ({
  chartData,
  chartOptions,
  width = '100%',
  height = '100%',
}) => {
  // Default series if none is passed
  const series = chartData || [44, 55, 13, 43, 22];

  // Default options if none is passed
  const options = chartOptions || {
    chart: { id: 'pie-chart', toolbar: { show: false } },
    labels: ['A', 'B', 'C', 'D', 'E'],
    legend: { position: 'bottom' },
  };

  return <Chart options={options} series={series} type="pie" width={width} height={height} />;
};

export default PieChart;
