import React from 'react';
import '../App.css';

const ProductCard = ({ item, onSelect }) => {
  return (
    <div className="pc-container">
      <div className="pc-productCard">
        <button className="pc-selectButton" onClick={() => onSelect(item.ProductID)}>
          <p>{item.Name}</p>
          {item.Images && (
            <img
              src={item.Images}
              alt={item.Name}
              className="pc-productImage"
            />
          )}
          <p>{item.Price}</p>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
