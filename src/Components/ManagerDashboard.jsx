import React, { useEffect, useState } from 'react';
import { User, Users, UserPlus, Trash2 } from 'lucide-react';
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
    // pop in the window screen
    const confirm = window.confirm('Are you sure you want to delete this coworker?');
    if (!confirm) return;

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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white p-6 rounded-lg shadow flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Manager Dashboard</h1>
            <p className="text-gray-600">Welcome, To Smart Inventory Managment System {user?.username}</p>
          </div>
          <button
            onClick={logout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>

        {/* Add Coworker Button */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-700 flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Coworkers ({coworkers.length})
          </h2>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Add Coworker
          </button>
        </div>

        {/* Add Coworker Form */}
        {showAddForm && (
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">New Coworker</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Username"
                className="border p-2 rounded w-full"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
              <input
                type="password"
                placeholder="Password"
                className="border p-2 rounded w-full"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
            {error && <div className="text-red-600 mb-2">{error}</div>}
            {success && <div className="text-green-600 mb-2">{success}</div>}
            <div className="flex gap-2">
              <button
                onClick={handleAddCoworker}
                disabled={loading}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? 'Adding...' : 'Add'}
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Coworker List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {coworkers.map((c) => (
            <div
              key={c.id}
              className="bg-white p-4 rounded shadow flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <User className="text-blue-600 w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium">{c.username}</p>
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
