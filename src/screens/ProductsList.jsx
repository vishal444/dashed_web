import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from './ProductCard';
import '../App.css';

const ProductsList = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const getProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:3000/productsList');
      const data = await response.json();
      console.log('data', data);
      setProducts(data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  const handleProductSelect = async (productId) => {
    console.log('Selected ProductID:', productId);
    try {
      const response = await fetch(`http://127.0.0.1:3000/product?id=${productId}`);
      if (response.status === 200) {
        const data = await response.json();
        const product = data.product;
        navigate('/productDetail', { state: { product } });
      } else {
        console.error('Error fetching product details:', response.status);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  return (
    <div className="product-list-container">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="product-list">
          {products.map((item) => (
            <div className="product-container" key={item.ProductID.toString()}>
              <ProductCard item={item} onSelect={handleProductSelect} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsList;