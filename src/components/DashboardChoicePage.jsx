import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const DashboardChoicePage = () => {
  const [databases, setDatabases] = useState([]);
  const [selectedDb, setSelectedDb] = useState('');
  const [error, setError] = useState('');
  const [isDbDashboard, setIsDbDashboard] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDatabases = async () => {
      try {
        const dbCredentials = JSON.parse(localStorage.getItem('dbCredentials'));
        if (!dbCredentials) {
          setError('No credentials found. Please log in again.');
          return;
        }

        const response = await axios.get('http://localhost:5000/api/databases', {
          params: {
            host: dbCredentials.host,
            username: dbCredentials.username,
            password: dbCredentials.password,
          },
        });

        if (response.data && response.data.databases) {
          setDatabases(response.data.databases);
        } else {
          setError('No databases found.');
        }
      } catch (error) {
        console.error('Error fetching databases:', error);
        setError('Failed to load databases.');
      }
    };

    if (isDbDashboard) {
      fetchDatabases();
    }
  }, [isDbDashboard]);

  const handleChoice = (choice) => {
    if (choice === 'sgbd') {
      navigate('/sgbd-overview'); // Navigate to the SGBD Dashboard
    } else if (choice === 'database') {
      setIsDbDashboard(true); // Show database selection
    }
  };

  const handleSubmitDatabase = () => {
    if (selectedDb) {
      // Store the selected database in localStorage
      localStorage.setItem('selectedDb', selectedDb);
      // Proceed to MainPage with the selected database
      navigate('/main'); // MainPage is your "Database Dashboard"
    } else {
      setError('Please select a database.');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 text-white">
      <div className="text-center p-8 bg-gray-800 bg-opacity-80 rounded-lg shadow-2xl w-full max-w-4xl">
        <h2 className="text-4xl font-extrabold mb-8 text-gradient bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">
          Choose Your Monitoring Dashboard
        </h2>
  
        <div className="flex flex-wrap justify-center gap-6">
          <div className="bg-gray-700 p-6 rounded-lg hover:bg-gray-600 transition-all transform hover:scale-105 shadow-lg w-full sm:w-1/3">
            <h3 className="text-xl font-semibold text-white mb-4">SGBD Dashboard</h3>
            <button
              className="bg-purple-600 px-6 py-3 text-white rounded-lg w-full hover:bg-purple-700 transition-transform transform hover:scale-105"
              onClick={() => handleChoice('sgbd')}
            >
              Go to SGBD
            </button>
          </div>
  
          <div className="bg-gray-700 p-6 rounded-lg hover:bg-gray-600 transition-all transform hover:scale-105 shadow-lg w-full sm:w-1/3">
            <h3 className="text-xl font-semibold text-white mb-4">Database Dashboard</h3>
            <button
              className="bg-blue-600 px-6 py-3 text-white rounded-lg w-full hover:bg-blue-700 transition-transform transform hover:scale-105"
              onClick={() => handleChoice('database')}
            >
              Go to Database
            </button>
          </div>
        </div>
  
        {isDbDashboard && (
          <div className="mt-6">
            <h3 className="text-2xl font-semibold mb-6 text-gradient bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
              Select a Database
            </h3>
            {error && <p className="text-red-500 mb-6 text-sm">{error}</p>}
            {databases.length > 0 ? (
              <>
                <select
                  className="w-full p-4 bg-gray-700 text-white rounded-lg mb-6 shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={selectedDb}
                  onChange={(e) => setSelectedDb(e.target.value)}
                >
                  <option value="">Select a database</option>
                  {databases.map((db, index) => (
                    <option key={index} value={db}>
                      {db}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleSubmitDatabase}
                  className="bg-blue-600 px-6 py-3 text-white rounded-lg w-full hover:bg-blue-700 transition-transform transform hover:scale-105"
                >
                  Start Monitoring Database
                </button>
              </>
            ) : (
              <p className="text-gray-400">No databases available for monitoring.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
  
  
  
  
};

export default DashboardChoicePage;