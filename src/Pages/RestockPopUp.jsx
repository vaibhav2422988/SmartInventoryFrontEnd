import React, { useState } from 'react';
import './RestockPopUp.css';

function RestockPopUp({ item }) {
  const [showModal, setShowModal] = useState(false);
  const [restockAmount, setRestockAmount] = useState('');

  const handleOpen = () => setShowModal(true);
  const handleClose = () => {
    setShowModal(false);
    setRestockAmount('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(`Restocking ${item.name} with ${restockAmount} units`);
    // Add logic to update stock or send to backend
    handleClose();
  };

  return (
    <>
    <h1>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Consequatur, magnam.</h1>
      <button className="restock-btn" onClick={handleOpen}>Restock</button>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Restock Item</h2>
            <p><strong>Name:</strong> {item.name}</p>
            <p><strong>Current Stock:</strong> {item.stock}</p>

            <form onSubmit={handleSubmit}>
              <input
                type="number"
                placeholder="Enter quantity to add"
                value={restockAmount}
                onChange={(e) => setRestockAmount(e.target.value)}
                required
              />
              <div className="modal-actions">
                <button type="submit">Submit</button>
                <button type="button" onClick={handleClose}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default RestockPopUp;
