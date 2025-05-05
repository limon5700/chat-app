// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './Home';
import Dashboard from './Dashboard';
import Login from './Login';
import Signup from './Signup';
import Profile from './Profile';

function App() {
  
  const isAuthenticated = localStorage.getItem('user');

  return (
    <Router>
      <Routes>
        <Route path="/Home" element={isAuthenticated ? <Home /> : <Navigate to="/Home" />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/dashboard" />} />
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={<Signup />} />
        {}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;
