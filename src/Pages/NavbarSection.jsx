import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

 
const NavbarSection = () => {
  return (
    <nav className="navbar">
      <h2 className="logo">Smart Inventory Tracker</h2>
      <ul className="nav-links">
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/items">All Items</Link></li>
        <li><Link to="/add-item">Add Item</Link></li>
        <li><Link to="/reports">Reports</Link></li>
      </ul>
    </nav>
 
);
};
 
export default NavbarSection;
 