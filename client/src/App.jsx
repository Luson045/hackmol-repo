import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './user_dashboard/Dashboard';
import Market from './pages/Market';
import AdminDashboard from './admin_dashboard/AdminDashboard';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import Footer from './components/Footer';
import ChatInterface from './chat/ChatInterface';
import ExpandableChatbot from './components/Chatbot';
import './css/ChatInterface.css';
import PaymentGateway from './pages/payment'
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <div className="container">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route 
                path="/dashboard" 
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/marketplace" 
                element={
                  <PrivateRoute>
                    <Market />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/admin" 
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/payment" 
                element={
                  <AdminRoute>
                    <payment />
                  </AdminRoute>
                } 
              />   
            <Route 
              path="/chat" 
              element={<PrivateRoute><ChatInterface/></PrivateRoute>} />
            <Route path="/" element={<Home />} />
            </Routes>
            <Footer/> 
            <ExpandableChatbot/>
          </div>
        </div>
      </Router>
 
    </AuthProvider>
  );
}

export default App;


