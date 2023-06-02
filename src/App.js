import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/landingPage';
import GroupPage from './pages/groupPage';
import RatingPage from './pages/ratingPage';
import Simple from './pages/simple';
import Title from './components/title';
import './App.css';

const App = () => {
  return (
    
    <Router>
      <Routes>
        {/* <Route exact path="/" element={<LandingPage/>} /> */}
        
        <Route exact path="/" element={<Simple/>} />
        <Route path="/group/:type" element={<GroupPage/>} />
        <Route path="/rating" element={<RatingPage/>} />
      </Routes>
    </Router>
  );
};

export default App;
