import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css'; 

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <text className="navbar-brand">Dashed</text>
      </div>
      <div className="navbar-right">
        <Link to="/cart" className="navbar-cart">
          <button className="cart-button">Cart</button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
