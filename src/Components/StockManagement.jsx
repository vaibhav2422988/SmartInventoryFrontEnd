import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StockManagement = () => {
  const [inventory, setInventory] = useState([]);

  const API_BASE_URL = 'https://localhost:7068';

  // Fetch all items on component mount
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/Item`);
        setInventory(response.data);
      } catch (error) {
        console.error('Error fetching inventory:', error);
      }
    };

    fetchInventory();
  }, []);

  // Handle stock adjustment (+ or -)
  const handleStockChange = async (itemId, change) => {
    const action = change > 0 ? '+' : '-';

    try {
      await axios.post(`${API_BASE_URL}/api/Stock/adjust`, {
        itemId,
        action,
      });

      // Optimistically update local UI
      setInventory(prev =>
        prev.map(item =>
          item.id === itemId
            ? {
                ...item,
                currentQuantity: item.currentQuantity + change,
              }
            : item
        )
      );
    } catch (error) {
      console.error('Error adjusting stock:', error);
    }
  };

  return (
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
            {inventory.map(item => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2 text-sm text-gray-800">{item.id}</td>
                <td className="px-4 py-2 text-sm text-gray-800">{item.name}</td>
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
                <td className="px-4 py-2 text-sm text-gray-800">{item.minQuantity}</td>
                <td className="px-4 py-2 text-sm text-gray-800">{item.categoryName || '—'}</td>
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
                      disabled={item.currentQuantity === 0}
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
};

export default StockManagement;
