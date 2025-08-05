import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X } from 'react-feather';  // Assuming you're using react-feather for icons

const API_BASE_URL = 'https://localhost:7068';

const AllItems = () => {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editName, setEditName] = useState('');
  const [editCategoryId, setEditCategoryId] = useState('');
  const [editMinQuantity, setEditMinQuantity] = useState('');
  const [editPrice, setEditPrice] = useState('');

  // Fetch inventory items from the API
  const fetchInventory = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/Item`);
      setInventory(response.data);
      setFilteredInventory(response.data);
    } catch (error) {
      console.error("Error fetching inventory items:", error);
    }
  };

  // Fetch categories from the API
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/Category`);
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchInventory();
    fetchCategories();
  }, []);

  // Filter inventory by search term and category
  useEffect(() => {
    let filtered = inventory;

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterCategory) {
      filtered = filtered.filter(item =>
        item.categoryName === filterCategory
      );
    }

    setFilteredInventory(filtered);
  }, [searchTerm, filterCategory, inventory]);

  // Open the Edit Modal and set the form data
  const handleEditItem = (item) => {
    setSelectedItem(item);
    setEditName(item.name);
    setEditCategoryId(item.categoryId);  // Corrected this line
    setEditMinQuantity(item.minQuantity);
    setEditPrice(item.price);
    setShowEditModal(true);
  };

  // Handle form submission to update item
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const updatedItem = {
      id: selectedItem.id,
      name: editName,
      categoryId: editCategoryId,  // Send categoryId
      minQuantity: editMinQuantity,
      price: editPrice,
      initialQuantity: selectedItem.initialQuantity,  // Send initialQuantity from the selected item
    };

    try {
      const response = await axios.put(`${API_BASE_URL}/api/Item/${selectedItem.id}`, updatedItem);
      // Update the inventory list with the updated item
      setInventory(prevItems => prevItems.map(item => item.id === selectedItem.id ? response.data : item));
      setFilteredInventory(prevItems => prevItems.map(item => item.id === selectedItem.id ? response.data : item));
      setShowEditModal(false); // Close the modal
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  // Handle delete item
  const handleDeleteItem = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/Item/${id}`);
      setInventory(prevItems => prevItems.filter(item => item.id !== id));
      setFilteredInventory(prevItems => prevItems.filter(item => item.id !== id));
      console.log("Item deleted successfully.");
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">All Inventory Items</h2>

        <div className="flex space-x-4">
          <div className="relative">
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
              <option key={category.id} value={category.name}>{category.name}</option>
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
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Current Stock</th>
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
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      item.currentQuantity < item.minQuantity
                        ? 'bg-red-100 text-red-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {item.currentQuantity}
                  </span>
                </td>
                <td className="px-4 py-2 text-sm text-gray-800">{item.price}</td>
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

      {/* Edit Modal */}
      {showEditModal && (
      <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-md">
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
                  value={editCategoryId}
                  onChange={(e) => setEditCategoryId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
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
                  className="flex-1 bg-blue-100 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
                >
                  Update Item
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-100 text-gray-800 py-2 px-4 rounded-md"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    )}

    </div>
  );
};

export default AllItems;
