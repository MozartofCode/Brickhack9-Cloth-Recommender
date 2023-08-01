// File name: App.js
// Author: Bertan Berker
// This file renders the login page and handles register and login for the users 

import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate} from 'react-router-dom';
import { UserContext } from './UserContext';
import './loginPage.css';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { setUsername: setGlobalUsername } = useContext(UserContext);

  const handleLogin = async () => {

    try {
      const response = await axios.post('http://localhost:5000/api/login', { username, password });
      console.log('Login successful:', response.data.message);

      // Store the username in the global state (UserContext)
      setGlobalUsername(username); // Use setGlobalUsername to update the username value
      
      // Redirecting to the wardrobe page
      navigate('/Wardrobe');
      

    } catch (error) {
      alert('Login failed:', error.message);
    }
  };

  const handleRegister = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/register', { username, password });
      console.log('Registration successful:', response.data.message);
      alert('Registration successful:', response.data.message);
      
    } catch (error) {
      alert('Registration failed, try again:', error.message);
    }
  };

  return (
    <div className="container"> 
      <h1>Login or Register</h1>
      <div className="form-group"> 
        <label>Username:</label>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
      </div>
      <div className="form-group"> 
        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <div className="buttons"> 
        <button onClick={handleLogin}>Login</button>
        <button onClick={handleRegister}>Register</button>
      </div>
    </div>
  );
}

export default App;
