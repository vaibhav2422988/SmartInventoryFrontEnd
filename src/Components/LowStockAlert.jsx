import React, { useState, useEffect } from 'react';
import { X, AlertTriangle } from 'react-feather';
import apiService from '../apiService';

const LowStockAlert = () => {
  const [inventory, setInventory] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [restockQuantity, setRestockQuantity] = useState('');

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const data = await apiService.getItems();
      setInventory(data);
      filterLowStock(data);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    }
  };

  const filterLowStock = (items) => {
    const lowStock = items.filter(item => item.currentQuantity < item.minQuantity);
    setLowStockItems(lowStock);
  };

  const handleRestock = (item) => {
    setSelectedItem(item);
    setRestockQuantity('');
    setShowRestockModal(true);
  };

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

      const response = await apiService.updateStock(payload);

      if (response) {
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
      console.error('Error restocking item:', error);
      alert('Failed to restock item. Please try again.');
    }
  };

  const filteredItems = lowStockItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center space-x-2 mb-4">
        <AlertTriangle className="w-6 h-6 text-yellow-500" />
        <h2 className="text-xl font-bold text-gray-800">Low Stock Alert</h2>
      </div>

      {/* Search box */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Table or no items */}
      {filteredItems.length === 0 ? (
        <p className="text-gray-600">No low stock items found.</p>
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
              {filteredItems.map((item) => (
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
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center transition-all">
          <div className="bg-white rounded-xl shadow-xl w-[90%] max-w-md p-6 relative animate-fade-in">
            {/* Header */}
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h3 className="text-xl font-semibold text-gray-800">🛒 Restock Item</h3>
              <button
                onClick={() => setShowRestockModal(false)}
                className="text-gray-400 hover:text-gray-600 transition"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            {selectedItem && (
              <form onSubmit={handleRestockSubmit} className="space-y-5">
                <div className="space-y-2 text-sm text-gray-600">
                  <p>
                    <span className="font-medium text-gray-700">Item:</span> {selectedItem.name}
                  </p>
                  <p>
                    <span className="font-medium text-gray-700">Current Stock:</span> {selectedItem.currentQuantity}
                  </p>
                  <p>
                    <span className="font-medium text-gray-700">Min Required:</span> {selectedItem.minQuantity}
                  </p>
                  <p>
                    <span className="font-medium text-gray-700">Price per Unit:</span> ₹{selectedItem.price.toFixed(2)}
                  </p>
                  <p>
                    <span className="font-medium text-gray-700">Minimum Cost to Restock:</span>{' '}
                    <span className="text-red-600 font-semibold">
                      ₹
                      {Math.max(
                        0,
                        (selectedItem.minQuantity - selectedItem.currentQuantity) * selectedItem.price
                      ).toFixed(2)}
                    </span>
                  </p>
                </div>

                {/* Quantity Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity to Add
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={restockQuantity}
                    onChange={(e) => setRestockQuantity(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                    placeholder="e.g., 50"
                    required
                  />
                </div>

                {/* Buttons */}
                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowRestockModal(false)}
                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                  >
                    Add Stock
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
