import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-gray-900 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">DBVision</h1>
        <ul className="flex space-x-6">
          <li><a href="/" className="hover:text-blue-400 transition-colors">Home</a></li>
          <li><a href="/login" className="hover:text-blue-400 transition-colors">Login</a></li>
          <li><a href="/main" className="hover:text-blue-400 transition-colors">Dashboard</a></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
