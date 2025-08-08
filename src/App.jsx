import React, { useEffect, useState } from 'react';
// import { useAuth, AuthProvider } from './AuthContext'; // Your auth context file
import { Package, Plus, Tag, Archive, TrendingUp, BarChart2, User} from 'react-feather';

import AddCategory from './Components/AddCategory';
import AddItem from './Components/AddItem';
import AllItems from './Components/AllItems';
import Reports from './Components/Reports';
import StockManagement from './Components/StockManagement';
import Dashboard from './Components/Dashboard';
import LowStockAlert from './Components/LowStockAlert'; 
import EmployeeDashboard from './Components/EmployeeDashboard';
import ManagerDashboard from './Components/ManagerDashboard';
import Login from './Components/LoginForm'; // Your Login component
import RegisterForm from './Components/RegisterForm'
import { useAuth, AuthProvider } from './context/AuthContext';

import { onMessage } from "firebase/messaging";
import { messaging } from './firebase/firebaseConfig';

const AppContent = () => {

  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = React.useState('dashboard'); // Default tab
  const [showRegister, setShowRegister] = useState(false);


    React.useEffect(() => {
        if (user) {
        setActiveTab('dashboard');
        }
    }, [user]);

    const shownMessages = new Set();

  //   useEffect(() => {
  //   const unsubscribe = onMessage(messaging, (payload) => {
  //     const messageId = payload?.messageId || payload?.data?.messageId;
  //     const title = payload.notification?.title || "Notification received!";
  //     const body = payload.notification?.body || "";
  //     const data = payload.data || {};

  //     if (messageId) {
  //       console.log("✅ Message ID:", messageId);
  //     }

  //     if (messageId) {
  //       alert(
  //         `📬 ${title}\n\n${body}\n`
  //       );
  //     }
  //   });

  //   return () => unsubscribe();
  // }, []);

  // While loading auth info, show loading message
  if (loading) return <p className="p-4 text-center">Loading...</p>;

  // If no user, redirect to login (render login component)
    if (!user) {
    return showRegister ? (
        <RegisterForm onToggleForm={() => setShowRegister(false)} />
    ) : (
        <Login onToggleForm={() => setShowRegister(true)} />
    );
    }


  // Define tabs based on role
  // Manager sees all tabs except coworker profile
  // Coworker sees only dashboard, all items and stock management
  const tabsForManager = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart2 },
    { id: 'add-item', label: 'Add Item', icon: Plus },
    { id: 'add-category', label: 'Add Category', icon: Tag },
    { id: 'all-items', label: 'All Items', icon: Package },
    { id: 'stock-management', label: 'Stock Management', icon: Archive },
    { id: 'reports', label: 'Reports', icon: TrendingUp },
    { id: 'ManagProfile', label: 'Profile', icon: User },
  ];

  const tabsForCoworker = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart2 },
    { id: 'all-items', label: 'All Items', icon: Package },
    { id: 'stock-management', label: 'Stock Management', icon: Archive },
    { id: 'EmpProfile', label: 'Profile', icon: User },
  ];

  const tabs = user.role.toLowerCase() === 'manager' ? tabsForManager : tabsForCoworker;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}

      <header className="bg-white shadow-md border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 animate-fade-down">
          <div className="flex items-center justify-between">
            {/* Logo & Title */}
            <div className="flex items-center space-x-3 group transition duration-300">
              <Package className="w-9 h-9 text-blue-600 group-hover:scale-110 group-hover:rotate-6 transition duration-300" />
              <h1 className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent animate-gradient-x">
                Smart Inventory Management System
              </h1>
            </div>

            {/* User Info */}
            <div className="text-sm text-gray-700 font-medium bg-gray-100 px-4 py-2 rounded-lg shadow-inner animate-fade-in">
              <span className="text-blue-600 font-semibold">{user.username}</span> Role:{' '}
              <span className="text-purple-600 font-semibold">{user.role}</span>
            </div>
          </div>
        </div>
      </header>


      {/* Navigation */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-4 py-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`group flex items-center space-x-2 px-4 py-2 rounded-md transition duration-200 transform
                    ${
                      isActive
                        ? 'bg-blue-100 text-blue-700 shadow-inner shadow-black-300'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800 hover:shadow'
                    }
                    hover:scale-105`}
                >
                  <Icon
                    className={`w-4 h-4 transition ${
                      isActive ? 'text-blue-600' : 'group-hover:text-blue-500'
                    }`}
                  />
                  <span className="text-sm font-medium">{tab.label}</span>
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
            <Dashboard setActiveTab={setActiveTab} />
            <div className="mt-10">
              <LowStockAlert />
            </div>
            
          </>
          
        )}

        {activeTab === 'add-item' && user.role.toLowerCase() === 'manager' && <AddItem />}
        {activeTab === 'add-category' && user.role.toLowerCase() === 'manager' && <AddCategory />}
        {activeTab === 'all-items' && <AllItems />}
        {activeTab === 'stock-management' && <StockManagement />}
        {activeTab === 'reports' && user.role.toLowerCase() === 'manager' && <Reports />}
        {activeTab === 'low-stock' && <LowStockAlert />}
        {activeTab === 'EmpProfile' && user.role.toLowerCase() !== 'manager' && <EmployeeDashboard />}
        {activeTab === 'ManagProfile' && user.role.toLowerCase() === 'manager' && <ManagerDashboard />}
      </main>
    </div>
  );
};

const App = () => (
  <AuthProvider>
    <AppContent />
      <div className="mt-8 text-center text-sm text-gray-400">
        &copy; {new Date().getFullYear()} Smart Inventory Management System. All rights reserved.
      </div>

  </AuthProvider>
);

export default App;
