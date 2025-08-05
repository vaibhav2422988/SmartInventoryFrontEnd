import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddItem = () => {
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [stock, setStock] = useState('');
  const [minQuantity, setMinQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [categoriesList, setCategoriesList] = useState([]);

  // Fetch categories on mount
  useEffect(() => {
    axios.get('https://localhost:7068/api/Category')
      .then(res => setCategoriesList(res.data))
      .catch(err => console.error("Error fetching categories", err));
  }, []);

  const handleAddItem = async (e) => {
    e.preventDefault();

    const newItem = {
      name,
      categoryId: parseInt(categoryId),
      minQuantity: parseInt(minQuantity),
      price: parseFloat(price)
    };

    try {
      // Step 1: Add item
      const itemRes = await axios.post('https://localhost:7068/api/Item', newItem);
      const itemId = itemRes.data.id;

      // Step 2: Add stock if entered
      if (stock && parseInt(stock) > 0) {
        await axios.post('https://localhost:7068/api/Stock/update', {
          itemId,
          quantity: parseInt(stock)
        });
      }

      alert('Item added successfully!');
      // Reset form
      setName('');
      setCategoryId('');
      setStock('');
      setMinQuantity('');
      setPrice('');
    } catch (err) {
      console.error('Error adding item', err);
      alert('Failed to add item');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-3xl mx-auto mt-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Item</h2>
      <form onSubmit={handleAddItem}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Item Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Select Category</option>
              {categoriesList.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity (optional)</label>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Quantity</label>
            <input
              type="number"
              value={minQuantity}
              onChange={(e) => setMinQuantity(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
};

export default AddItem;
