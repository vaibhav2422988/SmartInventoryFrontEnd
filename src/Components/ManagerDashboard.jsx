import React, { useEffect, useState } from 'react';
import { User, Users, UserPlus, Trash2, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import apiService from '../apiService';

const ManagerDashboard = () => {
  const { user, logout } = useAuth();

  const [coworkers, setCoworkers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchCoworkers();
  }, []);

  const fetchCoworkers = async () => {
    try {
      const data = await apiService.getCoworkers();
      setCoworkers(data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch coworkers.');
    }
  };

  const handleAddCoworker = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await apiService.addCoworker(formData);
      setSuccess('Coworker added successfully!');
      setFormData({ username: '', password: '' });
      setShowAddForm(false);
      fetchCoworkers();
    } catch (err) {
      setError(err.message || 'Failed to add coworker.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCoworker = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this coworker?');
    if (!confirmDelete) return;

    try {
      await apiService.deleteCoworker(id);
      setSuccess('Coworker deleted successfully!');
      fetchCoworkers();
    } catch (err) {
      console.error(err);
      setError('Failed to delete coworker.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white p-6 rounded-xl shadow-md flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Manager Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Welcome to Smart Inventory Management, <span className="font-semibold">{user?.username}</span>
            </p>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>

        {/* Coworker Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
            <Users className="w-6 h-6" />
            Coworkers <span className="text-blue-600">({coworkers.length})</span>
          </h2>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition"
          >
            <UserPlus className="w-4 h-4" />
            Add Coworker
          </button>
        </div>

        {/* Add Form */}
        {showAddForm && (
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-bold text-gray-700 mb-4">Add New Coworker</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Username"
                className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
              <input
                type="password"
                placeholder="Password"
                className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            {error && <div className="text-red-600 mb-3 animate-pulse">{error}</div>}
            {success && <div className="text-green-600 mb-3 animate-pulse">{success}</div>}

            <div className="flex gap-3">
              <button
                onClick={handleAddCoworker}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition disabled:opacity-50"
              >
                {loading ? 'Adding...' : 'Add'}
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Coworker List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {coworkers.map((c) => (
            <div
              key={c.id}
              className="bg-white p-5 rounded-xl shadow-md flex justify-between items-center hover:shadow-lg transition"
            >
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <User className="text-blue-600 w-6 h-6" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-800">{c.username}</p>
                  <p className="text-sm text-gray-500">{c.role}</p>
                </div>
              </div>
              <button
                onClick={() => handleDeleteCoworker(c.id)}
                className="text-red-600 hover:text-red-800"
                title="Delete"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
