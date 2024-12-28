import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaDatabase, FaChartBar, FaCog, FaServer } from 'react-icons/fa'; // Added FaServer icon for SGBD Monitoring

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [notifications, setNotifications] = useState([]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const fetchNotifications = async () => {
    try {
      const response = await fetch('http://localhost/fetch-notifications.php');
      const data = await response.json();
      if (data.success) {
        setNotifications(data.notifications);
      } else {
        console.error('Failed to fetch notifications:', data.error);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const clearNotifications = async () => {
    try {
      const response = await fetch('http://localhost/clear-notifications.php', {
        method: 'POST',
      });
      const data = await response.json();
      if (data.success) {
        setNotifications([]);
      } else {
        console.error('Failed to clear notifications:', data.error);
      }
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <aside
      className={`bg-gray-900 text-white p-6 shadow-md transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'w-64' : 'w-20'
      } sm:w-64 md:w-64 lg:w-64`}
    >
      <button onClick={toggleSidebar} className="text-white mb-6">
        {isOpen ? 'Close' : 'Open'}
      </button>
      {isOpen && (
        <div>
          <h2 className="text-xl font-bold mb-6">Navigation</h2>
          <ul className="space-y-6">
            {/* Database Monitoring */}
            <li>
              <NavLink
                to="/database-monitoring"
                className="flex items-center space-x-2 hover:text-blue-400 transition-colors"
              >
                <FaDatabase className="w-5 h-5" />
                {isOpen && <span>Database Monitoring</span>}
              </NavLink>
            </li>
            {/* Data Visualization */}
            <li>
              <NavLink
                to="/data-visualization"
                className="flex items-center space-x-2 hover:text-blue-400 transition-colors"
              >
                <FaChartBar className="w-5 h-5" />
                {isOpen && <span>Data Visualization</span>}
              </NavLink>
            </li>
            {/* Manage Data */}
            <li>
              <NavLink
                to="/manage-data"
                className="flex items-center space-x-2 hover:text-blue-400 transition-colors"
              >
                <FaCog className="w-5 h-5" />
                {isOpen && <span>Manage Data</span>}
              </NavLink>
            </li>
            {/* New SGBD Monitoring */}
            <li>
              <NavLink
                to="/sgbd-monitoring" // Link to SGBD Monitoring page
                className="flex items-center space-x-2 hover:text-blue-400 transition-colors"
              >
                <FaServer className="w-5 h-5" /> {/* FaServer icon for SGBD */}
                {isOpen && <span>SGBD Monitoring</span>}
              </NavLink>
            </li>
          </ul>

          {/* Notifications Section */}
          <h2 className="text-xl font-bold mt-6 mb-4 flex items-center">
            Notifications
            {notifications.length > 0 && (
              <span className="ml-2 text-xs bg-blue-500 text-white rounded-full px-2 py-1">
                {notifications.length}
              </span>
            )}
          </h2>

          <ul className="space-y-4 overflow-y-auto max-h-64">
            {notifications.map((notification) => (
              <li
                key={notification.id}
                className="bg-gray-800 p-4 rounded-lg shadow-md transition-all duration-300 hover:bg-gray-700"
              >
                <div className="text-sm text-gray-400">
                  {new Date(notification.timestamp).toLocaleString()}
                </div>
                <div className="text-white">{notification.message}</div>
              </li>
            ))}
          </ul>
          <button
            onClick={clearNotifications}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-500 mt-4"
          >
            Clear Notifications
          </button>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
