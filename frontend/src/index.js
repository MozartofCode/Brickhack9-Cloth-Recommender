import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { UserProvider } from './UserContext';
import { 
  BrowserRouter,
  Routes,
  Route, 
} from "react-router-dom";

import Wardrobe from './Pages/Recommendation/wardrobe';


const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <UserProvider>
  <BrowserRouter>
    <Routes>
    <Route path= "/" element={<App />} />
    <Route path= "Wardrobe" element={<Wardrobe />} />
    <Route
      path="*"
      element={
        <main style={{ padding: "1rem" }}>
          <p>There's nothing here!</p>
        </main>
      }
    />
    </Routes>
  </BrowserRouter>
  </UserProvider>
);
