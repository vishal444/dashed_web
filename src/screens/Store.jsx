import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css'; // You'll need to create this CSS file

const Store = () => {
  const navigate = useNavigate();
  const categories = ['Jeans', 'Shirts', 'Tshirts', 'Underwears', 'Shorts', 'Socks'];

  const handleCategoryPress = (category) => {
    navigate('/productsList', { state: { category } });
  };

  return (
    <div className="container">
      <div className="grid-container">
        {categories.map((category) => (
          <button
            key={category}
            className="grid-item"
            onClick={() => handleCategoryPress(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Store;