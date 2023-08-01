// src/Routes.js
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import App from './App'; // Import your main App component
import Wardrobe from './Wardrobe'; // Import your wardrobe component

const Routes = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={App} /> {/* Route for the home/login page */}
        <Route exact path="/wardrobe" component={Wardrobe} /> {/* Route for the wardrobe page */}
      </Switch>
    </Router>
  );
};

export default Routes;
