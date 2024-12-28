import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import DemoPage from './components/DemoPage';
import LoginPage from './components/LoginPage';
import MainPage from './components/MainPage';
import SgbdOverview from './components/SgbdOverview';
import DashboardChoicePage from './components/DashboardChoicePage'; // Import DashboardChoicePage

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Login state

  // Function to handle successful login
  const handleLoginSuccess = () => {
    setIsLoggedIn(true); // Update login state
  };

  return (
    <Router>
      <div className="flex flex-col h-screen">
        {/* Navbar */}
        <Navbar />

        <div className="flex flex-1">
          <div className="flex-1 overflow-y-auto">
            <Routes>
              <Route path="/" element={<DemoPage />} />
              <Route
                path="/login"
                element={<LoginPage onLoginSuccess={handleLoginSuccess} />}
              />
              <Route
                path="/choices"
                element={
                  isLoggedIn ? (
                    <DashboardChoicePage />
                  ) : (
                    <RedirectToLogin />
                  )
                }
              />
              <Route
                path="/main"
                element={
                  isLoggedIn ? (
                    <MainPage />
                  ) : (
                    <RedirectToLogin />
                  )
                }
              />
              <Route
                path="/sgbd-overview"
                element={
                  isLoggedIn ? (
                    <SgbdOverview />
                  ) : (
                    <RedirectToLogin />
                  )
                }
              />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
};

// Redirect component for unauthenticated access
const RedirectToLogin = () => {
  const navigate = useNavigate();

  React.useEffect(() => {
    navigate('/login'); // Redirect to login page
  }, [navigate]);

  return null; // Render nothing while redirecting
};

export default App;