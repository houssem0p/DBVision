import React from 'react';
import Chart from 'react-apexcharts';

const SgbdMetricsChart = ({ data }) => {
  // Define chart options
  const chartOptions = {
    chart: {
      type: 'bar',
      height: 350,
    },
    xaxis: {
      categories: ['Uptime (s)', 'Total Queries', 'Open Tables'],
    },
    colors: ['#ff5733'], // Set custom color for the bars
  };

  // Prepare chart series data
  const chartSeries = [
    {
      name: 'Metrics',
      data: [data.uptime, data.totalQueries, data.openTables],
    },
  ];

  return <Chart options={chartOptions} series={chartSeries} type="bar" height={350} />;
};

export default SgbdMetricsChart;
