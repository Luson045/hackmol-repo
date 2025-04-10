// client/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
// import Dashboard from './user_dashboard/Dashboard';
import Market from './pages/Market';
// import AdminDashboard from './admin_dashboard/AdminDashboard';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import Footer from './Components/Footer';
// import ChatInterface from './chat/ChatInterface';
// import './css/ChatInterface.css';

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
              {/* <Route 
                path="/dashboard" 
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                } 
              /> */}
              <Route 
                path="/marketplace" 
                element={
                  <PrivateRoute>
                    <Market />
                  </PrivateRoute>
                } 
              />
              {/* <Route 
                path="/admin" 
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                } 
              /> */}
              
            {/* <Route 
              path="/chat" 
              element={<PrivateRoute><ChatInterface/></PrivateRoute>} /> */}
            </Routes>
            <Footer/>
          </div>
        </div>
      </Router>
 
    </AuthProvider>
  );
}

export default App;

// client/src