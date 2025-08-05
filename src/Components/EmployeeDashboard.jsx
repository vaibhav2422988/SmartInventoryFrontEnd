import React from 'react';
import { useAuth } from '../context/AuthContext';

const EmployeeDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="bg-white rounded shadow-md p-6 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Employee Dashboard</h1>
        <p className="text-gray-700 mb-6">Hello, <strong>{user?.username}</strong>!</p>
        
        <div className="space-y-4">
          <p className="text-gray-600">You can view your tasks, update status, and collaborate with your team here.</p>
          {/* You can insert components like task list, messages, etc. */}
        </div>

        <button
          onClick={logout}
          className="mt-6 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
