import React, { useContext, useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
import { AppContext } from '../App';
import '../App.css'; // Import the custom CSS file
// import Razorpay from 'razorpay';

const Cart = () => {
  const { userEmail } = useContext(AppContext);
  const [cartItems, setCartItems] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [cartEmpty, setCartEmpty] = useState(false);
  // const navigate = useNavigate();

  useEffect(() => {
    const fetchCartItems = async () => {
      console.log('email', userEmail);
      try {
        const cartData = {
          userEmail: userEmail,
        };
        const response = await fetch('http://127.0.0.1:3000/getCart', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(cartData),
        });
        if (response.status === 200) {
          const data = await response.json();
          setCartItems(data.cartItems);
          setCartEmpty(data.cartItems.length === 0);
        } else {
          console.error('Error fetching cart details:', response.status);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    const fetchAddresses = async () => {
      try {
        const addressData = {
          userEmail: userEmail,
        };
        const response = await fetch('http://127.0.0.1:3000/getAdd', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(addressData),
        });
        if (response.status === 200) {
          const data = await response.json();
          setAddresses(data.addresses);
        } else {
          console.error('Error fetching addresses:', response.status);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchCartItems();
    fetchAddresses();
  }, [userEmail]);

  const updateQuantity = async (item, newQuantity) => {
    try {
      const updateQuantityData = {
        userEmail: userEmail,
        itemId: item.ProductID,
        quantity: newQuantity,
      };
      const response = await fetch('http://127.0.0.1:3000/updateCartQuantity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateQuantityData),
      });
      if (response.status === 200) {
        setCartItems(prevItems =>
          prevItems.map(cartItem =>
            cartItem.ProductID === item.ProductID
              ? { ...cartItem, Quantity: newQuantity }
              : cartItem
          )
        );

        const isEmpty = cartItems.length === 0;
        setCartEmpty(isEmpty);
      } else {
        console.error('Error updating cart quantity:', response.status);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const goToCheckout = async () => {
    if (!selectedAddressId) {
      console.error('No address selected');
      return;
    }
  
    try {
      // Create order
      const createOrderResponse = await fetch('http://127.0.0.1:3000/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userEmail,
          addressId: selectedAddressId,
          cartItems: cartItems.map(item => ({
            price: parseFloat(item.Price),
            quantity: parseInt(item.Quantity),
            productId: item.ProductID, // Assuming you have a ProductID field
            name: item.Name, // Assuming you have a Name field
            // Include any other necessary fields
          })),
        }),
      });
  
      if (createOrderResponse.ok) {
        const order = await createOrderResponse.json();
        
        const options = {
          key: 'rzp_test_mWvmhCC5tXBykh', // Replace with your actual Razorpay key
          amount: order.amount, // This should now be correctly set by the server
          currency: 'INR',
          name: 'Dashed',
          description: 'Complete your payment',
          order_id: order.razorpay_order_id,
          handler: async function (response) {
            try {
              const verifyResponse = await fetch('http://127.0.0.1:3000/verify-payment', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature,
                  orderId: order.orderId
                }),
              });
  
              if (verifyResponse.ok) {
                const verificationResult = await verifyResponse.json();
                console.log('Payment successful:', verificationResult);
                setCartEmpty(true);
                // You might want to navigate to a success page or show a success message
                // For example: navigate('/order-success');
              } else {
                console.error('Payment verification failed');
                // Handle failed verification
                // You might want to show an error message to the user
              }
            } catch (error) {
              console.error('Error during payment verification:', error);
              // Handle error (show error message to user)
            }
          },
          prefill: {
            name: 'Customer Name', // You might want to get this from your user data
            email: userEmail,
            contact: 'Customer Phone' // You might want to get this from your user data
          },
          theme: {
            color: '#F37254'
          }
        };
  
        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } else {
        console.error('Failed to create order');
        // Handle order creation failure
        // You might want to show an error message to the user
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      // Handle error (show error message to user)
    }
  };


  return (
    <div className="cart-container">
      <div className="cart-content">
        <div className="cart-card">
          <div className="cart-card-body">
            <h4 className="cart-card-title">Cart</h4>
            {cartEmpty ? (
              <div className="cart-empty">
                <p>No items in cart</p>
              </div>
            ) : (
              <>
                {cartItems.map(item => (
                  <div className="cart-item-card" key={item.ProductID}>
                    <div className="cart-item-body">
                      <div className="cart-item-img">
                        <img src={item.Images} alt={item.Name} />
                      </div>
                      <div className="cart-item-details">
                        <h5>{item.Name}</h5>
                        <p>Price: ${item.Price}</p>
                        <div className="cart-item-quantity">
                          <button
                            className="quantity-btn"
                            onClick={() => updateQuantity(item, item.Quantity - 1)}
                            disabled={item.Quantity <= 1}
                          >
                            -
                          </button>
                          <span>{item.Quantity}</span>
                          <button
                            className="quantity-btn"
                            onClick={() => updateQuantity(item, item.Quantity + 1)}
                          >
                            +
                          </button>
                        </div>
                        <p className="cart-item-total">
                          Total: ${item.Price * item.Quantity}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="address-selection">
                  <label htmlFor="address">Select Address</label>
                  <select
                    id="address"
                    value={selectedAddressId}
                    onChange={e => setSelectedAddressId(e.target.value)}
                  >
                    <option value="">Select an address</option>
                    {addresses.map(address => (
                      <option key={address.AddressID} value={address.AddressID}>
                        {address.StreetAddress}, {address.City}, {address.State}, {address.Country} - {address.PostalCode}
                      </option>
                    ))}
                  </select>
                </div>
                <button className="checkout-btn" onClick={goToCheckout}>
                  Proceed to Checkout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
