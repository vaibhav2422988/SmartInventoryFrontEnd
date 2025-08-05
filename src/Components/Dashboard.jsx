import React, { useState, useEffect } from 'react';
import { Package, BarChart2, AlertTriangle, TrendingUp } from 'react-feather';
import apiService from '../apiService';

const Dashboard = ({ setActiveTab }) => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchItems();
    fetchCategories();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await apiService.getItems();
      setItems(res);
    } catch (error) {
      console.error('Failed to fetch items:', error);
      setError('Failed to load items data');
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await apiService.getCategories();
      setCategories(res);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      setError('Failed to load categories data');
      setLoading(false);
    }
  };

  const totalItems = items.length;
  const totalStock = items.reduce((acc, item) => acc + (item.currentQuantity || 0), 0);
  const lowStockItems = items.filter(item => item.currentQuantity < item.minQuantity);
  const restockableItems = items.filter(item => item.currentQuantity + 10 < item.minQuantity);

  if (loading) return <p className="p-4 text-center">Loading...</p>;
  if (error) return <p className="p-4 text-center text-red-600">{error}</p>;

  const cardClasses = `bg-white rounded-lg shadow-md p-6 cursor-pointer 
    transition duration-200 transform hover:scale-105`;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Total Items / Categories */}
        <div
          className={`${cardClasses} border-l-4 border-blue-500 hover:shadow-lg hover:bg-blue-50 hover:shadow-blue-300`}
          onClick={() => setActiveTab('all-items')}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Items / Categories</p>
              <p className="text-2xl font-bold text-gray-800">
                {totalItems} / {categories.length}
              </p>
            </div>
            <Package className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        {/* Total Stock */}
        <div
          className={`${cardClasses} border-l-4 border-green-500 hover:shadow-lg hover:bg-green-50 hover:shadow-green-300`}
          onClick={() => setActiveTab('stock-management')}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Stock</p>
              <p className="text-2xl font-bold text-gray-800">{totalStock}</p>
            </div>
            <BarChart2 className="w-8 h-8 text-green-500" />
          </div>
        </div>

        {/* Items Below Stock */}
        <div
          className={`${cardClasses} border-l-4 border-yellow-500 hover:shadow-lg hover:shadow-yellow-300 hover:bg-yellow-50 `}
          onClick={() => setActiveTab('low-stock')}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Items Below Stock</p>
              <p className="text-2xl font-bold text-gray-800">{lowStockItems.length}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-yellow-500" />
          </div>
        </div>

        {/* Items Available for Restock */}
        <div
          className={`${cardClasses} border-l-4 border-purple-600 shadow-purple-300  hover:shadow-lg  
            hover:shadow-purple-500 hover:bg-purple-100`}
          onClick={() => setActiveTab('low-stock')}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Items Available for Restock</p>
              <p className="text-2xl font-bold text-gray-800">{restockableItems.length}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
