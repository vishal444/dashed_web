import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../App';
import '../App.css';

export default function LoginRegistration() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  // const [existingEmail, setExistingEmail] = useState(null);
  const navigate = useNavigate();
  const { setUserEmail } = useContext(AppContext);

  useEffect(() => {
    const startingUp = async () => {
      try {
        // const value = localStorage.getItem('may');
        // setExistingEmail(value);
        // console.log(existingEmail);
      } catch (error) {
        console.error(error);
      }
    };
    startingUp();
  }, []);

  const handleToggle = () => {
    setIsLogin(!isLogin);
    setErrorMessage('');
  };

  const handleSubmit = async () => {
    if (isLogin) {
      try {
        console.log('form data:', email, password);
        const loginData = {
          email: email,
          password: password
        };

        const response = await fetch('http://127.0.0.1:3000/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(loginData),
        });
        const data = await response.json();
        console.log('response', data);
        if (response.status === 200) {
          localStorage.setItem('bioMetric', 'yes');
          localStorage.setItem('may', email);
          setUserEmail(email);
          navigate('/productsList');
        } else {
          if(response.status === 401){
            setErrorMessage('Please enter correct email / password!')
          } else {
            setErrorMessage('An error occurred while logging in. Please try again.');
          }
          console.error('Server responded with status code: ', response.status);
        }
      } catch (error) {
        console.error('Error details:', error);
        setErrorMessage('An error occurred. Please check the console for details.');
      }
    } else {
      try {
        const registerData = {
          name: name,
          email: email,
          password: password
        };

        const response = await fetch('http://127.0.0.1:3000/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(registerData)
        });
        
        const data = await response.json();
        console.log('response', data);
        if (response.status === 200) {
          localStorage.setItem('bioMetric', 'yes');
          localStorage.setItem('user_name', name);
          localStorage.setItem('may', email);
          setUserEmail(email);
          navigate('/productsList');
        } else {
          setErrorMessage(data.message || 'Registration failed. Please try again.');
        }
      } catch (error) {
        console.error('Error details:', error);
        setErrorMessage('An error occurred. Please check the console for details.');
      }
    }
  };

  return (
    <div className="lg-container">
      {!isLogin && (
        <input
          className="lg-input"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      )}
      <input
        className="lg-input"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="lg-input"
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="lg-button" onClick={handleSubmit}>
        {isLogin ? 'Login' : 'Register'}
      </button>
      <p className="lg-toggleButton" onClick={handleToggle}>
        {isLogin
          ? "Don't have an account? Register"
          : 'Already have an account? Login'}
      </p>
      {errorMessage && <p className="lg-errorMessage">{errorMessage}</p>}
    </div>
  );
}