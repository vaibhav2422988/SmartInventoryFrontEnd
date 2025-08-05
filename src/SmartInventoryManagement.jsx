import React, { useState, useEffect } from 'react';
import { Package, Plus, BarChart3, AlertTriangle, Search, Filter, Eye, Edit, Trash2, TrendingUp, TrendingDown, Users, ShoppingCart, X, Warehouse, Tags } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, ResponsiveContainer } from 'recharts';

const InventoryManagementSystem = () => {
    
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [restockQuantity, setRestockQuantity] = useState('');
  
  const [inventory, setInventory] = useState([
    { id: 1, name: 'Wireless Headphones', category: 'Electronics', stock: 5, minQuantity: 10, price: 99.99 },
    { id: 2, name: 'Coffee Mug', category: 'Kitchen', stock: 15, minQuantity: 20, price: 12.99 },
    { id: 3, name: 'Notebook', category: 'Stationery', stock: 3, minQuantity: 15, price: 5.99 },
    { id: 4, name: 'USB Cable', category: 'Electronics', stock: 25, minQuantity: 30, price: 8.99 },
    { id: 5, name: 'Water Bottle', category: 'Kitchen', stock: 8, minQuantity: 12, price: 15.99 },
    { id: 6, name: 'Pen Set', category: 'Stationery', stock: 2, minQuantity: 20, price: 19.99 },
  ]);

  // Predefined categories
  const [categoriesList, setCategoriesList] = useState(['Electronics', 'Kitchen', 'Stationery', 'Clothing', 'Books', 'Sports']);
  const [newCategoryName, setNewCategoryName] = useState('');

  // Form states for adding new items
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState('');
  const [minQuantity, setMinQuantity] = useState('');
  const [price, setPrice] = useState('');

  // Edit form states
  const [editName, setEditName] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editStock, setEditStock] = useState('');
  const [editMinQuantity, setEditMinQuantity] = useState('');
  const [editPrice, setEditPrice] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  // Get low stock items
  const lowStockItems = inventory.filter(item => item.stock < item.minQuantity);
  
  // Get items available for restock (items that are not at full capacity)
  const restockableItems = inventory.filter(item => item.stock < item.minQuantity * 2);

  // Get categories for analytics
  const categories = [...new Set(inventory.map(item => item.category))];
  
  // Prepare data for charts
  const categoryData = categories.map(category => ({
    name: category,
    value: inventory.filter(item => item.category === category).length,
    stock: inventory.filter(item => item.category === category).reduce((sum, item) => sum + item.stock, 0)
  }));

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff88'];

  // Filter inventory for display
  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === '' || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddItem = (e) => {
    e.preventDefault();
    if (name && category && stock && minQuantity && price) {
      const item = {
        id: Math.max(...inventory.map(i => i.id)) + 1,
        name: name,
        category: category,
        stock: parseInt(stock),
        minQuantity: parseInt(minQuantity),
        price: parseFloat(price)
      };
      setInventory([...inventory, item]);
      setName('');
      setCategory('');
      setStock('');
      setMinQuantity('');
      setPrice('');
    }
  };

  const handleDeleteItem = (id) => {
    setInventory(inventory.filter(item => item.id !== id));
  };

  const handleEditItem = (item) => {
    setSelectedItem(item);
    setEditName(item.name);
    setEditCategory(item.category);
    setEditStock(item.stock.toString());
    setEditMinQuantity(item.minQuantity.toString());
    setEditPrice(item.price.toString());
    setShowEditModal(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (selectedItem && editName && editCategory && editStock && editMinQuantity && editPrice) {
      setInventory(inventory.map(item => 
        item.id === selectedItem.id 
          ? { 
              ...item, 
              name: editName,
              category: editCategory,
              stock: parseInt(editStock),
              minQuantity: parseInt(editMinQuantity),
              price: parseFloat(editPrice)
            }
          : item
      ));
      setShowEditModal(false);
      setSelectedItem(null);
      setEditName('');
      setEditCategory('');
      setEditStock('');
      setEditMinQuantity('');
      setEditPrice('');
    }
  };

  const handleRestock = (item) => {
    setSelectedItem(item);
    setShowRestockModal(true);
  };

  const handleRestockSubmit = (e) => {
    e.preventDefault();
    if (selectedItem && restockQuantity) {
      setInventory(inventory.map(item => 
        item.id === selectedItem.id 
          ? { ...item, stock: item.stock + parseInt(restockQuantity) }
          : item
      ));
      setShowRestockModal(false);
      setSelectedItem(null);
      setRestockQuantity('');
    }
  };

  const handleStockChange = (id, change) => {
    setInventory(inventory.map(item => 
      item.id === id 
        ? { ...item, stock: Math.max(0, item.stock + change) }
        : item
    ));
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (newCategoryName && !categoriesList.includes(newCategoryName)) {
      setCategoriesList([...categoriesList, newCategoryName]);
      setNewCategoryName('');
    }
  };

  const handleDeleteCategory = (categoryToDelete) => {
    const isUsed = inventory.some(item => item.category === categoryToDelete);
    if (!isUsed) {
      setCategoriesList(categoriesList.filter(cat => cat !== categoryToDelete));
    } else {
      alert('Cannot delete category that is being used by items');
    }
  };

  const totalItems = inventory.length;
  const totalStock = inventory.reduce((sum, item) => sum + item.stock, 0);
  const totalValue = inventory.reduce((sum, item) => sum + (item.stock * item.price), 0);

  // Dashboard Component
  const Dashboard = () => (
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
            <BarChart3 className="w-8 h-8 text-green-500" />
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

      {/* Low Stock Alert */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <AlertTriangle className="w-6 h-6 text-yellow-500" />
          <h2 className="text-xl font-bold text-gray-800">Low Stock Alert</h2>
        </div>
        
        {lowStockItems.length === 0 ? (
          <p className="text-gray-600">All items are well stocked!</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">ID</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Name</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Category</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Current Stock</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Min Required</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {lowStockItems.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm text-gray-800">{item.id}</td>
                    <td className="px-4 py-2 text-sm text-gray-800">{item.name}</td>
                    <td className="px-4 py-2 text-sm text-gray-800">{item.category}</td>
                    <td className="px-4 py-2 text-sm">
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">
                        {item.stock}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-800">{item.minQuantity}</td>
                    <td className="px-4 py-2 text-sm">
                      <button
                        onClick={() => handleRestock(item)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs"
                      >
                        Restock
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

  // Add Item Component
  const AddItem = () => (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Item</h2>
      <form onSubmit={handleAddItem}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Item Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Category</option>
              {categoriesList.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity</label>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Quantity</label>
            <input
              type="number"
              value={minQuantity}
              onChange={(e) => setMinQuantity(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
            <input
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>
        
        <button
          type="submit"
          className="mt-6 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md"
        >
          Add Item
        </button>
      </form>
    </div>
  );

  // Add Category Component
  const AddCategory = () => (
    <div className="space-y-6">
      {/* Add New Category */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Category</h2>
        <form onSubmit={handleAddCategory}>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Category Name</label>
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter category name"
                required
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md"
              >
                Add Category
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Existing Categories */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Existing Categories</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categoriesList.map((cat) => {
            const itemCount = inventory.filter(item => item.category === cat).length;
            return (
              <div key={cat} className="border rounded-lg p-4 flex justify-between items-center">
                <div>
                  <h4 className="font-medium text-gray-800">{cat}</h4>
                  <p className="text-sm text-gray-600">{itemCount} items</p>
                </div>
                <button
                  onClick={() => handleDeleteCategory(cat)}
                  className="text-red-600 hover:text-red-800 px-2 py-1 border border-red-600 rounded text-xs"
                  disabled={itemCount > 0}
                >
                  Delete
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  // All Items Component
  const AllItems = () => (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">All Inventory Items</h2>
        
        <div className="flex space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">ID</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Name</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Min Quantity</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Quantity</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Price</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInventory.map((item) => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2 text-sm text-gray-800">{item.id}</td>
                <td className="px-4 py-2 text-sm text-gray-800">{item.name}</td>
                <td className="px-4 py-2 text-sm text-gray-800">{item.minQuantity}</td>
                <td className="px-4 py-2 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    item.stock < item.minQuantity 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {item.stock}
                  </span>
                </td>
                <td className="px-4 py-2 text-sm text-gray-800">${item.price}</td>
                <td className="px-4 py-2 text-sm">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditItem(item)}
                      className="text-green-600 hover:text-green-800 px-2 py-1 border border-green-600 rounded text-xs"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteItem(item.id)}
                      className="text-red-600 hover:text-red-800 px-2 py-1 border border-red-600 rounded text-xs"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Stock Management Component
  const StockManagement = () => (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Stock Management</h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">ID</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Name</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Current Stock</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Min Stock</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Category</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item) => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2 text-sm text-gray-800">{item.id}</td>
                <td className="px-4 py-2 text-sm text-gray-800">{item.name}</td>
                <td className="px-4 py-2 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    item.stock < item.minQuantity 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {item.stock}
                  </span>
                </td>
                <td className="px-4 py-2 text-sm text-gray-800">{item.minQuantity}</td>
                <td className="px-4 py-2 text-sm text-gray-800">{item.category}</td>
                <td className="px-4 py-2 text-sm">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleStockChange(item.id, 1)}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs"
                    >
                      Add Stock
                    </button>
                    <button
                      onClick={() => handleStockChange(item.id, -1)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
                      disabled={item.stock === 0}
                    >
                      Remove Stock
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Reports Component
  const Reports = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">📊 Analytics & Reports</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution Pie Chart */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 Category-wise Item Counts</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Stock Levels Bar Chart */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 Stock Levels by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="stock" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  // Edit Modal
  const EditModal = () => (
    showEditModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-96 max-h-96 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Edit Item</h3>
            <button
              onClick={() => setShowEditModal(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {selectedItem && (
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Item Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Category</option>
                  {categoriesList.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity</label>
                <input
                  type="number"
                  value={editStock}
                  onChange={(e) => setEditStock(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Quantity</label>
                <input
                  type="number"
                  value={editMinQuantity}
                  onChange={(e) => setEditMinQuantity(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                <input
                  type="number"
                  step="0.01"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
                >
                  Update Item
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-md"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    )
  );

  // Restock Modal
  const RestockModal = () => (
    showRestockModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-96">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Restock Item</h3>
            <button
              onClick={() => setShowRestockModal(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {selectedItem && (
            <form onSubmit={handleRestockSubmit} className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Item: <span className="font-medium">{selectedItem.name}</span></p>
                <p className="text-sm text-gray-600">Current Stock: <span className="font-medium">{selectedItem.stock}</span></p>
                <p className="text-sm text-gray-600">Min Required: <span className="font-medium">{selectedItem.minQuantity}</span></p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity to Add
                </label>
                <input
                  type="number"
                  value={restockQuantity}
                  onChange={(e) => setRestockQuantity(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter quantity"
                  required
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
                >
                  Add Stock
                </button>
                <button
                  type="button"
                  onClick={() => setShowRestockModal(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-md"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    )
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Package className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Inventory Management System</h1>
            </div>
            <div className="text-sm text-gray-600">
              Total Value: <span className="font-semibold text-green-600">${totalValue.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </header>
      
      {/* Navigation */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-8">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'add-item', label: 'Add Item', icon: Plus },
              { id: 'add-category', label: 'Add Category', icon: Tags },
              { id: 'all-items', label: 'All Items', icon: Package },
              { id: 'stock-management', label: 'Stock Management', icon: Warehouse },
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
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'add-item' && <AddItem />}
        {activeTab === 'add-category' && <AddCategory />}
        {activeTab === 'all-items' && <AllItems />}
        {activeTab === 'stock-management' && <StockManagement />}
        {activeTab === 'reports' && <Reports />}
      </main>

      {/* Modals */}
      <EditModal />
      <RestockModal />
    </div>
  );
};

export default InventoryManagementSystem;