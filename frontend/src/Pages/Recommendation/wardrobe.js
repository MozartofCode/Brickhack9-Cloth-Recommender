// Filename: wardrobe.js
// Author: Bertan Berker
// This file handles all types of other functionality for the user such as
// Showing the user thier clothes, making a post request to the backend tp 
// add clothes to the user's wardrobe and give the user a recommendation on what
// clothes matches 

import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import './wardrobe.css';
import { UserContext } from '../../UserContext';


function Wardrobe() {
  
  const { username, setUsername } = useContext(UserContext); 
  
  const [clothesList, setClothesList] = useState([]);
  const [recommendationList, setRecommendationList] = useState([]);
  const [file, setFile] = useState(null);


  // This function makes a GET request to the backend to get a users wardrobe

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/clothes?username=${encodeURIComponent(username)}`);
      
      const userData = response.data;

      setClothesList(userData.clothes || []);

    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);




// This function makes a GET request to the backend to get clothing recommendations
    
  const handleRecommendation = async () => {
    
    try {
      const response = await axios.get(`http://localhost:5000/api/recommendation?username=${encodeURIComponent(username)}`);

      const recommendations = response.data;

      setRecommendationList(recommendations.clothes);
      
    } catch (error) {
      console.error('Error getting clothing recommendations:', error);
      alert('Failed to get clothing recommendations. Please try again.');
    }
  };



  // This file handles adding a new cloth to the user's wardrobe

  const handleAddCloth = async () => {
    if (!file) {
      alert('Please select an image.');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    try{
      // POST request to backend to process the image
      const response = await axios.post('http://localhost:5000/api/image', formData);
  
      const data = response.data;

      const clothColor = data.color + ' ' + data.cloth;

       // Add the cloth to the wardrobe database using backend
       try {
        const wardrobeResponse = await axios.post('http://localhost:5000/api/addClothes', {
            username: username,
            cloth: clothColor // Convert the 'data' object to a JSON string
         });


        // Cloth added to the wardrobe successfully!
        console.log('Cloth added to wardrobe:', clothColor);
        
        fetchUserData();

      } catch (wardrobeError) {
        console.error('Error adding cloth to wardrobe:', wardrobeError);
        alert('Failed to add cloth to wardrobe. Please try again.');
      }
    } catch (error) {
      console.error('Error processing the image:', error);
      alert('Failed to process the image. Please try again.');
    }
    
  };


  return (
    <div className='page'>
    <div className="wardrobe-container">
      <h1>{username}'s Wardrobe</h1>
      <div className="upload-section">
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button onClick={handleAddCloth}>Add Clothes</button>
        <button onClick={handleRecommendation}>Show me Recommendations</button>
      </div>
      
      </div>

      <div className='row'>
      <div className="column">
        <div className='clothes-list'>
        <h2>Your Wardrobe</h2>
        <ul>
          {clothesList.map((cloth, index) => (
             <li key={index}>{cloth}</li>
          ))}
        </ul>
        </div>
      </div>

      <div className="column">
        <div className='recommendation-list'>
        <h3>Your Recommendations</h3>
        <ul>
          {recommendationList.map((recommendation, index) => (
             <li key={index}>{recommendation}</li>
          ))}
        </ul>
      </div>
      </div>
      </div>

      </div>
  );
}


export default Wardrobe;

