import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, AlertTriangle } from 'react-feather';

const API_BASE_URL = 'https://localhost:7068';

const LowStockAlert = () => {
  const [inventory, setInventory] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [restockQuantity, setRestockQuantity] = useState('');

  // Fetch inventory items on mount
  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/Item`);
      setInventory(response.data);
      filterLowStock(response.data);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    }
  };

  // Filter items with stock below minQuantity
  const filterLowStock = (items) => {
    const lowStock = items.filter(item => item.currentQuantity < item.minQuantity);
    setLowStockItems(lowStock);
  };

  // Open restock modal for selected item
  const handleRestock = (item) => {
    setSelectedItem(item);
    setRestockQuantity('');
    setShowRestockModal(true);
  };

  // Submit restock request
  const handleRestockSubmit = async (e) => {
    e.preventDefault();

    if (!restockQuantity || restockQuantity <= 0) {
      alert('Please enter a valid quantity');
      return;
    }

    try {
      const payload = {
        itemId: selectedItem.id,
        quantity: Number(restockQuantity),
      };

      console.log('Restock payload:', payload);

      // Call API to update stock
      const response = await axios.post(`${API_BASE_URL}/api/Stock/update`, payload);
      
      if (response.status === 200) {
        console.log('Restock response:', response.data);

        // Update local inventory & low stock list
        const updatedInventory = inventory.map(item =>
          item.id === selectedItem.id
            ? { ...item, currentQuantity: item.currentQuantity + payload.quantity }
            : item
        );

        setInventory(updatedInventory);
        filterLowStock(updatedInventory);

        setShowRestockModal(false);
        setSelectedItem(null);
        setRestockQuantity('');
      } else {
        alert('Failed to restock item. Please try again.');
      }
    } catch (error) {
      console.error('Error restocking item:', error.response || error.message || error);
      alert('Failed to restock item. Please try again.');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Low Stock Alert Header */}
      <div className="flex items-center space-x-2 mb-4">
        <AlertTriangle className="w-6 h-6 text-yellow-500" />
        <h2 className="text-xl font-bold text-gray-800">Low Stock Alert</h2>
      </div>

      {/* Low Stock Table or Message */}
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
                  <td className="px-4 py-2 text-sm text-gray-800">{item.categoryName}</td>
                  <td className="px-4 py-2 text-sm">
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">
                      {item.currentQuantity}
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

      {/* Restock Modal */}
      {showRestockModal && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Restock Item</h3>
              <button
                onClick={() => setShowRestockModal(false)}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {selectedItem && (
              <form onSubmit={handleRestockSubmit} className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">
                    Item: <span className="font-medium">{selectedItem.name}</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Current Stock: <span className="font-medium">{selectedItem.currentQuantity}</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Min Required: <span className="font-medium">{selectedItem.minQuantity}</span>
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity to Add
                  </label>
                  <input
                    type="number"
                    min={1}
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
      )}
    </div>
  );
};

export default LowStockAlert;
