import React, { useState, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { AppContext } from '../App';
import '../App.css';

const BASE_URL = 'http://127.0.0.1:3000';

const ProductDetail = () => {
  const { userEmail } = useContext(AppContext);
  const location = useLocation();
  const { product: initialProduct } = location.state;
  const [product, setProduct] = useState(initialProduct);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState({});

  const handleQuantityDecrease = () => {
    if (selectedQuantity > 1) {
      setSelectedQuantity(selectedQuantity - 1);
    }
  };

  const handleQuantityIncrease = () => {
    if (selectedQuantity < product.StockQuantity) {
      setSelectedQuantity(selectedQuantity + 1);
    } else {
      alert(`Only ${product.StockQuantity} items in stock`);
    }
  };

  const handleOptionSelect = (key) => {
    setSelectedOptions((prevSelectedOptions) => ({
      ...prevSelectedOptions,
      [key]: !prevSelectedOptions[key],
    }));
  };

  const addToCart = async () => {
    try {
      const cartForm = new URLSearchParams();
      cartForm.append('userEmail', userEmail);
      cartForm.append('productId', product.ProductID);
      cartForm.append('quantity', selectedQuantity);
      cartForm.append('selectedOptions', JSON.stringify(selectedOptions));

      const response = await fetch(`${BASE_URL}/addToCart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: cartForm,
      });
      if (response.status === 200) {
        const data = await response.json();
        alert('Success: Product added to cart');
      } else {
        const errorData = await response.json();
        console.error('Error adding to cart:', errorData);
        alert('Error: An error occurred while adding the product to the cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Error: An error occurred while adding the product to the cart');
    }
  };

  const renderOptionCards = () => {
    const options = product.Options;
    const optionNames = {
      NoPockets: "No Pockets",
      NoCollar: "No Collar",
      OvalPocket: "Oval Pocket",
      TrianglePocket: "Triangle Pocket",
      SquarePocket: "Square Pocket",
      single_stitch: "Single Stitch",
      FoldedStitch: "Folded Stitch",
      Chinese_Collar: "Chinese Collar",
      Full_Sleeve: "Full Sleeve",
      Half_Sleeve: "Half Sleeve",
      NoStitch: "No Stitch",
      NormalCollar: "Normal Collar"
    };

    return Object.keys(options).map((key) => {
      if (options[key] === 1) {
        return (
          <div 
            key={key} 
            className={`pdt-optionCard ${selectedOptions[key] ? 'pdt-selectedOptionCard' : ''}`} 
            onClick={() => handleOptionSelect(key)}
          >
            <p className="pdt-optionText">{optionNames[key]}</p>
          </div>
        );
      }
      return null;
    });
  };

  return (
    <div className="pdt-container">
      {product && (
        <div className="pdt-detailContainer">
          <h1 className="pdt-title">{product.Name}</h1>
          {product.ImageURL && (
            <img
              src={`${BASE_URL}${product.ImageURL.trim()}`}
              alt={product.Name}
              className="pdt-image"
            />
          )}
          <p className="pdt-price">Total Price: ${product.Price * selectedQuantity}</p>
          <p className="pdt-description">{product.Description}</p>
          <div className="pdt-quantityContainer">
            <p><strong>Quantity:</strong></p>
            <button className="pdt-quantityButton" onClick={handleQuantityDecrease}>
              -
            </button>
            <p className="pdt-quantityText">{selectedQuantity}</p>
            <button className="pdt-quantityButton" onClick={handleQuantityIncrease}>
              +
            </button>
          </div>
          <div className="pdt-optionsContainer">
            {renderOptionCards()}
          </div>
          <div style={{ paddingVertical: 15 }}>
            <button className="pdt-button" onClick={addToCart}>
              Add to cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
