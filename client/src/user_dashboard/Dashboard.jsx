import React, { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { 
  FiKey, FiShoppingCart, FiTrendingUp, FiMenu, FiX, 
  FiUser, FiSettings, FiLogOut, FiPieChart, FiDollarSign,
  FiCreditCard, FiShield, FiMessageCircle, FiCalendar, FiDownload,
  FiHome, FiMessageSquare, FiShoppingBag, FiBarChart2, FiHelpCircle, 
  FiArrowRight, FiArrowLeft, FiCheckCircle, FiMoreHorizontal 
} from 'react-icons/fi';
import { 
  BsGraphUp, BsWallet2, BsLightningCharge, BsArrowUpRight,
  BsArrowDownRight
} from 'react-icons/bs';

import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import CountUp from 'react-countup';
import { ToastContainer, toast } from 'react-toastify';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title } from 'chart.js';
import { Doughnut, Line, Bar } from 'react-chartjs-2';
import 'react-toastify/dist/ReactToastify.css';
import 'react-circular-progressbar/dist/styles.css';
import ApiKeyList from './ApiKeyList';
import AddApiKeyModal from './AddApiKey';
import PurchaseHistory from './PurchaseHistory';
import SalesHistory from './SalesHistory';
import Market from '../pages/Market';
import ChatInterface from '../chat/ChatInterface';
import '../css/Dashboard.css';
import '../css/ChatInterface.css';
import Settings from './Settings';
import PaymentGateway from '../pages/payment'

// Register Chart.js components
ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title
);

// SVG defs for gradient definitions
const SvgDefs = () => (
  <svg id="gradientDefs">
    <defs>
      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#6930c3" />
        <stop offset="100%" stopColor="#64dfdf" />
      </linearGradient>
    </defs>
  </svg>
);

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [apiKeys, setApiKeys] = useState([]);
  const [temporaryTokens, setTemporaryTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [purchaseTransactions, setPurchaseTransactions] = useState([]);
  const [salesTransactions, setSalesTransactions] = useState([]);
  const [transactionsLoading, setTransactionsLoading] = useState(true);
  const [tokenValue, setTokenValue] = useState(0);
  const [todayGain, setTodayGain] = useState(5); // Default value
  const [weeklyGrowth, setWeeklyGrowth] = useState(2.5); // Default value
  const [userAmount, setUserAmount] = useState(0);
  const [tokenStats, setTokenStats] = useState({
    totalTokens: 0,
    usedTokens: 0,
    usagePercentage: 0,
    apiCalls: 0,
    securityLevel: 'High',
    usageHistory: [],
    usageByApiKey: [],
    securityMetrics: {
      keyStrength: 85,
      accessControl: 70,
      usagePatterns: 90
    }
  });
  
  // Create a ref for the update interval
  const tokenStatsIntervalRef = useRef(null);

  // Tour guide state
  const [showTour, setShowTour] = useState(false);
  const [tourStep, setTourStep] = useState(1);
  const [tourCompleted, setTourCompleted] = useState(false);
  const [tourPosition, setTourPosition] = useState({ left: '50%', top: '50%' });
  const [highlightedElement, setHighlightedElement] = useState(null);
  const tourModalRef = useRef(null);
  
  // Track if this is a login session
  const [isNewSession, setIsNewSession] = useState(true);
  
  // First, add a state to track which section is currently highlighted
  const [highlightedSection, setHighlightedSection] = useState(null);
  
  // Updated Tour steps - point to buyer and seller headers instead of sidebar
  const tourSteps = [
    {
      title: "Welcome to TokenFlow Dashboard",
      description: "Let's take a quick tour to help you get started with the platform.",
      target: ".dashboard-header"
    },
    {
      title: "Buyer Section",
      description: "As a buyer, you can browse the marketplace and purchase tokens from sellers.",
      target: ".sidebar-role-separator .buyer" // Target the buyer icon/header
    },
    {
      title: "Seller Section", 
      description: "As a seller, you can create and manage API keys to sell tokens to buyers.",
      target: ".sidebar-role-separator .seller" // Target the seller icon/header
    },
    {
      title: "Dashboard Overview",
      description: "This section gives you an overview of your API keys and token usage.",
      target: ".stats-cards-container"
    },
    {
      title: "API Keys Management",
      description: "View and manage your API keys from this section.",
      target: ".api-keys-section" // Updated target for more specificity
    },
    {
      title: "User Profile",
      description: "View your profile and logout from here.",
      target: ".sidebar-user"
    }
  ];

  // Updated addHighlight function to handle section highlighting
  const addHighlight = (element) => {
    if (element) {
      // Remove highlight from previous element if exists
      if (highlightedElement) {
        highlightedElement.classList.remove('tour-highlight');
      }
      
      // Remove any previous section highlights
      if (highlightedSection) {
        const sectionElements = document.querySelectorAll(`.${highlightedSection}-items`);
        sectionElements.forEach(el => {
          el.classList.remove('section-highlight');
        });
        setHighlightedSection(null);
      }
      
      // Add highlight to current element
      element.classList.add('tour-highlight');
      setHighlightedElement(element);
      
      // Special handling for buyer and seller sections
      if (element.classList.contains('buyer')) {
        // Highlight all buyer menu items
        const buyerItems = document.querySelectorAll('.buyer-items');
        buyerItems.forEach(item => {
          item.classList.add('section-highlight');
        });
        setHighlightedSection('buyer');
      } 
      else if (element.classList.contains('seller')) {
        // Highlight all seller menu items
        const sellerItems = document.querySelectorAll('.seller-items');
        sellerItems.forEach(item => {
          item.classList.add('section-highlight');
        });
        setHighlightedSection('seller');
      }
    }
  };
  
  // Updated removeHighlight function to also clear section highlights
  const removeHighlight = () => {
    if (highlightedElement) {
      highlightedElement.classList.remove('tour-highlight');
      setHighlightedElement(null);
    }
    
    // Clear any section highlights
    if (highlightedSection) {
      const sectionElements = document.querySelectorAll(`.${highlightedSection}-items`);
      sectionElements.forEach(el => {
        el.classList.remove('section-highlight');
      });
      setHighlightedSection(null);
    }
  };

  // Position tour guide close to element - with adjusted positioning
  const positionTourGuide = (element) => {
    if (!element || !tourModalRef.current) return;
    
    const elementRect = element.getBoundingClientRect();
    const modalRect = tourModalRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const sidebarWidth = document.querySelector('.sidebar')?.getBoundingClientRect().width || 250;
    
    // Calculate optimal position
    let left, top;
    
    // For buyer and seller headers in the sidebar
    if (element.closest('.sidebar-role-separator')) {
      // Position at a fixed distance from the sidebar
      left = `${sidebarWidth + 50}px`;
      
      // Align with the element's top
      top = `${elementRect.top - 20}px`;
    }
    // Special positioning for API Keys section - position BELOW instead of above
    else if (element.classList.contains('api-keys-section')) {
      // Position centered horizontally BELOW the API Keys section
      left = `${elementRect.left + (elementRect.width / 2) - (modalRect.width / 2)}px`;
      
      // Get the height of the element
      const elementHeight = elementRect.height;
      
      // Position below the element
      top = `${elementRect.top + elementHeight + 20}px`;
      
      // If too close to the bottom, adjust
      if (elementRect.top + elementHeight + modalRect.height + 40 > viewportHeight) {
        // Try positioning to the right side instead
        left = `${elementRect.right + 20}px`;
        top = `${elementRect.top + (elementHeight / 2) - (modalRect.height / 2)}px`;
        
        // If still off-screen, put it at the bottom of the viewport
        if (parseFloat(left) + modalRect.width > viewportWidth - 20) {
          left = `${viewportWidth - modalRect.width - 20}px`;
        }
      }
    }
    // Try to position to the right of the element
    else if (elementRect.right + modalRect.width + 20 < viewportWidth) {
      left = `${elementRect.right + 20}px`;
      top = `${elementRect.top + (elementRect.height / 2) - (modalRect.height / 2)}px`;
    } 
    // Try to position to the left of the element
    else if (elementRect.left - modalRect.width - 20 > 0) {
      left = `${elementRect.left - modalRect.width - 20}px`;
      top = `${elementRect.top + (elementRect.height / 2) - (modalRect.height / 2)}px`;
    }
    // Try to position below the element
    else if (elementRect.bottom + modalRect.height + 20 < viewportHeight) {
      left = `${elementRect.left + (elementRect.width / 2) - (modalRect.width / 2)}px`;
      top = `${elementRect.bottom + 20}px`;
    }
    // Try to position above the element
    else if (elementRect.top - modalRect.height - 20 > 0) {
      left = `${elementRect.left + (elementRect.width / 2) - (modalRect.width / 2)}px`;
      top = `${elementRect.top - modalRect.height - 20}px`;
    }
    // Last resort: center on screen
    else {
      left = `${(viewportWidth - modalRect.width) / 2}px`;
      top = `${(viewportHeight - modalRect.height) / 2}px`;
    }
    
    // Ensure our modal doesn't go off-screen
    const numLeft = parseFloat(left);
    const numTop = parseFloat(top);
    
    if (numLeft < sidebarWidth + 10) left = `${sidebarWidth + 10}px`; // Keep away from sidebar
    if (numTop < 20) top = '20px';
    if (numLeft + modalRect.width > viewportWidth - 20) left = `${viewportWidth - modalRect.width - 20}px`;
    if (numTop + modalRect.height > viewportHeight - 20) top = `${viewportHeight - modalRect.height - 20}px`;
    
    // Update position with animation
    setTourPosition({ left, top });
  };

  // Update for current tour step
  const updateForCurrentStep = (step) => {
    const currentStep = tourSteps[step - 1];
    if (!currentStep) return;
    
    try {
      const targetElement = document.querySelector(currentStep.target);
      if (targetElement) {
        // Scroll to element
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Add highlight effect
        addHighlight(targetElement);
        
        // After scrolling completes, position the tour guide
        setTimeout(() => {
          positionTourGuide(targetElement);
        }, 500);
      }
    } catch (error) {
      console.error('Error updating tour step:', error);
    }
  };

  // Start tour
  const startTour = () => {
    setTourStep(1);
    setShowTour(true);
    
    // Wait a moment for the tour modal to render before positioning
    setTimeout(() => {
      updateForCurrentStep(1);
    }, 100);
  };

  // End tour
  const endTour = () => {
    setShowTour(false);
    setTourCompleted(true);
    removeHighlight();
    toast.success("Tour completed! You're all set to use TokenFlow.");
  };

  // Go to next step
  const nextStep = () => {
    if (tourStep < tourSteps.length) {
      const newStep = tourStep + 1;
      setTourStep(newStep);
      updateForCurrentStep(newStep);
    }
  };

  // Go to previous step
  const prevStep = () => {
    if (tourStep > 1) {
      const newStep = tourStep - 1;
      setTourStep(newStep);
      updateForCurrentStep(newStep);
    }
  };

  // Handle dragging the tour guide
  const handleMouseDown = (e) => {
    if (!tourModalRef.current) return;
    
    const startX = e.clientX;
    const startY = e.clientY;
    const boxRect = tourModalRef.current.getBoundingClientRect();
    const offsetX = startX - boxRect.left;
    const offsetY = startY - boxRect.top;
    
    const handleMouseMove = (e) => {
      const x = e.clientX - offsetX;
      const y = e.clientY - offsetY;
      
      // Ensure the modal stays within viewport
      const maxX = window.innerWidth - boxRect.width;
      const maxY = window.innerHeight - boxRect.height;
      
      const boundedX = Math.max(20, Math.min(x, maxX - 20));
      const boundedY = Math.max(20, Math.min(y, maxY - 20));
      
      setTourPosition({
        left: `${boundedX}px`,
        top: `${boundedY}px`
      });
    };
    
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    // Prevent text selection during drag
    e.preventDefault();
  };

  // Check for login and start tour automatically
  useEffect(() => {
    // Only run when the component first mounts and user is loaded
    const handleLoginTour = async () => {
      console.log(user);
      if(!user.firstuser){
        return;
      }
      else if (!loading && user) {
        // Check if authentication just happened by looking at token timestamp
        const authToken = localStorage.getItem('token');
        
        if (authToken) {
          try {
            // Get token timestamp - if it doesn't exist, create it now
            let tourShownThisSession = sessionStorage.getItem('tourShownThisSession');
            
            if (!tourShownThisSession) {
              // This is a new login session - mark that we've shown the tour this session
              sessionStorage.setItem('tourShownThisSession', 'true');
              
              // Start the tour after a short delay
              setTimeout(() => {
                startTour();
              }, 1000);
              
              const res = await axios.post('/api/users/flag',{userId:user.id});
              console.log(res);
            }
          } catch (error) {
            console.error('Error checking login status:', error);
          }
        }
      }
    };
    
    handleLoginTour();
  }, [loading, user]);

  // Also add this effect to listen for login events from the auth context
  useEffect(() => {
    // Create a function to handle logout events (to reset tour for next login)
    const handleLogout = () => {
      // Clear tour session flag when user logs out
      sessionStorage.removeItem('tourShownThisSession');
    };
    
    // Add a listener for storage events (in case of logout in another tab)
    const handleStorageChange = (event) => {
      if (event.key === 'token' && !event.newValue && event.oldValue) {
        // Token was removed (logout occurred)
        handleLogout();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      removeHighlight();
    };
  }, []);

  useEffect(() => {
    // Set up interval for real-time token usage updates
    tokenStatsIntervalRef.current = setInterval(() => {
      fetchTokenAnalytics();
    }, 5000); // Poll every 5 seconds
    
    // Cleanup interval
    return () => {
      if (tokenStatsIntervalRef.current) {
        clearInterval(tokenStatsIntervalRef.current);
      }
    };
  }, []);

  // Function to fetch real-time token analytics data
  const fetchTokenAnalytics = async () => {
    try {
      const analyticsRes = await axios.get('/api/users/token-analytics');
      
      // Update token statistics with real data from the server
      setTokenStats(prevStats => ({
        ...prevStats,
        totalTokens: analyticsRes.data.totalTokens || prevStats.totalTokens,
        usedTokens: analyticsRes.data.usedTokens || prevStats.usedTokens,
        usagePercentage: analyticsRes.data.usagePercentage || prevStats.usagePercentage,
        apiCalls: analyticsRes.data.apiCalls || prevStats.apiCalls,
        securityLevel: analyticsRes.data.securityLevel || prevStats.securityLevel,
        usageHistory: analyticsRes.data.usageHistory || prevStats.usageHistory,
        usageByApiKey: analyticsRes.data.usageByApiKey || prevStats.usageByApiKey,
        securityMetrics: analyticsRes.data.securityMetrics || prevStats.securityMetrics
      }));
      
      // Display loading spinner during each update
      const analyticsSection = document.querySelector('.analytics-grid');
      if (analyticsSection) {
        const loadingSpinner = document.createElement('div');
        loadingSpinner.className = 'token-analytics-loading';
        loadingSpinner.innerHTML = `
          <div class="market-loading-spinner" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) scale(0.5); opacity: 0.7; z-index: 10;">
            <div class="spinner-ring"></div>
            <div class="spinner-ring"></div>
            <div class="spinner-ring"></div>
          </div>
        `;
        analyticsSection.style.position = 'relative';
        analyticsSection.appendChild(loadingSpinner);
        
        // Remove the spinner after a short delay
        setTimeout(() => {
          const spinner = document.querySelector('.token-analytics-loading');
          if (spinner) spinner.remove();
        }, 500);
      }
    } catch (err) {
      console.error('Error fetching real-time token analytics:', err);
    }
  };
  
  // Replace the old token stats interval code in the useEffect
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, apiKeysRes, purchaseRes, salesRes] = await Promise.all([
          axios.get('/api/users/profile'),
          axios.get('/api/users/api-keys'),
          axios.get('/api/users/transactions'),
          axios.get('/api/users/sales')
        ]);
        
        setApiKeys(apiKeysRes.data);
        setTemporaryTokens(userRes.data.temporaryTokens || []);
        setPurchaseTransactions(purchaseRes.data || []);
        setSalesTransactions(salesRes.data || []);
        
        // Set user amount from user profile data
        setUserAmount(userRes.data.amount || 0);
        
        // Calculate average token value from transactions
        calculateTokenValue(purchaseRes.data);
        
        // Get initial token usage statistics
        fetchTokenAnalytics();
        
        setTransactionsLoading(false);
        setTimeout(() => setLoading(false), 800); // Add slight delay for animation
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setLoading(false);
        setTransactionsLoading(false);
        toast.error('Failed to load dashboard data');
      }
    };

    fetchData();
  }, []);

  // Calculate the average token value from recent transactions
  const calculateTokenValue = (transactions) => {
    if (!transactions || transactions.length === 0) {
      setTokenValue(0.35); // Default fallback value
      return;
    }
    
    // Get recent transactions (last 10)
    const recentTransactions = transactions.slice(0, 10);
    
    // Calculate average price per token
    let totalPrice = 0;
    let count = 0;
    
    recentTransactions.forEach(transaction => {
      if (transaction.pricePerToken && transaction.pricePerToken > 0) {
        totalPrice += transaction.pricePerToken;
        count++;
      }
    });
    
    const averageValue = count > 0 ? totalPrice / count : 0.35;
    setTokenValue(averageValue);
    
    // Calculate growth metrics (for demo purposes - could be replaced with real calculations)
    const randomTodayGain = Math.floor(Math.random() * 10) + 1;  // 1-10%
    const randomWeeklyChange = (Math.random() * 10 - 5).toFixed(1);  // -5% to +5%
    
    setTodayGain(randomTodayGain);
    setWeeklyGrowth(parseFloat(randomWeeklyChange));
  };

  // Function to refresh transaction data when needed
  const refreshTransactions = async () => {
    setTransactionsLoading(true);
    try {
      const [userRes, apiKeysRes, purchaseRes, salesRes] = await Promise.all([
        axios.get('/api/users/profile'),
        axios.get('/api/users/api-keys'),
        axios.get('/api/users/transactions'),
        axios.get('/api/users/sales')
      ]);
      
      // Update user amount
      setUserAmount(userRes.data.amount || 0);
      
      // Update temporary tokens
      setTemporaryTokens(userRes.data.temporaryTokens || []);
      
      setPurchaseTransactions(purchaseRes.data || []);
      setSalesTransactions(salesRes.data || []);
      
      // Recalculate token value with fresh data
      calculateTokenValue(purchaseRes.data);
      
      // Fetch fresh token analytics data
      await fetchTokenAnalytics();
      
      setTransactionsLoading(false);
      
      toast.success('Token analytics updated successfully');
    } catch (err) {
      console.error('Error refreshing transaction data:', err);
      setTransactionsLoading(false);
      toast.error('Failed to refresh token analytics');
    }
  };

  const addApiKey = async (newApiKey) => {
    try {
      const res = await axios.post('/api/users/api-keys', newApiKey);
      setApiKeys([...apiKeys, res.data.apiKey]);
      setShowAddModal(false);
      toast.success('API Key added successfully');
    } catch (err) {
      console.error('Error adding API key:', err);
      toast.error('Failed to add API Key');
    }
  };

  const deleteApiKey = async (id) => {
    try {
      await axios.delete(`/api/users/api-keys/${id}`);
      setApiKeys(apiKeys.filter(key => key._id !== id));
      toast.success('API Key deleted successfully');
    } catch (err) {
      console.error('Error deleting API key:', err);
      toast.error('Failed to delete API Key');
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // Refresh transactions data when switching to relevant tabs
    if (tab === 'purchases' || tab === 'sales' || tab === 'dashboard') {
      refreshTransactions();
    }
  };

  const handleLogout = () => {
    logout();
    // Navigate to login page after logout
    window.location.href = '/login';
  };

  const renderTransactionsTable = (transactions, type) => {
    if (transactionsLoading) {
      return <div className="p-4 text-center">Loading transactions...</div>;
    }

    if (!transactions || transactions.length === 0) {
      return <div className="p-4 text-center">No {type} history found.</div>;
    }

    return (
      <div className="table-responsive">
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>API Key</th>
              <th>{type === 'purchase' ? 'Seller' : 'Buyer'}</th>
              <th>Tokens</th>
              <th>Total</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.slice(0, 5).map(transaction => (
              <tr key={transaction._id}>
                <td data-label="API Key">
                  <div className="table-item-with-icon">
                    <div className="item-icon">
                      <FiKey />
                    </div>
                    <span className="item-name">{transaction.apiKeyName}</span>
                  </div>
                </td>
                <td data-label={type === 'purchase' ? 'Seller' : 'Buyer'}>
                  {type === 'purchase' ? transaction.seller?.name : transaction.buyer?.name}
                </td>
                <td data-label="Tokens">{transaction.tokensPurchased}</td>
                <td data-label="Total">${transaction.totalAmount?.toFixed(2)}</td>
                <td data-label="Date">
                  <div className="table-item-with-icon">
                    <FiCalendar />
                    <span className="timestamp">
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Add CSS styles for highlighting with useEffect
  useEffect(() => {
    // Create a style element for dynamic CSS
    const styleElement = document.createElement('style');
    
    // Define CSS for the tour highlights
    styleElement.textContent = `
      .tour-highlight {
        position: relative;
        z-index: 10;
        box-shadow: 0 0 0 3px #6930c3;
        border-radius: 5px;
        animation: highlight-pulse 1.5s infinite alternate;
      }
      
      .section-highlight {
        background-color: rgba(105, 48, 195, 0.1);
        box-shadow: inset 0 0 5px rgba(105, 48, 195, 0.3);
        border-radius: 4px;
        animation: section-pulse 1.5s infinite alternate;
      }
      
      @keyframes highlight-pulse {
        0% { box-shadow: 0 0 0 3px rgba(105, 48, 195, 0.7); }
        100% { box-shadow: 0 0 0 6px rgba(105, 48, 195, 0.9); }
      }
      
      @keyframes section-pulse {
        0% { background-color: rgba(105, 48, 195, 0.1); }
        100% { background-color: rgba(105, 48, 195, 0.2); }
      }
    `;
    
    // Add the style to the document head
    document.head.appendChild(styleElement);
    
    // Clean up when component unmounts
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  if (loading) {
    return (
      <div className="dashboard-container">
        <SvgDefs />
        <div className="main-content">
          <div className="main-loader">
            <div className="market-loading-spinner">
              <div className="spinner-ring"></div>
              <div className="spinner-ring"></div>
              <div className="spinner-ring"></div>
            </div>
            <div className="loader-text">Preparing your dashboard...</div>
          </div>
        </div>
      </div>
    );
  }

  const totalTokens = temporaryTokens.reduce((acc, token) => acc + token.tokensRemaining, 0);
  const tokenUsagePercentage = (totalTokens / (totalTokens + 100)) * 100;

  // Prepare chart data
  const doughnutData = {
    labels: ['Used Tokens', 'Remaining Tokens'],
    datasets: [
      {
        data: [tokenStats.usedTokens, tokenStats.totalTokens - tokenStats.usedTokens],
        backgroundColor: [
          'rgba(94, 96, 206, 0.8)',
          'rgba(64, 64, 64, 0.3)'
        ],
        borderColor: [
          'rgba(94, 96, 206, 1)',
          'rgba(64, 64, 64, 0.5)'
        ],
        borderWidth: 1,
        hoverOffset: 4
      }
    ]
  };
  
  const lineData = {
    labels: tokenStats.usageHistory?.map(item => {
      const date = new Date(item.timestamp);
      return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
    }),
    datasets: [
      {
        label: 'Token Usage (%)',
        data: tokenStats.usageHistory?.map(item => item.usage),
        fill: true,
        backgroundColor: 'rgba(94, 96, 206, 0.2)',
        borderColor: 'rgba(94, 96, 206, 1)',
        tension: 0.4,
        pointRadius: 3,
        pointBackgroundColor: 'rgba(94, 96, 206, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 1
      }
    ]
  };
  
  const barData = {
    labels: tokenStats.usageByApiKey?.map(item => item.name),
    datasets: [
      {
        label: 'Tokens Used by API Key',
        data: tokenStats.usageByApiKey?.map(item => item.value),
        backgroundColor: 'rgba(94, 96, 206, 0.7)',
        borderColor: 'rgba(94, 96, 206, 1)',
        borderWidth: 1
      }
    ]
  };
  
  const securityRadarData = {
    labels: ['Key Strength', 'Access Control', 'Usage Patterns'],
    datasets: [
      {
        label: 'Security Metrics',
        data: [
          tokenStats.securityMetrics?.keyStrength || 0,
          tokenStats.securityMetrics?.accessControl || 0,
          tokenStats.securityMetrics?.usagePatterns || 0
        ],
        backgroundColor: 'rgba(94, 96, 206, 0.2)',
        borderColor: 'rgba(94, 96, 206, 0.7)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(94, 96, 206, 1)',
        pointRadius: 4
      }
    ]
  };
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: 'rgba(255, 255, 255, 0.7)'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        titleColor: 'rgba(255, 255, 255, 0.9)',
        bodyColor: 'rgba(255, 255, 255, 0.9)',
        titleFont: {
          size: 14
        },
        bodyFont: {
          size: 13
        },
        padding: 10,
        cornerRadius: 4,
        displayColors: true
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)'
        }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)'
        }
      }
    }
  };
  
  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: 'rgba(255, 255, 255, 0.7)'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        titleFont: {
          size: 14
        },
        bodyFont: {
          size: 13
        },
        padding: 10,
        cornerRadius: 4
      }
    }
  };

  return (
    <div className={`dashboard-container ${sidebarOpen ? 'sidebar-open' : ''}`}>
      <SvgDefs />
      <ToastContainer 
        position="top-right" 
        autoClose={3000}
        theme="dark"
        toastStyle={{ 
          background: 'var(--bg-secondary)',
          color: 'var(--text-primary)',
          boxShadow: 'var(--card-shadow)',
          borderRadius: 'var(--border-radius-md)'
        }} 
      />
      
      {/* Top Navigation Bar - Removed Marketplace */}
      <div className="top-nav">
        <div className="top-nav-brand">Token Marketplace</div>
        <div className="top-nav-menu">
          <div 
            className={`top-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} 
            onClick={() => handleTabChange('dashboard')}
          >
            Dashboard
          </div>
          <div 
            className={`top-nav-item ${activeTab === 'chat' ? 'active' : ''}`} 
            onClick={() => handleTabChange('chat')}
          >
            Chat
          </div>
          <div 
            className="top-nav-item" 
            onClick={handleLogout}
          >
            Logout
          </div>
        </div>
      </div>

      {/* Fixed Sidebar - Added Marketplace */}
      <div className="sidebar">
        <div className="sidebar-logo">TokenFlow</div>
        <div className="sidebar-menu">
          {/* Common Dashboard */}
          <div
            className={`sidebar-menu-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => handleTabChange('dashboard')}
          >
            <FiHome />
            <span>Dashboard</span>
          </div>
          
          {/* Buyer Section - Target for tour step 2 */}
          <div className="sidebar-role-separator">
            <div className="sidebar-role-icon buyer">
              <FiShoppingCart />
            </div>
            <span>Buyer</span>
          </div>
          
          <div
            className={`sidebar-menu-item buyer-items ${activeTab === 'marketplace' ? 'active' : ''}`}
            onClick={() => handleTabChange('marketplace')}
          >
            <FiShoppingBag />
            <span>Marketplace</span>
          </div>
          
          <div
            className={`sidebar-menu-item buyer-items ${activeTab === 'purchases' ? 'active' : ''}`}
            onClick={() => handleTabChange('purchases')}
          >
            <FiShoppingCart />
            <span>Purchase History</span>
          </div>
          
          {/* Seller Section - Target for tour step 3 */}
          <div className="sidebar-role-separator">
            <div className="sidebar-role-icon seller">
              <FiKey />
            </div>
            <span>Seller</span>
          </div>
          
          <div
            className={`sidebar-menu-item seller-items ${activeTab === 'apikeys' ? 'active' : ''}`}
            onClick={() => handleTabChange('apikeys')}
          >
            <FiKey />
            <span>API Keys</span>
          </div>
          
          <div
            className={`sidebar-menu-item seller-items ${activeTab === 'sales' ? 'active' : ''}`}
            onClick={() => handleTabChange('sales')}
          >
            <BsGraphUp />
            <span>Sales History</span>
          </div>
          
          {/* Common Section for both roles */}
          <div className="sidebar-role-separator">
            <div className="sidebar-role-icon common">
              <FiUser />
            </div>
            <span>Common</span>
          </div>
          
          <div
            className={`sidebar-menu-item ${activeTab === 'chat' ? 'active' : ''}`}
            onClick={() => handleTabChange('chat')}
          >
            <FiMessageSquare />
            <span>Chat</span>
          </div>
          
          <div
            className={`sidebar-menu-item ${activeTab === 'payment' ? 'active' : ''}`}
            onClick={() => handleTabChange('payment')}
          >
            <FiDollarSign />
            <span>Add Funds</span>
          </div>
          
          <div
            className={`sidebar-menu-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => handleTabChange('settings')}
          >
            <FiSettings />
            <span>Settings</span>
          </div>
        </div>

        <div className="sidebar-user">
          <div className="user-avatar">
            <FiUser />
          </div>
          <div className="user-info">
            <div className="user-name">{user?.name || 'ravi'}</div>
            <div className="user-role">Pro User</div>
          </div>
          <motion.div 
            className="logout-button"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleLogout}
          >
            <FiLogOut />
          </motion.div>
        </div>
      </div>

      {/* Main Content - Conditional rendering based on active tab */}
      <motion.div 
        className="main-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {activeTab === 'dashboard' && (
          <>
            <div className="dashboard-header">
              <div>
                <h2>Welcome back, {user?.name || 'ravi'}</h2>
                <p>Here's what's happening with your tokens today</p>
              </div>
              <motion.button 
                className="btn-primary" 
                onClick={() => setShowAddModal(true)}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiKey /> Add New API Key
              </motion.button>
            </div>

            {/* Stats Cards - Removed additional buyer/seller cards */}
            <div className="stats-cards-container">
              <motion.div 
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1, type: "spring" }}
              >
                <div className="stats-card">
                  <div className="stats-icon">
                    <FiKey />
                  </div>
                  <div className="stats-content">
                    <div className="stats-title">Total API Keys</div>
                    <div className="stats-value">
                      <CountUp end={apiKeys.length || 0} duration={2.5} />
                    </div>
                    
                  </div>
                </div>
              </motion.div>
              <motion.div 
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
              >
                <div className="stats-card">
                  <div className="stats-icon">
                    <BsWallet2 />
                  </div>
                  <div className="stats-content">
                    <div className="stats-title">Active Tokens</div>
                    <div className="stats-value">
                      <CountUp end={temporaryTokens.length || 7} duration={2.5} />
                    </div>
                   
                  </div>
                </div>
              </motion.div>
              <motion.div 
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
              >
                <div className="stats-card">
                  <div className="stats-icon">
                    <FiDollarSign />
                  </div>
                  <div className="stats-content">
                    <div className="stats-title">User Balance</div>
                    <div className="stats-value">
                      <CountUp end={userAmount} prefix="Rs " decimals={2} duration={2.5} />
                    </div>
                   
                  </div>
                </div>
              </motion.div>
            </div>

            {/* API Keys Section */}
            <motion.div 
              className="dashboard-card api-keys-section"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, type: "spring" }}
            >
              <div className="card-header">
                <h4>Your API Keys</h4>
              </div>
              <div className="card-body">
                <ApiKeyList apiKeys={apiKeys} onDelete={deleteApiKey} />
              </div>
            </motion.div>

            {/* Tokens Section */}
      {temporaryTokens.length > 0 && (
              <motion.div 
                className="dashboard-card"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7, type: "spring" }}
              >
                <div className="card-header">
                <h4>Your Purchased Tokens</h4>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                    <table className="dashboard-table">
                    <thead>
                      <tr>
                        <th>API Key Name</th>
                        <th>Tokens Remaining</th>
                        <th>Purchased Date</th>
                          <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {temporaryTokens.map(token => (
                        <tr key={token._id}>
                            <td data-label="API Key Name">
                              <div className="table-item-with-icon">
                                <div className="item-icon">
                                  <FiKey />
                                </div>
                                {token.apiKeyName}
                              </div>
                            </td>
                            <td data-label="Tokens Remaining">{token.tokensRemaining}</td>
                            <td data-label="Purchased Date">{new Date(token.purchasedAt).toLocaleDateString()}</td>
                            <td data-label="Status">
                              <span className="status-badge active">Active</span>
                            </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              </motion.div>
            )}

            {/* History Sections - Fixed row structure */}
            <div className="row" style={{ width: '100%' }}>
              <div className="col-md-6">
                <motion.div 
                  className="dashboard-card"
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8, type: "spring" }}
                  style={{ height: '100%' }}
                >
                  <div className="card-header">
                    <h4><FiShoppingCart /> Purchase History</h4>
                  </div>
                  <div className="card-body">
                    {transactionsLoading ? (
                      <div className="text-center p-4">
                        <div className="market-loading-spinner">
                          <div className="spinner-ring"></div>
                          <div className="spinner-ring"></div>
                          <div className="spinner-ring"></div>
                        </div>
                        <div className="loader-text">Loading transactions...</div>
                      </div>
                    ) : (
                      renderTransactionsTable(purchaseTransactions, 'purchase')
                    )}
                  </div>
                </motion.div>
              </div>
              <div className="col-md-6">
                <motion.div 
                  className="dashboard-card"
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.9, type: "spring" }}
                  style={{ height: '100%' }}
                >
                  <div className="card-header">
                    <h4><BsGraphUp /> Sales History</h4>
                  </div>
                  <div className="card-body">
                    {transactionsLoading ? (
                      <div className="text-center p-4">
                        <div className="market-loading-spinner">
                          <div className="spinner-ring"></div>
                          <div className="spinner-ring"></div>
                          <div className="spinner-ring"></div>
                        </div>
                        <div className="loader-text">Loading transactions...</div>
                      </div>
                    ) : (
                      renderTransactionsTable(salesTransactions, 'sales')
                    )}
                  </div>
                </motion.div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'apikeys' && (
          <div className="dashboard-card">
            <div className="card-header">
              <h4>Your API Keys</h4>
              <motion.button 
                className="btn-primary" 
                onClick={() => setShowAddModal(true)}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiKey /> Add New API Key
              </motion.button>
            </div>
            <div className="card-body">
              <ApiKeyList apiKeys={apiKeys} onDelete={deleteApiKey} />
            </div>
          </div>
        )}

        {activeTab === 'marketplace' && (
          <Market onPurchaseComplete={refreshTransactions} />
        )}

        {activeTab === 'purchases' && (
          <div className="dashboard-card">
            <div className="card-header">
              <h4><FiShoppingCart /> Purchase History</h4>
            </div>
            <div className="card-body">
              {transactionsLoading ? (
                <div className="text-center p-4">
                  <div className="market-loading-spinner">
                    <div className="spinner-ring"></div>
                    <div className="spinner-ring"></div>
                    <div className="spinner-ring"></div>
                  </div>
                  <div className="loader-text">Loading transactions...</div>
                </div>
              ) : (
                renderTransactionsTable(purchaseTransactions, 'purchase')
              )}
            </div>
          </div>
        )}

        {activeTab === 'sales' && (
          <div className="dashboard-card">
            <div className="card-header">
              <h4><BsGraphUp /> Sales History</h4>
            </div>
            <div className="card-body">
              {transactionsLoading ? (
                <div className="text-center p-4">
                  <div className="market-loading-spinner">
                    <div className="spinner-ring"></div>
                    <div className="spinner-ring"></div>
                    <div className="spinner-ring"></div>
                  </div>
                  <div className="loader-text">Loading transactions...</div>
                </div>
              ) : (
                renderTransactionsTable(salesTransactions, 'sales')
              )}
            </div>
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="dashboard-card chat-card">
            <div className="card-header">
              <h4><FiMessageSquare /> Chat Support</h4>
            </div>
            <div className="card-body chat-card-body">
              <ChatInterface />
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <Settings />
        )}
        {activeTab === 'payment' && (
          <PaymentGateway/>
        )}

        {/* Add API Key Modal */}
        <AnimatePresence>
      {showAddModal && (
            <motion.div 
              className="modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div 
                className="modal-content"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
        <AddApiKeyModal 
          onAdd={addApiKey} 
          onClose={() => setShowAddModal(false)} 
        />
              </motion.div>
            </motion.div>
      )}
        </AnimatePresence>

        {/* Help button */}
        <button 
          className="help-button" 
          onClick={startTour}
          title="Start Tour"
        >
          <FiHelpCircle />
          <span>Help</span>
        </button>

        {/* Tour Guide Modal */}
        {showTour && (
          <div 
            className="tour-modal"
            ref={tourModalRef}
            style={{
              position: 'fixed',
              left: tourPosition.left,
              top: tourPosition.top,
              zIndex: 9999,
              width: '360px',
              backgroundColor: '#1a1f36',
              borderRadius: '12px',
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              overflow: 'hidden',
              transition: 'left 0.4s ease, top 0.4s ease'
            }}
          >
            <div 
              className="tour-header"
              onMouseDown={handleMouseDown}
              style={{ 
                cursor: 'move',
                padding: '14px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                backgroundColor: 'rgba(255, 255, 255, 0.03)'
              }}
            >
              <div className="tour-drag-handle">
                <FiMoreHorizontal style={{ opacity: 0.7 }} />
              </div>
              <h3 style={{ 
                margin: 0, 
                fontSize: '18px', 
                fontWeight: '600',
                color: 'white'
              }}>
                {tourSteps[tourStep - 1].title}
              </h3>
              <button 
                className="tour-close-button"
                onClick={endTour}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '20px',
                  padding: '0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <FiX />
              </button>
            </div>
            
            <div className="tour-body" style={{ padding: '20px', color: 'rgba(255, 255, 255, 0.8)' }}>
              <p style={{ margin: 0, lineHeight: '1.6' }}>
                {tourSteps[tourStep - 1].description}
              </p>
            </div>
            
            <div className="tour-footer" style={{ 
              padding: '15px 20px', 
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div className="tour-progress" style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '14px' }}>
                Step {tourStep} of {tourSteps.length}
              </div>
              <div className="tour-actions" style={{ display: 'flex', gap: '10px' }}>
                {tourStep > 1 && (
                  <button 
                    className="tour-button prev"
                    onClick={prevStep}
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '8px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}
                  >
                    <FiArrowLeft /> Previous
                  </button>
                )}
                {tourStep < tourSteps.length ? (
                  <button 
                    className="tour-button next"
                    onClick={nextStep}
                    style={{
                      backgroundColor: '#5e60ce',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '8px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}
                  >
                    Next <FiArrowRight />
                  </button>
                ) : (
                  <button 
                    className="tour-button finish"
                    onClick={endTour}
                    style={{
                      backgroundColor: '#5e60ce',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '8px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}
                  >
                    Finish <FiCheckCircle />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

// Helper function to get color based on security value
const getSecurityColor = (value) => {
  if (value >= 75) return 'var(--success-color, #48bb78)';
  if (value >= 50) return 'var(--warning-color, #f6ad55)';
  return 'var(--danger-color, #f56565)';
};

export default Dashboard;