import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = ({ onLoginSuccess }) => {
  const [host, setHost] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ host, username, password }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        localStorage.setItem('dbCredentials', JSON.stringify({ host, username, password }));
        onLoginSuccess();
        navigate('/choices'); // Navigate to the choice page after successful login
      } else {
        setError(result.message || 'Invalid credentials or unable to connect to the server.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Unable to connect to the server. Please check your network connection.');
    }
  };

  return (
    <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 min-h-screen flex items-center justify-center px-4 py-8">
      <div className="bg-gray-800 rounded-lg shadow-lg p-8 sm:w-96 w-full max-w-md">
        <h2 className="text-3xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500 mb-6">
          DBVision Login
        </h2>
        {error && <p className="text-red-500 text-center mb-4 text-sm">{error}</p>}
        
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="host" className="text-gray-300 font-semibold">Host:</label>
            <input
              type="text"
              id="host"
              value={host}
              onChange={(e) => setHost(e.target.value)}
              className="w-full mt-2 p-3 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-transform transform hover:scale-105"
              placeholder="Enter host"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="username" className="text-gray-300 font-semibold">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full mt-2 p-3 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-transform transform hover:scale-105"
              placeholder="Enter username"
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="password" className="text-gray-300 font-semibold">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-2 p-3 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-transform transform hover:scale-105"
              placeholder="Enter password"
            />
          </div>
          
          <button
            type="submit"
            className="w-full py-3 px-6 bg-purple-600 text-white rounded-md shadow-md hover:bg-purple-700 transition duration-300 transform hover:scale-105"
          >
            Connect
          </button>
        </form>
      </div>
    </div>
  );
  
  
  
};

export default LoginPage;