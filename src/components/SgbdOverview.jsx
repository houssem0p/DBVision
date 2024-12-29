import React, { useEffect, useState } from 'react';

const SgbdOverview = () => {
  const [sgbdData, setSgbdData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate fetching data with a delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Generate random data
        const randomData = {
          version: `8.0.${Math.floor(Math.random() * 30)}`,
          uptime: Math.floor(Math.random() * 1000000),
          openTables: Math.floor(Math.random() * 1000),
          totalQueries: Math.floor(Math.random() * 1000000),
        };

        setSgbdData(randomData);
      } catch (error) {
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 text-white">
      <div className="text-center p-8 bg-gray-800 bg-opacity-80 rounded-lg shadow-2xl w-full max-w-4xl">
        <h2 className="text-4xl font-extrabold mb-8 text-gradient bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">
          SGBD Overview
        </h2>
  
        {sgbdData ? (
          <div className="space-y-6">
            <div className="bg-gray-700 p-6 rounded-lg shadow-lg">
              <p className="text-xl font-semibold text-white mb-4">
                <strong>Version:</strong> {sgbdData.version}
              </p>
            </div>
            <div className="bg-gray-700 p-6 rounded-lg shadow-lg">
              <p className="text-xl font-semibold text-white mb-4">
                <strong>Uptime:</strong> {sgbdData.uptime} seconds
              </p>
            </div>
            <div className="bg-gray-700 p-6 rounded-lg shadow-lg">
              <p className="text-xl font-semibold text-white mb-4">
                <strong>Total Queries:</strong> {sgbdData.totalQueries}
              </p>
            </div>
            <div className="bg-gray-700 p-6 rounded-lg shadow-lg">
              <p className="text-xl font-semibold text-white mb-4">
                <strong>Open Tables:</strong> {sgbdData.openTables}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-red-500 mb-6 text-sm">{error}</p>
        )}
      </div>
    </div>
  );
  
};

export default SgbdOverview;