import React, { useState, createContext } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import LoginRegistration from '../src/screens/LoginRegistration';
import ProductsList from '../src/screens/ProductsList';
import ProductDetail from '../src/screens/ProductDetail';
import Navbar from '../src/screens/Navbar';
import Cart from '../src/screens/Cart';

export const AppContext = createContext();

const AppWrapper = () => {
  return (
    <Router>
      <App />
    </Router>
  );
};

const App = () => {
  const location = useLocation();
  const [userEmail, setUserEmail] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [photos, setPhotos] = useState([]);

  return (
    <AppContext.Provider
      value={{
        userEmail,
        setUserEmail,
        isSeller,
        setIsSeller,
        photos,
        setPhotos,
      }}
    >
      {location.pathname !== '/' && location.pathname !== '/login' && <Navbar />}
      <Routes>
        <Route path="/" element={<LoginRegistration />} />
        <Route path="/login" element={<LoginRegistration />} />
        <Route path="/productsList" element={<ProductsList />} />
        <Route path="/productDetail" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        {/* <Route path="/landing" element={<Store />} /> */}
      </Routes>
    </AppContext.Provider>
  );
};

export default AppWrapper;