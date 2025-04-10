import React, { useContext, useEffect, useState, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import SuccessStories from '../components/Success';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { FaRobot, FaSmile, FaStar, FaBrain, FaPen, FaMagic } from 'react-icons/fa';
const phrases = [
  "Trade Unused Tokens Seamlessly",
  "Access Premium Content for Less",
  "Join the Token Flow Ecosystem",
  "Smart Trading, Better Savings"
];


const Home = () => {
  const {user, isAuthenticated } = useContext(AuthContext);
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  // const [currentAnimalIndex, setCurrentAnimalIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();
  const featuresRef = useRef(null);
  const statsRef = useRef(null);
  const tokensRef = useRef(null);
  
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.2]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9]);
  if (isAuthenticated) {
    const user_role=user.role;
    switch (user_role) {
      case "user":
        return navigate("dashboard");
        break;
      case "admin":
        return navigate("admin");
        break;
      default:
        break;
    }
  }
  // Initialize animation state
  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 300);
  }, []);

  useEffect(() => {
    const phraseInterval = setInterval(() => {
      setCurrentPhraseIndex((prevIndex) => (prevIndex + 1) % phrases.length);
    }, 4000);
    
    // const animalInterval = setInterval(() => {
      // setCurrentAnimalIndex((prevIndex) => (prevIndex + 1) % animals.length);
    // }, 6000);
    
    return () => {
      clearInterval(phraseInterval);
      // clearInterval(animalInterval);
    };
  }, []);

  // Enhanced animations
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const floatAnimation = {
    initial: { y: 0, rotate: 0 },
    animate: {
      y: [0, -10, 0],
      rotate: [0, 2, 0, -2, 0],
      transition: {
        duration: 5,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 100, 
        damping: 12 
      }
    }
  };

  const buttonHoverEffects = {
    hover: { 
      scale: 1.05, 
      boxShadow: "0px 10px 20px rgba(79, 70, 229, 0.2)",
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 10 
      }
    }
  };

  const textReveal = {
    hidden: { opacity: 0, y: 20 },
    visible: index => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.1 * index,
        duration: 0.5
      }
    })
  };

  // 3D tilt effect for cards
  const [tiltValues, setTiltValues] = useState({ x: 0, y: 0 });
  
  const handleTiltMove = (e, intensity = 10) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const tiltX = ((y - centerY) / centerY) * intensity;
    const tiltY = ((centerX - x) / centerX) * intensity;
    
    setTiltValues({ x: tiltX, y: tiltY });
  };
  
  const resetTilt = () => {
    setTiltValues({ x: 0, y: 0 });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-50 dark:from-gray-900 dark:to-indigo-900 overflow-x-hidden">
      {/* Dynamic Particles Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
  {[...Array(15)].map((_, i) => (
    <motion.div
      key={i}
      className="absolute rounded-full bg-gradient-to-r from-blue-300 via-indigo-400 to-purple-500 dark:from-blue-600 dark:via-indigo-700 dark:to-purple-800 opacity-10"
      style={{
        width: `${Math.random() * 400 + 100}px`,
        height: `${Math.random() * 400 + 100}px`,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        filter: "blur(50px)",
        transformOrigin: "center"
      }}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{
        x: [0, Math.random() * 300 - 150],
        y: [0, Math.random() * 300 - 150],
        scale: [0.8, Math.random() * 0.5 + 0.8, 0.8],
        opacity: [0.05, 0.15, 0.05],
        rotate: [0, Math.random() * 20 - 10]
      }}
      transition={{
        duration: Math.random() * 40 + 30,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
        delay: Math.random() * 5
      }}
    />
  ))}
</div>

      {/* Hero Section with Parallax Effect */}
      <motion.section 
  className="relative pt-24 md:pt-40 pb-20 md:pb-32 px-4 overflow-hidden"
  style={{ opacity, scale }}
>
  {/* Subtle background blur effect */}
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(5)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full bg-gradient-to-r from-gray-200 to-gray-100 dark:from-gray-800 dark:to-gray-900 opacity-20"
        style={{
          width: `${Math.random() * 600 + 200}px`,
          height: `${Math.random() * 600 + 200}px`,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          filter: "blur(80px)",
        }}
        animate={{
          x: [0, Math.random() * 100 - 50],
          y: [0, Math.random() * 100 - 50],
          scale: [1, Math.random() * 0.2 + 0.9],
        }}
        transition={{
          duration: Math.random() * 20 + 15,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }}
      />
    ))}
  </div>

  <motion.div 
    className="max-w-5xl mx-auto text-center relative z-10"
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7, ease: "easeOut" }}
  >
   <motion.div
  className="mb-8"
  initial={{ opacity: 0, y: 20 }}
  animate={{ 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.1, 0.25, 1.0] // Custom cubic bezier for a professional easing
    }
  }}
  whileHover={{ 
    scale: 1.02,
    transition: { duration: 0.3 }
  }}
  whileInView={{
    opacity: [0.9, 1],
    boxShadow: [
      "0px 0px 0px rgba(0,0,0,0.1)",
      "0px 4px 12px rgba(0,0,0,0.1)"
    ],
    transition: {
      duration: 1.2,
      ease: "easeOut"
    }
  }}
>
  {/* Your content here */}

      <div className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-6 relative">
        {/* Subtle glow effect */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-purple-500 dark:from-indigo-500 dark:to-purple-600 rounded-full filter blur-xl"
          animate={{ 
            opacity: [0.2, 0.4, 0.2],
            scale: [0.85, 1.05, 0.85]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        />
      <svg viewBox="0 0 200 200">
  {/* <!-- Outer circle - clean professional look --> */}
  <circle cx="100" cy="100" r="80" fill="none" stroke="#3B82F6" stroke-width="4" />
  
  {/* <!-- Brain/connection nodes representing AI --> */}
  <g stroke="#3B82F6" stroke-width="3" fill="none">
    {/* <!-- Central node --> */}
    <circle cx="100" cy="100" r="15" />
    
    {/* <!-- Surrounding nodes --> */}
    <circle cx="65" cy="75" r="8" />
    <circle cx="135" cy="75" r="8" />
    <circle cx="65" cy="125" r="8" />
    <circle cx="135" cy="125" r="8" />
    <circle cx="100" cy="50" r="8" />
    <circle cx="100" cy="150" r="8" />
    
    {/* <!-- Connection lines --> */}
    <line x1="100" y1="85" x2="100" y2="50" />
    <line x1="100" y1="115" x2="100" y2="150" />
    <line x1="85" y1="100" x2="65" y2="75" />
    <line x1="115" y1="100" x2="135" y2="75" />
    <line x1="85" y1="100" x2="65" y2="125" />
    <line x1="115" y1="100" x2="135" y2="125" />
    
    {/* <!-- Additional connections --> */}
    <line x1="65" y1="75" x2="100" y2="50" />
    <line x1="135" y1="75" x2="100" y2="50" />
    <line x1="65" y1="125" x2="100" y2="150" />
    <line x1="135" y1="125" x2="100" y2="150" />
    
    {/* <!-- Pulse animation circle --> */}
    <circle cx="100" cy="100" r="30" opacity="0.3">
      <animate attributeName="r" values="30;50;30" dur="3s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="0.3;0.1;0.3" dur="3s" repeatCount="indefinite" />
    </circle>
  </g>
</svg>
      </div>
     
    </motion.div>

    {/* Text transition effects */}
    <div className="pb-10 flex items-center justify-center overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.h1 
          key={phrases[currentPhraseIndex]}
          className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white tracking-tight"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -30, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {phrases[currentPhraseIndex]}
        </motion.h1>
      </AnimatePresence>
    </div>

    <motion.p 
      className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto font-light leading-relaxed"
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      transition={{ delay: 0.2, duration: 0.7 }}
    >
      Buy and sell unused tokens at minimal cost. Get access to premium content 
      without breaking the bank. Our marketplace connects token holders with 
      content seekers for a win-win exchange.
    </motion.p>
    
    <motion.div 
      className="flex flex-col sm:flex-row justify-center gap-5"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <motion.button 
        variants={fadeInUp}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => navigate('/marketplace')} 
        className="px-8 py-4 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-xl transition-all duration-200 text-lg shadow-md"
        custom={buttonHoverEffects}
      >
        <motion.span className="flex items-center justify-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
          </svg>
          Browse Marketplace
        </motion.span>
      </motion.button>
      <motion.button 
        variants={fadeInUp}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => navigate('/login')} 
        className="px-8 py-4 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 font-medium rounded-xl transition-all duration-200 text-lg shadow-md"
        custom={buttonHoverEffects}
      >
        <motion.span className="flex items-center justify-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
          </svg>
          Join Us Now
        </motion.span>
      </motion.button>
    </motion.div>
    
  
    
  </motion.div>
</motion.section>
      {/* Features Section with Scroll Animation */}
      <motion.section 
        className="py-16 px-4"
        ref={featuresRef}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7 }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            How Token Flow Works
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
                title: "Sell Unused Tokens",
                description: "Got extra tokens? List them on our marketplace and convert them into cash instead of letting them expire."
              },
              {
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />,
                title: "Buy at Discount",
                description: "Purchase tokens at reduced prices and unlock premium content across multiple platforms for less."
              },
              {
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />,
                title: "Secure Transactions",
                description: "Our platform ensures all exchanges are secure, transparent, and hassle-free for both buyers and sellers."
              }
            ].map((feature, index) => (
              <motion.div 
                key={index}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-500"
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                custom={index}
                whileHover={{ 
                  y: -10,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                  transition: { type: "spring", stiffness: 300, damping: 15 }
                }}
                onMouseMove={handleTiltMove}
                onMouseLeave={resetTilt}
                style={{
                  perspective: "1000px",
                  transformStyle: "preserve-3d",
                  transform: `rotateX(${tiltValues.x}deg) rotateY(${tiltValues.y}deg)`
                }}
              >
                <motion.div 
                  className="h-12 w-12 mb-4 text-indigo-600 dark:text-indigo-400 relative"
                  whileHover={{ rotate: 5 }}
                >
                  <motion.div 
                    className="absolute inset-0 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg opacity-50"
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 0.7, 0.5] 
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="relative z-10">
                    {feature.icon}
                  </svg>
                </motion.div>
                <motion.h3 
                  className="text-xl font-bold mb-2 text-gray-900 dark:text-white"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.2 * index, duration: 0.5 }}
                >
                  {feature.title}
                </motion.h3>
                <motion.p 
                  className="text-gray-600 dark:text-gray-300"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.3 * index, duration: 0.5 }}
                >
                  {feature.description}
                </motion.p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Stats Section with Counter Animation */}
      <motion.section
  className="py-20 bg-gradient-to-b from-slate-50 to-white dark:from-gray-900 dark:to-gray-800 px-6"
  ref={statsRef}
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  viewport={{ once: true }}
  transition={{ duration: 0.8 }}
>
  <div className="max-w-6xl mx-auto">
    {/* Section Header */}
    <motion.div 
      className="text-center mb-16"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
        Measurable Business Outcomes
      </h2>
      <div className="w-20 h-px bg-gradient-to-r from-blue-500 to-blue-600 mx-auto mb-6"></div>
      <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg">
        Our enterprise AI platform delivers quantifiable performance improvements
      </p>
    </motion.div>

    {/* Stats Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {[
        {
          value: "50K+",
          label: "Active Users",
          description: "Enterprise professionals utilizing our platform",
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          )
        },
        {
          value: "100+",
          label: "Integrations",
          description: "Enterprise software compatibility",
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="2" y1="12" x2="22" y2="12"></line>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            </svg>
          )
        },
        {
          value: "30%",
          label: "Efficiency Gain",
          description: "Measured productivity improvement",
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
              <line x1="12" y1="20" x2="12" y2="10"></line>
              <line x1="18" y1="20" x2="18" y2="4"></line>
              <line x1="6" y1="20" x2="6" y2="16"></line>
            </svg>
          )
        },
        {
          value: "$2M+",
          label: "Client Savings",
          description: "Monthly operational cost reduction",
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
              <rect x="2" y="7" width="20" height="14" rx="2"></rect>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
            </svg>
          )
        }
      ].map((stat, index) => (
        <motion.div
          key={index}
          className="relative h-full"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ 
            delay: index * 0.1, 
            duration: 0.7, 
            ease: [0.25, 0.1, 0.25, 1]
          }}
        >
          <motion.div
            className="relative bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 h-full overflow-hidden"
            whileHover={{ 
              y: -8,
              boxShadow: "0 15px 30px -5px rgba(0, 0, 0, 0.1), 0 10px 15px -5px rgba(0, 0, 0, 0.05)",
              transition: { 
                type: "spring", 
                stiffness: 300, 
                damping: 20 
              }
            }}
          >
            <div className="p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center p-2.5 text-blue-600 dark:text-blue-400 transition-all duration-300 group-hover:bg-blue-500 group-hover:text-white">
                  {stat.icon}
                </div>
                <h3 className="text-base font-medium text-gray-900 dark:text-gray-100">{stat.label}</h3>
              </div>
              
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + index * 0.1, duration: 0.4 }}
              >
                <motion.span 
                  className="block text-4xl font-bold text-gray-900 dark:text-white"
                  initial={{ scale: 0.95, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ 
                    delay: 0.3 + index * 0.1, 
                    duration: 0.5,
                    type: "spring",
                    stiffness: 100
                  }}
                  whileHover={{
                    scale: 1.05,
                    color: "#3b82f6", // blue-500
                    transition: { duration: 0.2 }
                  }}
                >
                  {stat.value}
                </motion.span>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {stat.description}
                </p>
              </motion.div>
            </div>
            
            {/* Progress bar that animates on hover */}
            <div className="h-1 w-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-blue-400 to-blue-600 w-0"
                whileHover={{ width: "100%" }}
                transition={{ duration: 0.4 }}
              />
            </div>
            
            {/* Decorative accent */}
            <motion.div 
              className="absolute top-0 right-0 w-16 h-16"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 + index * 0.1, duration: 0.6 }}
            >
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue-500/10 dark:text-blue-400/10">
                <path d="M0 0L64 64V0H0Z" fill="currentColor"/>
              </svg>
            </motion.div>
          </motion.div>
        </motion.div>
      ))}
    </div>
    
    {/* Subtle background accents */}
    <div className="relative w-full h-16 mt-12">
      <motion.div 
        className="absolute hidden lg:block -left-12 -top-32 w-64 h-64 rounded-full bg-blue-400/5 dark:bg-blue-500/5"
        animate={{ 
          y: [0, -20, 0],
          scale: [1, 1.05, 1]
        }}
        transition={{ 
          repeat: Infinity,
          duration: 15,
          ease: "easeInOut" 
        }}
      />
      <motion.div 
        className="absolute hidden lg:block right-0 top-0 w-32 h-32 rounded-full bg-blue-400/5 dark:bg-blue-500/5"
        animate={{ 
          y: [0, 15, 0],
          x: [0, 10, 0],
          scale: [1, 1.03, 1]
        }}
        transition={{ 
          repeat: Infinity,
          duration: 20,
          ease: "easeInOut" 
        }}
      />
    </div>
  </div>
</motion.section>
      {/* Featured Tokens with Staggered Animation */}
      <motion.section 
        className="py-16 px-4"
        ref={tokensRef}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7 }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Featured Tokens
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
  { 
    platform: "ChatGPT", 
    discount: "25% off", 
    icon: <FaRobot />, 
    color: "from-green-400 to-green-600" 
  },
  { 
    platform: "Claude", 
    discount: "30% off", 
    icon: <FaSmile />, 
    color: "from-purple-400 to-purple-600" 
  },
  { 
    platform: "Gemini", 
    discount: "40% off", 
    icon: <FaStar />, 
    color: "from-blue-400 to-blue-600" 
  },
  { 
    platform: "Anthropic", 
    discount: "20% off", 
    icon: <FaBrain />, 
    color: "from-red-400 to-red-600" 
  },
  { 
    platform: "Bard", 
    discount: "35% off", 
    icon: <FaPen />, 
    color: "from-yellow-400 to-yellow-600" 
  },
  { 
    platform: "Llama", 
    discount: "15% off", 
    icon: <FaMagic />, 
    color: "from-indigo-400 to-indigo-600" 
  }
].map((item, index) => (
              <motion.div 
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md group cursor-pointer"
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                custom={index}
                whileHover={{ 
                  y: -10,
                  transition: { 
                    type: "spring", 
                    stiffness: 300, 
                    damping: 15 
                  }
                }}
              >
                <motion.div 
                  className={`bg-gradient-to-r ${item.color} p-6 flex items-center justify-center text-5xl relative overflow-hidden h-24`}
                  whileHover={{
                    height: "6rem", // Slightly expand on hover
                  }}
                >
                  {/* Animated background effect */}
                  <motion.div 
                    className="absolute inset-0 opacity-30"
                    animate={{
                      backgroundPosition: ["0% 0%", "100% 100%"],
                    }}
                    transition={{
                      duration: 10,
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                    style={{
                      backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"100\" height=\"100\" viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cpath d=\"M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\" fill=\"%23ffffff\" fill-opacity=\"0.1\" fill-rule=\"evenodd\"/%3E%3C/svg%3E')",
                      backgroundSize: "cover",
                    }}
                  />
                  
                  {/* Icon with animation */}
                  <motion.span
                    initial={{ scale: 1 }}
                    whileHover={{ 
                      scale: 1.2,
                      rotate: [0, 5, -5, 0],
                      transition: { duration: 0.5 }
                    }}
                  >
                    {item.icon}
                  </motion.span>
                </motion.div>

                <div className="p-6">
                  <motion.h3 
                    className="text-xl font-bold text-gray-900 dark:text-white mb-3"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    {item.platform}
                  </motion.h3>
                  <div className="flex justify-between items-center">
                    <motion.span 
                      className="text-indigo-600 dark:text-indigo-400 font-semibold"
                      whileHover={{ 
                        scale: 1.05,
                        textShadow: "0px 0px 8px rgba(79, 70, 229, 0.3)" 
                      }}
                    >
                      {item.discount}
                    </motion.span>
                    <motion.button 
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm relative overflow-hidden group"
                      whileHover={{ 
                        scale: 1.05,
                        transition: { type: "spring", stiffness: 400, damping: 10 }
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {/* Button hover effect */}
                      <motion.span 
                        className="absolute inset-0 w-0 bg-white opacity-20"
                        initial={{ width: "0%" }}
                        whileHover={{ 
                          width: "100%",
                          transition: { duration: 0.3 }
                        }}
                      />
                      <span className="relative z-10 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                        </svg>
                        View Tokens
                      </span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Interactive Call-to-Action */}
      <motion.section 
        className="py-20 px-4 bg-gradient-to-r from-indigo-600 to-blue-700 dark:from-indigo-900 dark:to-blue-900 relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        {/* Animated background patterns */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white opacity-10"
              style={{
                width: `${Math.random() * 300 + 100}px`,
                height: `${Math.random() * 300 + 100}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                x: [0, Math.random() * 100 - 50],
                y: [0, Math.random() * 100 - 50],
                scale: [1, Math.random() * 0.3 + 0.8, 1],
                opacity: [0.05, 0.1, 0.05],
              }}
              transition={{
                duration: Math.random() * 20 + 10,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
            />
          ))}
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Ready to Start Trading Tokens?
          </motion.h2>
          <motion.p 
            className="text-lg md:text-xl text-indigo-100 mb-10 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Join thousands of users who are already saving money and making the most of their digital tokens.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row justify-center gap-4 items-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <motion.button 
              className="px-8 py-3 bg-white text-indigo-700 font-medium rounded-lg transition-all duration-300 text-lg relative overflow-hidden"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0px 10px 20px rgba(255, 255, 255, 0.2)",
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/login')}
            >
              <motion.span 
                className="absolute inset-0 bg-gradient-to-r from-indigo-100 to-white opacity-0"
                whileHover={{ opacity: 0.3, transition: { duration: 0.3 } }}
              />
              <span className="relative z-10 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Create Free Account
              </span>
            </motion.button>
            
            <motion.button 
              className="px-8 py-3 bg-transparent border-2 border-white text-white font-medium rounded-lg transition-all duration-300 text-lg relative overflow-hidden"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)",
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/how-it-works')}
            >
              <motion.span 
                className="absolute inset-0 bg-white opacity-0"
                whileHover={{ opacity: 0.2, transition: { duration: 0.3 } }}
              />
              <span className="relative z-10 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Learn More
              </span>
            </motion.button>
          </motion.div>
        </div>
      </motion.section>

      {/* Enhanced Testimonials Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <SuccessStories />
      </motion.div>

      {/* Platforms Showcase Section */}
      <motion.section
        className="py-16 px-4 bg-gray-50 dark:bg-gray-800"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2
            className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Compatible with Your Favorite Platforms
          </motion.h2>
          
          <motion.div 
            className="flex flex-wrap justify-center gap-6 md:gap-10"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              "StreamFlix", "MusicOwl", "LearnBear", "GamingBull", 
              "FitFox", "NewsOwl", "CodeDeer", "PodcastRaven"
            ].map((platform, index) => (
              <motion.div
                key={index}
                className="flex items-center justify-center p-4 bg-white dark:bg-gray-700 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 w-full sm:w-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.1)",
                  transition: { type: "spring", stiffness: 400, damping: 10 }
                }}
              >
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-400 to-blue-500 text-white">
                    {platform.charAt(0)}
                  </div>
                  <span className="font-medium text-gray-800 dark:text-white">
                    {platform}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* FAQ Section with Accordion */}
      <motion.section
        className="py-16 px-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <div className="max-w-4xl mx-auto">
          <motion.h2
            className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Frequently Asked Questions
          </motion.h2>
          
          <div className="space-y-4">
            {[
              {
                question: "How does Token Flow work?",
                answer: "Token Flow connects users who have unused tokens with those looking to save money on premium content. Sellers list their tokens at a discount, and buyers purchase them to access services for less than retail price."
              },
              {
                question: "Is this legal and secure?",
                answer: "Yes, Token Flow operates within the terms of service of supported platforms. All transactions are secured with end-to-end encryption, and our escrow system ensures safe token transfers between users."
              },
              {
                question: "What platforms are supported?",
                answer: "We support over 100 popular content platforms including streaming services, learning platforms, fitness apps, news subscriptions, and more. Check our marketplace for a complete list."
              },
              {
                question: "How much can I save as a buyer?",
                answer: "On average, buyers save about 30% compared to retail prices. Savings vary by platform and current market conditions, with some deals offering up to 50% off."
              }
            ].map((faq, index) => (
              <FAQItem key={index} question={faq.question} answer={faq.answer} index={index} />
            ))}
          </div>
        </div>
      </motion.section>

      {/* Newsletter Subscription */}
      <motion.section
        className="py-16 px-4 bg-indigo-50 dark:bg-gray-800"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-700 rounded-2xl p-8 md:p-12 shadow-lg relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-5 pointer-events-none">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#smallGrid)" />
              </svg>
            </div>

            <div className="relative z-10">
              <motion.h3
                className="text-2xl font-bold text-gray-900 dark:text-white mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                Stay Updated with Token Deals
              </motion.h3>
              <motion.p
                className="text-gray-600 dark:text-gray-300 mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Subscribe to our newsletter for exclusive token deals and platform updates.
              </motion.p>
              
              <motion.form
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <input
                  type="email"
                  placeholder="Your email address"
                  className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white flex-grow focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                />
                <motion.button
                  type="submit"
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all duration-300 relative overflow-hidden"
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0px 8px 15px rgba(79, 70, 229, 0.2)",
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.span 
                    className="absolute inset-0 bg-white opacity-0"
                    whileHover={{ opacity: 0.2, transition: { duration: 0.3 } }}
                  />
                  <span className="relative z-10">Subscribe</span>
                </motion.button>
              </motion.form>
            </div>
          </div>
        </div>
      </motion.section>

     
     
    </div>
  );
};

// FAQ Accordion Item Component
const FAQItem = ({ question, answer, index }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <motion.div 
      className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <motion.button
        className="w-full text-left p-4 flex justify-between items-center bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ backgroundColor: isOpen ? "inherit" : "rgba(0,0,0,0.02)" }}
      >
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">{question}</h3>
        <motion.svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5 text-gray-500 dark:text-gray-400" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </motion.svg>
      </motion.button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="bg-gray-50 dark:bg-gray-700 p-4"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-gray-600 dark:text-gray-300">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Home;
