import React, { useState } from 'react';
import {
  Package,
  Plus,
  Tag,
  Archive,
  TrendingUp,
  BarChart2
} from 'react-feather';

import AddCategory from './Components/AddCategory';
import AddItem from './Components/AddItem';
import AllItems from './Components/AllItems';
import Reports from './Components/Reports';
import StockManagement from './Components/StockManagement';
import Dashboard from './Components/Dashboard';
import LowStockAlert from './Components/LowStockAlert'; 

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard'); // Default active tab

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Package className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">
                Inventory Management System
              </h1>
            </div>
            <div className="text-sm text-gray-600">
              Total Value:{' '}
              <span className="font-semibold text-green-600">
                $12345.67
              </span>{' '}
              {/* Replace with dynamic value if needed */}
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-8">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart2 },
              { id: 'add-item', label: 'Add Item', icon: Plus },
              { id: 'add-category', label: 'Add Category', icon: Tag },
              { id: 'all-items', label: 'All Items', icon: Package },
              { id: 'stock-management', label: 'Stock Management', icon: Archive },
              { id: 'reports', label: 'Reports', icon: TrendingUp }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'dashboard' && (
          <>
            <Dashboard />
            <div className="mt-10">
              <LowStockAlert />
            </div>
          </>
        )}
        {activeTab === 'add-item' && <AddItem />}
        {activeTab === 'add-category' && <AddCategory />}
        {activeTab === 'all-items' && <AllItems />}
        {activeTab === 'stock-management' && <StockManagement />}
        {activeTab === 'reports' && <Reports />}
      </main>
    </div>
  );
};

export default App;
