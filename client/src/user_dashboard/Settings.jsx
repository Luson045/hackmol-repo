import React, { useState, useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { 
  FiUser, FiBell, FiShield, FiMoon, FiLogOut, FiHelpCircle, 
  FiChevronRight, FiSave, FiUpload, FiKey, FiCreditCard,
  FiLock, FiDatabase, FiSmartphone, FiMail, FiGlobe, FiAlertTriangle,
  FiSettings
} from 'react-icons/fi';

const Settings = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    bio: '',
    avatar: ''
  });
  const [loading, setLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    newsletter: false
  });

  useEffect(() => {
    // Populate profile data with user information
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || 'Token marketplace developer',
        avatar: user.avatar || ''
      });
    }
  }, [user]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
    // In a real app, you would save to backend here
      // const res = await axios.put('/api/users/profile', profileData);
      toast.success('Profile updated successfully!');
    } catch (err) {
      console.error('Error updating profile:', err);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const tabAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
  };

  const iconContainerVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.3 } }
  };

  const buttonVariants = {
    hover: { scale: 1.05, y: -2, transition: { duration: 0.2 } },
    tap: { scale: 0.95, transition: { duration: 0.1 } }
  };

  const settingsMenuItems = [
    { id: 'profile', icon: <FiUser />, label: 'Profile' },
    { id: 'notifications', icon: <FiBell />, label: 'Notifications' },
    { id: 'appearance', icon: <FiMoon />, label: 'Appearance' },
    { id: 'privacy', icon: <FiShield />, label: 'Privacy & Security' },
    { id: 'billing', icon: <FiCreditCard />, label: 'Billing & Payments' },
    { id: 'help', icon: <FiHelpCircle />, label: 'Help & Support' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <motion.div 
            variants={tabAnimation}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <div className="profile-header">
              <motion.div
                className="avatar-container"
                variants={iconContainerVariants}
                initial="hidden"
                animate="visible"
              >
                <div className="user-avatar" style={{ width: '100px', height: '100px', margin: '0 auto' }}>
                  {profileData.avatar ? (
                    <img src={profileData.avatar} alt="Profile" className="rounded-full w-full h-full" />
                  ) : (
                    <div className="avatar-placeholder">
                      <FiUser size={40} />
                    </div>
                  )}
                </div>
                <motion.button 
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  className="upload-avatar-btn"
                >
                  <FiUpload size={16} className="mr-2" />
                  Upload Photo
                </motion.button>
              </motion.div>
            </div>
            
            <div className="settings-card">
              <div className="settings-card-header">
                <h4><FiUser className="icon-gradient" /> Personal Information</h4>
              </div>
              <div className="settings-card-body">
                <div className="form-group">
                <label htmlFor="name" className="block text-sm font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={profileData.name}
                  onChange={handleProfileChange}
                    className="form-control"
                    placeholder="Your full name"
                />
              </div>
              
                <div className="form-group">
                <label htmlFor="email" className="block text-sm font-medium mb-1">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                    className="form-control"
                    placeholder="Your email address"
                />
              </div>
              
                <div className="form-group">
                <label htmlFor="bio" className="block text-sm font-medium mb-1">Bio</label>
                <textarea
                  id="bio"
                  name="bio"
                  value={profileData.bio}
                  onChange={handleProfileChange}
                  rows="4"
                    className="form-control"
                    placeholder="Tell us about yourself"
                />
              </div>
              
                <motion.button 
                onClick={handleSaveProfile}
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  className="btn-gradient"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="loading-indicator">
                      <div className="market-loading-spinner" style={{ transform: 'scale(0.6)' }}>
                        <div className="spinner-ring"></div>
                        <div className="spinner-ring"></div>
                        <div className="spinner-ring"></div>
                      </div>
                      <span>Saving...</span>
                    </div>
                  ) : (
                    <>
                      <FiSave size={16} className="mr-2" />
                Save Changes
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        );
      
      case 'notifications':
        return (
          <motion.div 
            variants={tabAnimation}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <div className="settings-card">
              <div className="settings-card-header">
                <h4><FiMail className="icon-gradient" /> Email Preferences</h4>
              </div>
              <div className="settings-card-body">
                <div className="setting-item">
                <div>
                  <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-muted">Receive important updates via email</p>
                </div>
                  <label className="switch">
                  <input
                    type="checkbox"
                    checked={notifications.email}
                    onChange={() => setNotifications(prev => ({...prev, email: !prev.email}))}
                  />
                    <span className="slider round"></span>
                </label>
              </div>
              
                <div className="setting-item">
                <div>
                    <p className="font-medium">Newsletter</p>
                    <p className="text-sm text-muted">Receive our weekly newsletter with tips and updates</p>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={notifications.newsletter}
                      onChange={() => setNotifications(prev => ({...prev, newsletter: !prev.newsletter}))}
                    />
                    <span className="slider round"></span>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="settings-card">
              <div className="settings-card-header">
                <h4><FiSmartphone className="icon-gradient" /> Push Notifications</h4>
              </div>
              <div className="settings-card-body">
                <div className="setting-item">
                  <div>
                    <p className="font-medium">Browser Notifications</p>
                    <p className="text-sm text-muted">Get notified about important events in your browser</p>
                  </div>
                  <label className="switch">
                  <input
                    type="checkbox"
                    checked={notifications.push}
                    onChange={() => setNotifications(prev => ({...prev, push: !prev.push}))}
                  />
                    <span className="slider round"></span>
                </label>
              </div>
              
                <div className="setting-item">
                <div>
                    <p className="font-medium">Transaction Alerts</p>
                    <p className="text-sm text-muted">Get notified about your token transactions</p>
                </div>
                  <label className="switch">
                  <input
                    type="checkbox"
                      checked={true}
                      readOnly
                  />
                    <span className="slider round"></span>
                </label>
                </div>
              </div>
            </div>
            
            <motion.button 
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              className="btn-gradient"
            >
              <FiSave size={16} className="mr-2" />
              Save Preferences
            </motion.button>
          </motion.div>
        );
      
      case 'appearance':
        return (
          <motion.div 
            variants={tabAnimation}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <div className="settings-card">
              <div className="settings-card-header">
                <h4><FiMoon className="icon-gradient" /> Theme Settings</h4>
              </div>
              <div className="settings-card-body">
                <div className="setting-item">
                <div>
                  <p className="font-medium">Dark Mode</p>
                    <p className="text-sm text-muted">Switch between light and dark theme</p>
                </div>
                  <label className="switch">
                  <input
                    type="checkbox"
                    checked={isDarkMode}
                    onChange={() => setIsDarkMode(prev => !prev)}
                  />
                    <span className="slider round"></span>
                </label>
                </div>
              </div>
              </div>
              
            <div className="settings-card">
              <div className="settings-card-header">
                <h4><FiGlobe className="icon-gradient" /> Accessibility</h4>
              </div>
              <div className="settings-card-body">
                <div className="setting-item column">
              <div>
                    <p className="font-medium mb-3">Font Size</p>
                    <div className="slider-control">
                  <span className="text-sm">A</span>
                      <input 
                        type="range" 
                        min="1" 
                        max="3" 
                        className="custom-range" 
                      />
                  <span className="text-lg">A</span>
                    </div>
                  </div>
                </div>

                <div className="setting-item column">
                  <div>
                    <p className="font-medium mb-3">Animation Speed</p>
                    <div className="slider-control">
                      <span className="text-sm">Slow</span>
                      <input 
                        type="range" 
                        min="1" 
                        max="3" 
                        className="custom-range" 
                      />
                      <span className="text-sm">Fast</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <motion.button 
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              className="btn-gradient"
            >
              <FiSave size={16} className="mr-2" />
              Save Preferences
            </motion.button>
          </motion.div>
        );
      
      case 'privacy':
        return (
          <motion.div 
            variants={tabAnimation}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <div className="settings-card">
              <div className="settings-card-header">
                <h4><FiLock className="icon-gradient" /> Security Settings</h4>
              </div>
              <div className="settings-card-body">
                <motion.div 
                  className="setting-action-item"
                  variants={buttonVariants}
                  whileHover="hover"
                >
                  <div className="setting-action-icon">
                    <FiKey />
                  </div>
                  <div className="setting-action-content">
                    <h5>Change Password</h5>
                    <p>Update your password regularly to keep your account secure</p>
                  </div>
                  <FiChevronRight />
                </motion.div>
                
                <motion.div 
                  className="setting-action-item"
                  variants={buttonVariants}
                  whileHover="hover"
                >
                  <div className="setting-action-icon">
                    <FiSmartphone />
                  </div>
                  <div className="setting-action-content">
                    <h5>Two-Factor Authentication</h5>
                    <p>Add an extra layer of security to your account</p>
                  </div>
                  <FiChevronRight />
                </motion.div>
              </div>
            </div>
            
            <div className="settings-card">
              <div className="settings-card-header">
                <h4><FiDatabase className="icon-gradient" /> Data & Privacy</h4>
              </div>
              <div className="settings-card-body">
                <motion.div 
                  className="setting-action-item"
                  variants={buttonVariants}
                  whileHover="hover"
                >
                  <div className="setting-action-icon">
                    <FiKey />
                  </div>
                  <div className="setting-action-content">
                    <h5>API Key Management</h5>
                    <p>Control API access and permissions</p>
                  </div>
                  <FiChevronRight />
                </motion.div>
                
                <motion.div 
                  className="setting-action-item"
                  variants={buttonVariants}
                  whileHover="hover"
                >
                  <div className="setting-action-icon">
                    <FiShield />
                  </div>
                  <div className="setting-action-content">
                    <h5>Data Management</h5>
                    <p>Manage your personal data and privacy settings</p>
                  </div>
                  <FiChevronRight />
                </motion.div>
                
                <motion.div 
                  className="setting-action-item danger"
                  variants={buttonVariants}
                  whileHover="hover"
                >
                  <div className="setting-action-icon danger">
                    <FiAlertTriangle />
                  </div>
                  <div className="setting-action-content">
                    <h5>Delete Account</h5>
                    <p>Permanently delete your account and all associated data</p>
                  </div>
                  <FiChevronRight />
                </motion.div>
              </div>
            </div>
          </motion.div>
        );
      
      case 'billing':
        return (
          <motion.div 
            variants={tabAnimation}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <div className="settings-card">
              <div className="settings-card-header">
                <h4><FiCreditCard className="icon-gradient" /> Payment Methods</h4>
              </div>
              <div className="settings-card-body">
                <motion.div 
                  className="payment-method-item"
                  variants={buttonVariants}
                  whileHover="hover"
                >
                  <div className="payment-method-logo">
                    <div className="credit-card-icon">
                      <FiCreditCard size={24} />
                    </div>
                  </div>
                  <div className="payment-method-content">
                    <h5>•••• •••• •••• 4242</h5>
                    <p>Visa - Expires 12/24</p>
                  </div>
                  <div className="payment-method-actions">
                    <span className="badge primary">Default</span>
                    <FiChevronRight />
                  </div>
                </motion.div>
                
                <motion.button 
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  className="btn-outline"
                >
                  <FiCreditCard size={16} className="mr-2" />
                  Add Payment Method
                </motion.button>
              </div>
              </div>
              
            <div className="settings-card">
              <div className="settings-card-header">
                <h4><FiDatabase className="icon-gradient" /> Billing History</h4>
              </div>
              <div className="settings-card-body">
                <div className="billing-history-table">
                  <div className="billing-history-header">
                    <div>Date</div>
                    <div>Description</div>
                    <div>Amount</div>
                    <div>Status</div>
                  </div>
                  <div className="billing-history-row">
                    <div>Apr 15, 2023</div>
                    <div>Token Purchase</div>
                    <div>$24.99</div>
                    <div><span className="badge success">Paid</span></div>
                  </div>
                  <div className="billing-history-row">
                    <div>Mar 15, 2023</div>
                    <div>Monthly Subscription</div>
                    <div>$9.99</div>
                    <div><span className="badge success">Paid</span></div>
                  </div>
                </div>
                
                <motion.button 
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  className="btn-outline mt-4"
                >
                  View All Transactions
                </motion.button>
              </div>
            </div>
          </motion.div>
        );
      
      case 'help':
        return (
          <motion.div 
            variants={tabAnimation}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <div className="settings-card">
              <div className="settings-card-header">
                <h4><FiHelpCircle className="icon-gradient" /> Help Resources</h4>
              </div>
              <div className="settings-card-body">
                <motion.div 
                  className="help-resource-item"
                  variants={buttonVariants}
                  whileHover="hover"
                >
                  <div className="help-resource-icon">
                    <FiGlobe />
                  </div>
                  <div className="help-resource-content">
                    <h5>Documentation</h5>
                    <p>Browse our guides and tutorials</p>
                  </div>
                  <FiChevronRight />
                </motion.div>
                
                <motion.div 
                  className="help-resource-item"
                  variants={buttonVariants}
                  whileHover="hover"
                >
                  <div className="help-resource-icon">
                    <FiMail />
                  </div>
                  <div className="help-resource-content">
                    <h5>Contact Support</h5>
                    <p>Get help from our team</p>
              </div>
                  <FiChevronRight />
                </motion.div>
                
                <motion.div 
                  className="help-resource-item"
                  variants={buttonVariants}
                  whileHover="hover"
                >
                  <div className="help-resource-icon">
                    <FiHelpCircle />
                  </div>
                  <div className="help-resource-content">
                    <h5>FAQs</h5>
                    <p>Frequently asked questions</p>
                  </div>
                  <FiChevronRight />
                </motion.div>
              </div>
              </div>
              
            <div className="settings-card">
              <div className="settings-card-header">
                <h4><FiAlertTriangle className="icon-gradient" /> System Information</h4>
              </div>
              <div className="settings-card-body">
                <div className="system-info-grid">
                  <div className="system-info-item">
                    <div className="system-info-label">App Version</div>
                    <div className="system-info-value">2.1.0</div>
                  </div>
                  <div className="system-info-item">
                    <div className="system-info-label">Device</div>
                    <div className="system-info-value">Web Browser</div>
                  </div>
                  <div className="system-info-item">
                    <div className="system-info-label">Last Updated</div>
                    <div className="system-info-value">April 15, 2023</div>
                  </div>
                  <div className="system-info-item">
                    <div className="system-info-label">Status</div>
                    <div className="system-info-value"><span className="badge success">Online</span></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="settings-container">
      <div className="row">
        <div className="col-md-4">
          <motion.div 
            className="dashboard-card"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="card-header settings-sidebar-header">
              <h4><FiSettings className="icon-gradient mr-2" /> Settings</h4>
            </div>
            <div className="card-body">
              <div className="settings-menu">
                {settingsMenuItems.map(item => (
                  <motion.div 
                    key={item.id}
                    className={`settings-menu-item ${activeTab === item.id ? 'active' : ''}`}
                    onClick={() => handleTabClick(item.id)}
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="settings-menu-icon">
                      {item.icon}
                    </div>
                    <span>{item.label}</span>
                    {activeTab === item.id && (
                      <motion.div 
                        className="active-indicator"
                        layoutId="activeIndicator"
                      />
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
        <div className="col-md-8">
          <motion.div 
            className="dashboard-card"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            style={{ height: '100%' }}
          >
            <div className="card-header">
              <h4>
                {activeTab === 'profile' && <><FiUser className="icon-gradient mr-2" /> Profile Settings</>}
                {activeTab === 'notifications' && <><FiBell className="icon-gradient mr-2" /> Notification Settings</>}
                {activeTab === 'appearance' && <><FiMoon className="icon-gradient mr-2" /> Appearance Settings</>}
                {activeTab === 'privacy' && <><FiShield className="icon-gradient mr-2" /> Privacy & Security</>}
                {activeTab === 'billing' && <><FiCreditCard className="icon-gradient mr-2" /> Billing & Payments</>}
                {activeTab === 'help' && <><FiHelpCircle className="icon-gradient mr-2" /> Help & Support</>}
              </h4>
            </div>
            <div className="card-body">
              {renderTabContent()}
          </div>
          </motion.div>
      </div>
      </div>
    </div>
  );
};

export default Settings;