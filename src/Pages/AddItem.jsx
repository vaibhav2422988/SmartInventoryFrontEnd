import React from 'react';
import './AddItem.css';
import ActionButtons from './ActionButtons';

const dummyItems = [
  {
    id: '01',
    name: 'Keyboard',
    category_name: 'Hardware',
    min_stock_quantity: 5
  },
  {
    id: '02',
    name: 'SSD Drive',
    category_name: 'Hardware',
    min_stock_quantity: 3
  },
  {
    id: '03',
    name: 'HDMI Cable',
    category_name: 'Cables',
    min_stock_quantity: 10
  }
];

function AddItem() {
  return (
    <div className="add-item-container">
      <table className="item-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Category Name</th>
            <th>Min Stock Quantity</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {dummyItems.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.category_name}</td>
              <td>{item.min_stock_quantity}</td>
              <td><ActionButtons /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AddItem;
