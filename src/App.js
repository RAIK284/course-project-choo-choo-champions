// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import SignUpPage from './components/SignupPage'; // Correct the import path
import TrainSelector from './components/TrainSelector'
import NavBar from './components/NavBar'
import Background from './components/Background'

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignUpPage />} /> {/* Add route for SignUpPage */}
        <Route path="/trains" element={<TrainSelector />} />
        <Route path="/navbar" element={<NavBar />} />
        <Route path="/background" element={<Background />} />
      </Routes>
    </Router>
  );
}

export default App;
