import React, { useState, useEffect } from 'react';
import apiService from "../apiService";

const AddItem = () => {
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [stock, setStock] = useState('');
  const [minQuantity, setMinQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [measurement, setMeasurement] = useState('');  // New state for measurement
  const [categoriesList, setCategoriesList] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await apiService.getCategories();
        setCategoriesList(data);
        console.log("All the category data", data);
      } catch (err) {
        console.error("Error fetching categories", err);
      }
    };
    fetchCategories();
  }, []);

  const handleAddItem = async (e) => {
    e.preventDefault();

    const newItem = {
      name,
      categoryId: parseInt(categoryId),
      minQuantity: parseInt(minQuantity),
      price: parseFloat(price),
      measurement,  // Include measurement in the new item
    };

    try {
      const item = await apiService.addItem(newItem);
      const itemId = item.id;

      if (stock && parseInt(stock) > 0) {
        await apiService.updateStock({
          itemId,
          quantity: parseInt(stock),
        });
      }

      alert('Item added successfully!');
      setName('');
      setCategoryId('');
      setStock('');
      setMinQuantity('');
      setPrice('');
      setMeasurement('');  // Clear measurement input
    } catch (err) {
      console.error('Error adding item', err);
      alert('Failed to add item');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg max-w-3xl mx-auto mt-12 p-8">
      <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center">
        Add New Item
      </h2>
      <form onSubmit={handleAddItem} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Item Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Item Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter item name"
              className="w-full px-4 py-3 rounded-md border border-gray-300
                         focus:outline-none focus:ring-2 focus:ring-indigo-400
                         focus:border-indigo-400 transition-shadow shadow-sm
                         hover:shadow-md"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Category
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-4 py-3 rounded-md border border-gray-300
                         focus:outline-none focus:ring-2 focus:ring-indigo-400
                         focus:border-indigo-400 transition-shadow shadow-sm
                         hover:shadow-md"
              required
            >
              <option value="" disabled>
                Select Category
              </option>
              {categoriesList.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Stock Quantity */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Stock Quantity (optional)
            </label>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              placeholder="e.g. 10"
              className="w-full px-4 py-3 rounded-md border border-gray-300
                         focus:outline-none focus:ring-2 focus:ring-indigo-400
                         focus:border-indigo-400 transition-shadow shadow-sm
                         hover:shadow-md"
            />
          </div>

          {/* Minimum Quantity */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Minimum Quantity
            </label>
            <input
              type="number"
              value={minQuantity}
              onChange={(e) => setMinQuantity(e.target.value)}
              placeholder="e.g. 5"
              className="w-full px-4 py-3 rounded-md border border-gray-300
                         focus:outline-none focus:ring-2 focus:ring-indigo-400
                         focus:border-indigo-400 transition-shadow shadow-sm
                         hover:shadow-md"
              required
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Price
            </label>
            <input
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g. 12.99"
              className="w-full px-4 py-3 rounded-md border border-gray-300
                         focus:outline-none focus:ring-2 focus:ring-indigo-400
                         focus:border-indigo-400 transition-shadow shadow-sm
                         hover:shadow-md"
              required
            />
          </div>

          {/* Measurement */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Measurement
            </label>
            <input
              type="text"
              value={measurement}
              onChange={(e) => setMeasurement(e.target.value)}
              placeholder="e.g. kg, liters, pcs"
              className="w-full px-4 py-3 rounded-md border border-gray-300
                         focus:outline-none focus:ring-2 focus:ring-indigo-400
                         focus:border-indigo-400 transition-shadow shadow-sm
                         hover:shadow-md"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-4 bg-indigo-600 text-white font-semibold rounded-md
                     shadow-md hover:bg-indigo-700 transition-colors duration-300
                     focus:outline-none focus:ring-4 focus:ring-indigo-300"
        >
          Add Item
        </button>
      </form>
    </div>
  );
};

export default AddItem;
