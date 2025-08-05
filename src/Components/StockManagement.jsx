import React, { useEffect, useState } from 'react';
import apiService from '../apiService'; // Adjust path as needed
import { ArrowUp, ArrowDown, Filter } from 'react-feather'; // Place at the top

const StockManagement = () => {
  const [inventory, setInventory] = useState([]);
  const [sortDirection, setSortDirection] = useState(null); // 'asc' or 'desc'

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const data = await apiService.getItems();
        setInventory(data);
      } catch (error) {
        console.error('Error fetching inventory:', error);
      }
    };

    fetchInventory();
  }, []);

  const handleStockChange = async (itemId, change) => {
    const action = change > 0 ? '+' : '-';

    try {
      await apiService.adjustStock({ itemId, action });

      setInventory(prev =>
        prev.map(item =>
          item.id === itemId
            ? { ...item, currentQuantity: item.currentQuantity + change }
            : item
        )
      );
    } catch (error) {
      console.error('Error adjusting stock:', error);
    }
  };

  const toggleSort = () => {
    setSortDirection(prev =>
      prev === 'asc' ? 'desc' : 'asc'
    );
  };

  // Apply sorting
  const sortedInventory = [...inventory].sort((a, b) => {
    if (sortDirection === 'asc') {
      return a.currentQuantity - b.currentQuantity;
    } else if (sortDirection === 'desc') {
      return b.currentQuantity - a.currentQuantity;
    }
    return 0; // No sort
  });

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Stock Management</h2>

        <button
          onClick={toggleSort}
          className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm transition"
        >
          <Filter size={16} />
          <span>Sort by Stock</span>
          {sortDirection === 'asc' && <ArrowUp size={16} />}
          {sortDirection === 'desc' && <ArrowDown size={16} />}
        </button>
      </div>

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
            {sortedInventory.map(item => (
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
