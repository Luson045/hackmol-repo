import React, { useState, useEffect, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight, LogIn, UserPlus, Check, ChevronLeft, Mail, Lock, User, Github, Twitter } from 'lucide-react';
import { AuthContext } from "../context/AuthContext";
import '../css/AuthPage.css'; // We'll create this file for the animations and custom styles

const Login = () => {
  const { login, register, isAuthenticated, error } = useContext(AuthContext);
  const [authMode, setAuthMode] = useState('welcome'); // welcome, login, register, success
  
  // Form data for both login and register
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [animation, setAnimation] = useState('');
  const [validations, setValidations] = useState({
    email: true,
    password: true,
    password2: true,
    name: true
  });
  const [alert, setAlert] = useState(null);
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Reset validation state when user types
    setValidations(prev => ({ ...prev, [name]: true }));
    setAlert(null);
  };

  // Set transitions when switching auth modes
  const switchMode = (newMode, direction = 'right') => {
    // First set the exit animation
    setAnimation(direction === 'right' ? 'animate-slideOutLeft' : 'animate-slideOutRight');
  
    // After animation completes, change mode and set entry animation
    setTimeout(() => {
      setAuthMode(newMode);
      setAnimation(direction === 'right' ? 'animate-slideInRight' : 'animate-slideInLeft');
      
      // Clear alert when switching modes
      setAlert(null);
    }, 200);
  };
  
  // Validate email format
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Validate password strength
  const validatePassword = (password) => {
    return password.length >= 6;
  };
  
  // Handle login submission
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    
    const emailValid = validateEmail(formData.email);
    const passwordValid = validatePassword(formData.password);
    
    setValidations({
      ...validations,
      email: emailValid,
      password: passwordValid
    });
    
    if (emailValid && passwordValid) {
    try {
        await login({ email: formData.email, password: formData.password });
        // If login is successful, isAuthenticated will be true and redirect will happen
    } catch (err) {
      setAlert(error || 'Login failed');
      }
    }
  };
  
  // Handle register submission
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    
    const emailValid = validateEmail(formData.email);
    const passwordValid = validatePassword(formData.password);
    const nameValid = formData.name.length > 0;
    const passwordsMatch = formData.password === formData.password2;
    
    setValidations({
      email: emailValid,
      password: passwordValid,
      name: nameValid,
      password2: passwordsMatch
    });
    
    if (!passwordsMatch) {
      setAlert('Passwords do not match');
      return;
    }
    
    if (emailValid && passwordValid && nameValid && passwordsMatch) {
    try {
        await register({ 
          name: formData.name, 
          email: formData.email, 
          password: formData.password 
        });
        // If registration is successful, isAuthenticated will be true and redirect will happen
    } catch (err) {
      setAlert(error || 'Registration failed');
      }
    }
  };

  // Set initial animation when component mounts
  useEffect(() => {
    setAnimation('animate-fadeIn');
  }, []);
  
  // Redirect if authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="auth-page-container">
      {/* Left Panel - Visible on md and larger screens */}
      <div className="left-panel">
        <div className="gradient-bg"></div>
        
        {/* Floating elements */}
        <div className="floating-element element-1"></div>
        <div className="floating-element element-2"></div>
        
        <div className="panel-content">
          <h1 className="panel-title">Innovate. Connect. Succeed.</h1>
          <p className="panel-subtitle">Join our platform and transform your ideas into reality. The future of token marketplaces starts here.</p>
          
          <div className="feature-list">
            <div className="feature-item">
              <div className="feature-icon">
                <Check className="icon" size={20} />
              </div>
              <p>✦ Trade model tokens securely
              </p>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">
                <Check className="icon" size={20} />
              </div>
              <p>✦ Unlock unused AI resources
              </p>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">
                <Check className="icon" size={20} />
              </div>
              <p>✦ Empower builders, developers, and innovators</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right Panel - Authentication Forms */}
      <div className="right-panel">
        {/* Glass-like background effects */}
        <div className="glass-bg"></div>
        
        {/* Welcome Screen */}
        {authMode === 'welcome' && (
          <div className={`auth-card ${animation}`}>
            <div className="welcome-header">
              <div className="logo-container">
                <div className="logo-inner">
                  <div className="logo-text">T</div>
                </div>
              </div>
              <h2>Welcome to TokenFlow</h2>
              <p>Your gateway to the future of token marketplace</p>
            </div>
            
            <div className="button-group">
              <button 
                className="primary-button"
                onClick={() => switchMode('login')}
              >
                <LogIn size={18} />
                <span>Sign In</span>
              </button>
              
              <button 
                className="secondary-button"
                onClick={() => switchMode('register')}
              >
                <UserPlus size={18} />
                <span>Create Account</span>
              </button>
            </div>
            
            <div className="social-login">
              <p>Or continue with</p>
              <div className="social-buttons">
                <button className="social-button">
                  <Github size={20} />
                </button>
                <button className="social-button">
                  <Twitter size={20} />
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Login Form */}
        {authMode === 'login' && (
          <div className={`auth-card ${animation}`}>
            <button 
              className="back-button"
              onClick={() => switchMode('welcome', 'left')}
            >
              <ChevronLeft size={18} className="mr-1" />
              <span>Back</span>
            </button>
            
            <div className="auth-header">
              <h2>Welcome Back</h2>
              <p>Sign in to continue to your account</p>
            </div>
            
            {alert && <div className="alert-message">{alert}</div>}
            
            <form onSubmit={handleLoginSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="email">
                  Email Address
                </label>
                <div className={`input-container ${!validations.email ? 'invalid' : ''}`}>
                  <div className="input-icon">
                    <Mail size={16} />
                  </div>
                  <input
                    type="text"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                  />
                </div>
                {!validations.email && (
                  <p className="error-message">Please enter a valid email address</p>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="password">
                  Password
                </label>
                <div className={`input-container ${!validations.password ? 'invalid' : ''}`}>
                  <div className="input-icon">
                    <Lock size={16} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
                {!validations.password && (
                  <p className="error-message">Password must be at least 6 characters</p>
                )}
                <div className="forgot-password">
                  <a href="#">Forgot password?</a>
                </div>
              </div>
              
              <button 
                type="submit" 
                className="primary-button"
              >
                <span>Sign In</span>
                <ArrowRight size={18} />
              </button>
            </form>
            
            <div className="auth-footer">
              <p>
                Don't have an account?{' '}
                <button 
                  className="text-link"
                  onClick={() => switchMode('register')}
                >
                  Sign Up
                </button>
              </p>
            </div>
          </div>
        )}
        
        {/* Register Form */}
        {authMode === 'register' && (
          <div className={`auth-card ${animation}`}>
            <button 
              className="back-button"
              onClick={() => switchMode('welcome', 'left')}
            >
              <ChevronLeft size={18} className="mr-1" />
              <span>Back</span>
            </button>
            
            <div className="auth-header">
              <h2>Create Account</h2>
              <p>Join us and start your journey</p>
            </div>
            
            {alert && <div className="alert-message">{alert}</div>}
            
            <form onSubmit={handleRegisterSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="name">
                  Full Name
                </label>
                <div className={`input-container ${!validations.name ? 'invalid' : ''}`}>
                  <div className="input-icon">
                    <User size={16} />
                  </div>
                  <input
            type="text" 
                    id="name"
            name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                  />
                </div>
                {!validations.name && (
                  <p className="error-message">Please enter your name</p>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="register-email">
                  Email Address
                </label>
                <div className={`input-container ${!validations.email ? 'invalid' : ''}`}>
                  <div className="input-icon">
                    <Mail size={16} />
                  </div>
                  <input
                    type="text"
                    id="register-email"
            name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                  />
                </div>
                {!validations.email && (
                  <p className="error-message">Please enter a valid email address</p>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="register-password">
                  Password
                </label>
                <div className={`input-container ${!validations.password ? 'invalid' : ''}`}>
                  <div className="input-icon">
                    <Lock size={16} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="register-password"
            name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
                {!validations.password && (
                  <p className="error-message">Password must be at least 6 characters</p>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="password2">
                  Confirm Password
                </label>
                <div className={`input-container ${!validations.password2 ? 'invalid' : ''}`}>
                  <div className="input-icon">
                    <Lock size={16} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password2"
            name="password2"
                    value={formData.password2}
                    onChange={handleChange}
                    placeholder="••••••••"
          />
                </div>
                {!validations.password2 && (
                  <p className="error-message">Passwords do not match</p>
                )}
              </div>
              
              <div className="terms-checkbox">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                />
                <label htmlFor="terms">
                  I agree to the{' '}
                  <a href="#" className="text-link">
                    Terms of Service
                  </a>
                  {' '}and{' '}
                  <a href="#" className="text-link">
                    Privacy Policy
                  </a>
                </label>
              </div>
              
              <button 
                type="submit" 
                className="primary-button"
              >
                <span>Create Account</span>
                <ArrowRight size={18} />
              </button>
            </form>
            
            <div className="auth-footer">
              <p>
                Already have an account?{' '}
                <button 
                  className="text-link"
                  onClick={() => switchMode('login')}
                >
              Sign In
                </button>
              </p>
            </div>
          </div>
        )}
        
        {/* Success Screen */}
        {authMode === 'success' && (
          <div className={`auth-card ${animation} success-card`}>
            <div className="success-icon">
              <Check size={40} />
            </div>
            
            <h2>
              {authMode === 'register' ? 'Account Created!' : 'Welcome Back!'}
            </h2>
            <p>
              {authMode === 'register' 
                ? 'Your account has been successfully created. You can now access all features.' 
                : 'You have successfully signed in to your account.'}
            </p>
            
            <div className="button-container">
              <button 
                className="primary-button"
                onClick={() => switchMode('welcome')}
              >
                <span>Continue to Dashboard</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;