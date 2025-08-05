import React, { useState } from 'react';
import './AllItems.css';

function AllItems() {
  const [formData, setFormData] = useState({
    itemName: '',
    category: '',
    minStock: '',
    initialQuantity: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // You can add logic to send this data to a backend or state
  };

  return (
    <div className="all-items-container">
      <h1>All Items</h1>

      <form className="item-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Item Name</label>
          <input
            type="text"
            name="itemName"
            value={formData.itemName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            <option value="Hardware">Hardware</option>
            <option value="Cables">Cables</option>
            <option value="Accessories">Accessories</option>
          </select>
        </div>

        <div className="form-group">
          <label>Min Stock</label>
          <input
            type="number"
            name="minStock"
            value={formData.minStock}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Initial Quantity</label>
          <input
            type="number"
            name="initialQuantity"
            value={formData.initialQuantity}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="submit-btn">Add Item</button>
      </form>
    </div>
  );
}

export default AllItems;
