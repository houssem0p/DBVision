import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Chart from 'react-apexcharts';

const MainPage = () => {
  const [data, setData] = useState([]);
  const [performanceMetrics, setPerformanceMetrics] = useState(null); // New state for performance metrics
  const [blockedQueries, setBlockedQueries] = useState([]); 
  const [monitoringData, setMonitoringData] = useState({ performanceMetrics: [], statusMetrics: [] });
  const [queryExecutionTime, setQueryExecutionTime] = useState([]);
  const [innodbMetrics, setInnodbMetrics] = useState([]);
  const [tableLocks, setTableLocks] = useState([]);
  const [indexUsage, setIndexUsage] = useState([]);
  const [diskIO, setDiskIO] = useState([]);
  
  const [chartData, setChartData] = useState({
    barChart: {
      series: [],
      options: {
        chart: {
          toolbar: { show: false },
          animations: { enabled: true, easing: 'easeinout', speed: 800 },
        },
        xaxis: {
          categories: [],
        },
        theme: {
          palette: 'palette5',
        },
      },
    },
    lineChart: {
      series: [],
      options: {
        chart: {
          toolbar: { show: false },
          animations: { enabled: true, easing: 'easeinout', speed: 800 },
        },
        xaxis: {
          categories: [],
        },
        theme: {
          palette: 'palette5',
        },
      },
    },
    pieChart: {
      series: [],
      options: {
        labels: [],
        theme: {
          palette: 'palette5',
        },
      },
    },
    areaChart: {
      series: [],
      options: {
        chart: {
          type: 'area',
          stacked: true,
          toolbar: { show: false },
        },
        xaxis: {
          categories: [],
        },
        theme: {
          palette: 'palette5',
        },
      },
    },
    radarChart: {
      series: [],
      options: {
        chart: {
          type: 'radar',
        },
        xaxis: {
          categories: [],
        },
        theme: {
          palette: 'palette5',
        },
      },
    },
    heatmapChart: {
      series: [],
      options: {
        chart: {
          type: 'heatmap',
        },
        xaxis: {
          categories: [],
        },
        theme: {
          palette: 'palette5',
        },
      },
    },
    scatterChart: {
      series: [],
      options: {
        chart: {
          type: 'scatter',
        },
        xaxis: {
          categories: [],
        },
        theme: {
          palette: 'palette5',
        },
      },
    },
  });

 // ...existing code...

useEffect(() => {
  const credentials = JSON.parse(localStorage.getItem('dbCredentials'));
  const selectedDb = localStorage.getItem('selectedDb'); // Get the selected database
  if (credentials && selectedDb) {
    const { host, username, password } = credentials;

    const fetchData = () => {
      fetch(`http://localhost:5000/api/database-metrics?host=${host}&username=${username}&password=${password}&database=${selectedDb}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.success && data.metrics.length > 0) {
            const metrics = data.metrics;
            setData(metrics);
            setChartData({
              barChart: {
                series: [{ name: 'Row Count', data: metrics.map((item) => item.value) }],
                options: {
                  ...chartData.barChart.options,
                  xaxis: { categories: metrics.map((item) => item.name) },
                },
              },
              lineChart: {
                series: [{ name: 'Row Count', data: metrics.map((item) => item.value) }],
                options: {
                  ...chartData.lineChart.options,
                  xaxis: { categories: metrics.map((item) => item.name) },
                },
              },
              pieChart: {
                series: metrics.map((item) => item.value),
                options: {
                  ...chartData.pieChart.options,
                  labels: metrics.map((item) => item.name),
                },
              },
              areaChart: {
                series: [{ name: 'Row Count', data: metrics.map((item) => item.value) }],
                options: {
                  ...chartData.areaChart.options,
                  xaxis: { categories: metrics.map((item) => item.name) },
                },
              },
              radarChart: {
                series: [{ name: 'Metrics', data: metrics.map((item) => item.value) }],
                options: {
                  ...chartData.radarChart.options,
                  xaxis: { categories: metrics.map((item) => item.name) },
                },
              },
              heatmapChart: {
                series: metrics.map((item, index) => ({ name: item.name, data: [item.value, item.value * 0.9, item.value * 1.1] })),
                options: {
                  ...chartData.heatmapChart.options,
                  xaxis: { categories: ['Metric 1', 'Metric 2', 'Metric 3'] },
                },
              },
              scatterChart: {
                series: metrics.map((item, index) => ({ name: item.name, data: [[index, item.value]] })),
                options: {
                  ...chartData.scatterChart.options,
                  xaxis: { categories: metrics.map((item) => item.name) },
                },
              },
            });
          }
        })
        .catch((err) => console.error('Error fetching data:', err));
    };
    
    const fetchAdditionalMetrics = () => {
      fetch(`http://localhost:5000/api/query-execution-time?host=${host}&username=${username}&password=${password}`)
        .then((response) => response.json())
        .then((data) => {
          console.log('Query execution time data:', data);
          if (data.success) {
            setQueryExecutionTime(data.queryExecutionTime);
          } else {
            console.error('Error fetching query execution time:', data.message);
          }
        })
        .catch((err) => {
          console.error('Error fetching query execution time:', err.message);
        });

      fetch(`http://localhost:5000/api/innodb-metrics?host=${host}&username=${username}&password=${password}`)
        .then((response) => response.json())
        .then((data) => {
          console.log('InnoDB metrics data:', data);
          if (data.success) {
            setInnodbMetrics(data.innodbMetrics);
          } else {
            console.error('Error fetching InnoDB metrics:', data.message);
          }
        })
        .catch((err) => {
          console.error('Error fetching InnoDB metrics:', err.message);
        });

      fetch(`http://localhost:5000/api/table-locks?host=${host}&username=${username}&password=${password}`)
        .then((response) => response.json())
        .then((data) => {
          console.log('Table locks data:', data);
          if (data.success) {
            setTableLocks(data.tableLocks);
          } else {
            console.error('Error fetching table locks:', data.message);
          }
        })
        .catch((err) => {
          console.error('Error fetching table locks:', err.message);
        });

      fetch(`http://localhost:5000/api/index-usage?host=${host}&username=${username}&password=${password}`)
        .then((response) => response.json())
        .then((data) => {
          console.log('Index usage data:', data);
          if (data.success) {
            setIndexUsage(data.indexUsage);
          } else {
            console.error('Error fetching index usage:', data.message);
          }
        })
        .catch((err) => {
          console.error('Error fetching index usage:', err.message);
        });

      fetch(`http://localhost:5000/api/disk-io?host=${host}&username=${username}&password=${password}`)
        .then((response) => response.json())
        .then((data) => {
          console.log('Disk I/O data:', data);
          if (data.success) {
            setDiskIO(data.diskIO);
          } else {
            console.error('Error fetching disk I/O:', data.message);
          }
        })
        .catch((err) => {
          console.error('Error fetching disk I/O:', err.message);
        });

      
    };
    const fetchPerformanceMetrics = () => {
      fetch(`http://localhost:5000/api/performance-metrics?host=${host}&username=${username}&password=${password}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            setPerformanceMetrics(data);
          }
        })
        .catch((err) => console.error('Error fetching performance metrics:', err));
    };

    const fetchBlockedQueries = () => {
      fetch(`http://localhost:5000/api/blocked-queries?host=${host}&username=${username}&password=${password}&database=${selectedDb}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            setBlockedQueries(data.blockedQueries);
          } else {
            console.error('Error fetching blocked queries:', data.message);
          }
        })
        .catch((err) => {
          console.error('Error fetching blocked queries:', err.message);
        });
    };
   
    const fetchMonitoringData = () => {
      fetch(`http://localhost:5000/api/monitoring-data?host=${host}&username=${username}&password=${password}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            setMonitoringData(data);
          } else {
            console.error('Error fetching monitoring data:', data.message);
          }
        })
        .catch((err) => {
          console.error('Error fetching monitoring data:', err.message);
        });
    };
    fetchData(); // Initial fetch
    fetchPerformanceMetrics(); // Initial fetch for performance metrics
    fetchBlockedQueries(); 
    fetchMonitoringData();
    fetchAdditionalMetrics(); 
    const intervalId = setInterval(() => {
      fetchData();
      fetchPerformanceMetrics();
      fetchBlockedQueries();
      fetchMonitoringData();
      fetchAdditionalMetrics(); 
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }
}, [chartData]);

// ...existing code...
  // ...existing code...

return (
  <div className="main-page bg-gray-900 min-h-screen p-8 font-sans">
    <div className="py-8 px-6">
      <h2 className="text-4xl font-extrabold text-white mb-8 tracking-tight text-center">
        Real-Time Database Monitoring Dashboard
      </h2>
      <p className="text-lg text-gray-400 text-center mb-12 leading-relaxed">
        Monitor your database performance, track key metrics, and ensure smooth operation with real-time insights.
      </p>

      {/* Key Metrics */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
      >
        {data.map((item, index) => (
          <div
            key={index}
            className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            <div className="flex justify-between mb-2">
              <h3 className="text-2xl font-semibold text-purple-500">{item.name}</h3>
              <p className="text-gray-300 text-lg">{item.value}</p>
            </div>
          </div>
        ))}
      </motion.div>


      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {/* Example Chart Section */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300">
          <h3 className="text-2xl font-semibold text-white mb-4">Database Performance Metrics</h3>
          <p className="text-sm text-gray-400 mb-6 leading-relaxed">
            Track the overall performance of your database in real time, including query speed and server load.
          </p>
          <Chart
            options={chartData.barChart.options}
            series={chartData.barChart.series}
            type="bar"
            height={300}
          />
        </div>

        {/* Database Performance Over Time */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-6 rounded-lg shadow-xl transform hover:scale-105 transition-all duration-300">
          <h3 className="text-2xl font-semibold text-white mb-4">Database Performance Over Time</h3>
          <p className="text-sm text-gray-400 mb-6">
            Visualize performance trends over time to understand long-term database health and spot potential issues.
          </p>
          <Chart
            options={chartData.lineChart.options}
            series={chartData.lineChart.series}
            type="line"
            height={250}
          />
        </div>

        {/* Database Metrics Distribution */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-6 rounded-lg shadow-xl transform hover:scale-105 transition-all duration-300">
          <h3 className="text-2xl font-semibold text-white mb-4">Database Metrics Distribution</h3>
          <p className="text-sm text-gray-400 mb-6">
            View the distribution of various metrics such as query types, response times, and server usage.
          </p>
          <Chart
            options={chartData.pieChart.options}
            series={chartData.pieChart.series}
            type="pie"
            height={250}
          />
        </div>

        {/* Database Activity Trends */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-6 rounded-lg shadow-xl transform hover:scale-105 transition-all duration-300">
          <h3 className="text-2xl font-semibold text-white mb-4">Database Activity Trends</h3>
          <p className="text-sm text-gray-400 mb-6">
            Get insights into the activity trends of your database, including queries and server load.
          </p>
          <Chart
            options={chartData.areaChart.options}
            series={chartData.areaChart.series}
            type="area"
            height={250}
          />
        </div>

        {/* Metric Comparisons */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-6 rounded-lg shadow-xl transform hover:scale-105 transition-all duration-300">
          <h3 className="text-2xl font-semibold text-white mb-4">Metric Comparisons</h3>
          <p className="text-sm text-gray-400 mb-6">
            Compare key metrics to evaluate performance differences and make data-driven decisions.
          </p>
          <Chart
            options={chartData.radarChart.options}
            series={chartData.radarChart.series}
            type="radar"
            height={250}
          />
        </div>

        {/* Heatmap Analysis */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-6 rounded-lg shadow-xl transform hover:scale-105 transition-all duration-300">
          <h3 className="text-2xl font-semibold text-white mb-4">Heatmap Analysis</h3>
          <p className="text-sm text-gray-400 mb-6">
            Analyze activity hotspots with heatmaps to pinpoint areas of high server or query load.
          </p>
          <Chart
            options={chartData.heatmapChart.options}
            series={chartData.heatmapChart.series}
            type="heatmap"
            height={250}
          />
        </div>

        {/* Scatter Plot */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-6 rounded-lg shadow-xl transform hover:scale-105 transition-all duration-300">
          <h3 className="text-2xl font-semibold text-white mb-4">Scatter Plot</h3>
          <p className="text-sm text-gray-400 mb-6">
            Explore correlations between various metrics and database performance through scatter plots.
          </p>
          <Chart
            options={chartData.scatterChart.options}
            series={chartData.scatterChart.series}
            type="scatter"
            height={250}
          />
        </div>
      </div>

      {/* Performance Metrics */}
      {performanceMetrics && (
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300">
            <h3 className="text-2xl font-semibold text-white mb-4">CPU Load</h3>
            <p className="text-sm text-gray-400 mb-6">Current CPU load over the last minute:</p>
            <p className="text-lg text-white">{performanceMetrics.system.cpuLoad.toFixed(2)}%</p>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300">
            <h3 className="text-2xl font-semibold text-white mb-4">Memory Usage</h3>
            <p className="text-sm text-gray-400 mb-6">Current memory usage:</p>
            <p className="text-lg text-white">
              {((performanceMetrics.system.memoryUsage.used / performanceMetrics.system.memoryUsage.total) * 100).toFixed(2)}%
            </p>
          </div>
        </div>
      )}

          {/* Additional Metrics */}
    <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
      {/* Query Execution Time */}
      {queryExecutionTime.length > 0 && (
        <div className="mt-12">
          <h3 className="text-2xl font-semibold text-white mb-4">Query Execution Time</h3>
          <div className="overflow-x-auto rounded-lg shadow-lg">
            <table className="min-w-full bg-gray-800 text-white">
              <thead>
                <tr className="bg-gray-700">
                  <th className="px-4 py-2">Event Name</th>
                  <th className="px-4 py-2">Count</th>
                  <th className="px-4 py-2">Total Wait Time</th>
                </tr>
              </thead>
              <tbody>
                {queryExecutionTime.map((metric, index) => (
                  <tr key={index} className="bg-gray-700 hover:bg-gray-600 transition-colors">
                    <td className="px-4 py-2">{metric.event_name}</td>
                    <td className="px-4 py-2">{metric.count}</td>
                    <td className="px-4 py-2">{metric.total_wait_time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* InnoDB Metrics */}
      {innodbMetrics.length > 0 && (
  <div className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-900 p-8 rounded-lg shadow-2xl hover:scale-105 transition-transform duration-300">
    <h3 className="text-2xl font-bold text-white mb-6">InnoDB Metrics</h3>
    <div className="overflow-x-auto">
      <table className="min-w-full bg-gray-900 border border-gray-700 rounded-lg shadow-lg">
        <thead>
          <tr className="bg-gray-700">
            <th className="px-6 py-4 text-left text-white font-semibold text-sm uppercase tracking-wider">
              Metric Name
            </th>
            <th className="px-6 py-4 text-left text-white font-semibold text-sm uppercase tracking-wider">
              Metric Value
            </th>
          </tr>
        </thead>
        <tbody>
          {innodbMetrics.map((metric, index) => (
            <tr
              key={index}
              className={`${
                index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"
              } hover:bg-gray-600 transition-colors`}
            >
              <td className="px-6 py-4 text-sm text-white">{metric.metric_name}</td>
              <td className="px-6 py-4 text-sm text-white">{metric.metric_value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)}

       {/* Table Locks */}
       {tableLocks.length > 0 && (
  <div className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-900 p-8 rounded-lg shadow-2xl hover:scale-105 transition-transform duration-300">
    <h3 className="text-2xl font-bold text-white mb-6">Table Locks</h3>
    <div className="overflow-x-auto">
      <table className="min-w-full bg-gray-900 border border-gray-700 rounded-lg shadow-lg">
        <thead>
          <tr className="bg-gray-700">
            <th className="px-6 py-4 text-left text-white font-semibold text-sm uppercase tracking-wider">
              Schema Name
            </th>
            <th className="px-6 py-4 text-left text-white font-semibold text-sm uppercase tracking-wider">
              Table Name
            </th>
            <th className="px-6 py-4 text-left text-white font-semibold text-sm uppercase tracking-wider">
              Read Locks
            </th>
            <th className="px-6 py-4 text-left text-white font-semibold text-sm uppercase tracking-wider">
              Write Locks
            </th>
          </tr>
        </thead>
        <tbody>
          {tableLocks.map((lock, index) => (
            <tr
              key={index}
              className={`${
                index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"
              } hover:bg-gray-600 transition-colors`}
            >
              <td className="px-6 py-4 text-sm text-white">{lock.schema_name}</td>
              <td className="px-6 py-4 text-sm text-white">{lock.table_name}</td>
              <td className="px-6 py-4 text-sm text-white">{lock.read_locks}</td>
              <td className="px-6 py-4 text-sm text-white">{lock.write_locks}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)}


      {/* Index Usage */}
      {indexUsage.length > 0 && (
  <div className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-900 p-8 rounded-lg shadow-2xl hover:scale-105 transition-transform duration-300">
    <h3 className="text-2xl font-bold text-white mb-6">Index Usage</h3>
    <div className="overflow-x-auto">
      <table className="min-w-full bg-gray-900 border border-gray-700 rounded-lg shadow-lg">
        <thead>
          <tr className="bg-gray-700">
            <th className="px-6 py-4 text-left text-white font-semibold text-sm uppercase tracking-wider">
              Schema Name
            </th>
            <th className="px-6 py-4 text-left text-white font-semibold text-sm uppercase tracking-wider">
              Table Name
            </th>
            <th className="px-6 py-4 text-left text-white font-semibold text-sm uppercase tracking-wider">
              Index Name
            </th>
            <th className="px-6 py-4 text-left text-white font-semibold text-sm uppercase tracking-wider">
              Fetches
            </th>
            <th className="px-6 py-4 text-left text-white font-semibold text-sm uppercase tracking-wider">
              Inserts
            </th>
            <th className="px-6 py-4 text-left text-white font-semibold text-sm uppercase tracking-wider">
              Updates
            </th>
            <th className="px-6 py-4 text-left text-white font-semibold text-sm uppercase tracking-wider">
              Deletes
            </th>
          </tr>
        </thead>
        <tbody>
          {indexUsage.map((indexItem, idx) => (
            <tr
              key={idx}
              className={`${
                idx % 2 === 0 ? "bg-gray-800" : "bg-gray-700"
              } hover:bg-gray-600 transition-colors`}
            >
              <td className="px-6 py-4 text-sm text-white">
                {indexItem.schema_name}
              </td>
              <td className="px-6 py-4 text-sm text-white">
                {indexItem.table_name}
              </td>
              <td className="px-6 py-4 text-sm text-white">
                {indexItem.index_name}
              </td>
              <td className="px-6 py-4 text-sm text-white">
                {indexItem.fetches}
              </td>
              <td className="px-6 py-4 text-sm text-white">
                {indexItem.inserts}
              </td>
              <td className="px-6 py-4 text-sm text-white">
                {indexItem.updates}
              </td>
              <td className="px-6 py-4 text-sm text-white">
                {indexItem.deletes}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)}


      
      {/* Disk I/O */}
      {diskIO.length > 0 && (
  <div className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-900 p-8 rounded-lg shadow-2xl hover:scale-105 transition-transform duration-300">
    <h3 className="text-2xl font-bold text-white mb-6">Disk I/O</h3>
    <div className="overflow-x-auto">
      <table className="min-w-full bg-gray-900 border border-gray-700 rounded-lg shadow-lg">
        <thead>
          <tr className="bg-gray-700">
            <th className="px-6 py-4 text-left text-white font-semibold text-sm uppercase tracking-wider">
              File Name
            </th>
            <th className="px-6 py-4 text-left text-white font-semibold text-sm uppercase tracking-wider">
              Read Count
            </th>
            <th className="px-6 py-4 text-left text-white font-semibold text-sm uppercase tracking-wider">
              Write Count
            </th>
            <th className="px-6 py-4 text-left text-white font-semibold text-sm uppercase tracking-wider">
              Read Time
            </th>
            <th className="px-6 py-4 text-left text-white font-semibold text-sm uppercase tracking-wider">
              Write Time
            </th>
          </tr>
        </thead>
        <tbody>
          {diskIO.map((io, index) => (
            <tr
              key={index}
              className={`${
                index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"
              } hover:bg-gray-600 transition-colors`}
            >
              <td className="px-6 py-4 text-sm text-white">
                {io.file_name}
              </td>
              <td className="px-6 py-4 text-sm text-white">
                {io.read_count}
              </td>
              <td className="px-6 py-4 text-sm text-white">
                {io.write_count}
              </td>
              <td className="px-6 py-4 text-sm text-white">
                {io.read_time}
              </td>
              <td className="px-6 py-4 text-sm text-white">
                {io.write_time}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)}
{monitoringData.performanceMetrics.length > 0 && (
  <div className="mt-12 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-900 p-8 rounded-lg shadow-2xl">
    <h3 className="text-2xl font-bold text-white mb-6">Top 10 Wait Events</h3>
    <div className="overflow-x-auto">
      <table className="min-w-full bg-gray-900 border border-gray-700 rounded-lg shadow-lg">
        <thead>
          <tr className="bg-gray-700">
            <th className="px-6 py-4 text-left text-white font-semibold text-sm uppercase tracking-wider">
              Event Name
            </th>
            <th className="px-6 py-4 text-left text-white font-semibold text-sm uppercase tracking-wider">
              Count
            </th>
            <th className="px-6 py-4 text-left text-white font-semibold text-sm uppercase tracking-wider">
              Total Wait Time
            </th>
          </tr>
        </thead>
        <tbody>
          {monitoringData.performanceMetrics.map((metric, index) => (
            <tr
              key={index}
              className={`${
                index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"
              } hover:bg-gray-600 transition-colors`}
            >
              <td className="px-6 py-4 text-sm text-white">{metric.event_name}</td>
              <td className="px-6 py-4 text-sm text-white">{metric.count}</td>
              <td className="px-6 py-4 text-sm text-white">{metric.total_wait_time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)}

{blockedQueries.length > 0 && (
  <div className="mt-12 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-900 p-8 rounded-lg shadow-2xl">
    <h3 className="text-2xl font-bold text-white mb-6">Blocked Queries</h3>
    <div className="overflow-x-auto">
      <table className="min-w-full bg-gray-900 border border-gray-700 rounded-lg shadow-lg">
        <thead>
          <tr className="bg-gray-700">
            <th className="px-6 py-4 text-left text-white font-semibold text-sm uppercase tracking-wider">
              Process ID
            </th>
            <th className="px-6 py-4 text-left text-white font-semibold text-sm uppercase tracking-wider">
              User
            </th>
            <th className="px-6 py-4 text-left text-white font-semibold text-sm uppercase tracking-wider">
              Host
            </th>
            <th className="px-6 py-4 text-left text-white font-semibold text-sm uppercase tracking-wider">
              Database
            </th>
            <th className="px-6 py-4 text-left text-white font-semibold text-sm uppercase tracking-wider">
              Command
            </th>
            <th className="px-6 py-4 text-left text-white font-semibold text-sm uppercase tracking-wider">
              Time
            </th>
            <th className="px-6 py-4 text-left text-white font-semibold text-sm uppercase tracking-wider">
              State
            </th>
            <th className="px-6 py-4 text-left text-white font-semibold text-sm uppercase tracking-wider">
              Query
            </th>
          </tr>
        </thead>
        <tbody>
          {blockedQueries.map((query, index) => (
            <tr
              key={index}
              className={`${
                index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"
              } hover:bg-gray-600 transition-colors`}
            >
              <td className="px-6 py-4 text-sm text-white">{query.process_id}</td>
              <td className="px-6 py-4 text-sm text-white">{query.user}</td>
              <td className="px-6 py-4 text-sm text-white">{query.host}</td>
              <td className="px-6 py-4 text-sm text-white">{query.database}</td>
              <td className="px-6 py-4 text-sm text-white">{query.command}</td>
              <td className="px-6 py-4 text-sm text-white">{query.time}</td>
              <td className="px-6 py-4 text-sm text-white">{query.state}</td>
              <td className="px-6 py-4 text-sm text-white">{query.query}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)}

    </div>
  </div>
  </div>
  );
};

export default MainPage;