import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, BarChart2, AlertTriangle, TrendingUp } from 'react-feather';

const API_BASE_URL = 'https://localhost:7068';

const Dashboard = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch data on mount
  useEffect(() => {
    fetchItems();
    fetchCategories();
  }, []);

  // Fetch items from API
  const fetchItems = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/Item`);
      console.log('Fetched Items:', res.data); // Debugging log
      setItems(res.data);
    } catch (error) {
      console.error('Failed to fetch items:', error);
      setError('Failed to load items data');
      setLoading(false);
    }
  };

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/Category`);
      console.log('Fetched Categories:', res.data); // Debugging log
      setCategories(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      setError('Failed to load categories data');
      setLoading(false);
    }
  };

  // Calculated values
  const totalItems = items.length;
  const totalStock = items.reduce((acc, item) => acc + (item.currentQuantity || 0), 0);
  const lowStockItems = items.filter(item => item.currentQuantity < item.minQuantity);
  const restockableItems = items.filter(item => item.currentQuantity + 10 < item.minQuantity)

  if (loading) {
    return <p className="p-4 text-center">Loading...</p>;
  }

  if (error) {
    return <p className="p-4 text-center text-red-600">{error}</p>;
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Items / Categories</p>
              <p className="text-2xl font-bold text-gray-800">{totalItems} / {categories.length}</p>
            </div>
            <Package className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Stock</p>
              <p className="text-2xl font-bold text-gray-800">{totalStock}</p>
            </div>
            <BarChart2 className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Items Below Stock</p>
              <p className="text-2xl font-bold text-gray-800">{lowStockItems.length}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Items Available for Restock</p>
              <p className="text-2xl font-bold text-gray-800">{restockableItems.length}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
