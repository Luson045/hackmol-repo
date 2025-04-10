
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';

import Market from './pages/Market';

import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './Components/AdminRoute';


function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <div className="container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
             
              <Route 
                path="/marketplace" 
                element={
                  <PrivateRoute>
                    <Market />
                  </PrivateRoute>
                } 
              />
        
              
         
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
