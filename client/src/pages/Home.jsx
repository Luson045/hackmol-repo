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
import Footer from '../components/Footer';

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
    // Use requestAnimationFrame for smoother initial render
    requestAnimationFrame(() => {
      setIsLoaded(true);
    });
    
    // Ensure animations don't interfere with visibility
    document.documentElement.style.setProperty('--force-visible', 'visible');
    document.documentElement.style.setProperty('--force-opacity', '1');
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

  // Optimize animations with reduced complexity and ensure end state visibility
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.5,
        ease: "easeOut"
      },
      transitionEnd: {
        opacity: 1, // Ensure final opacity is 1
        visibility: "visible" // Ensure final visibility is visible
      }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      },
      transitionEnd: {
        opacity: 1, // Ensure final opacity is 1
        visibility: "visible" // Ensure final visibility is visible
      }
    }
  };

  const floatAnimation = {
    initial: { y: 0, rotate: 0 },
    animate: {
      y: [0, -15, 0],
      rotate: [0, 3, 0, -3, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: { 
        type: "spring", 
        stiffness: 120, 
        damping: 15,
        mass: 0.5
      }
    }
  };

  const buttonHoverEffects = {
    hover: { 
      scale: 1.05, 
      boxShadow: "0px 10px 20px rgba(99, 102, 241, 0.3)",
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
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1.0]
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
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black overflow-x-hidden">
      {/* Professional Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Base gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/95 via-gray-900/95 to-black/95" />
        
        {/* Consistent geometric patterns */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(45deg, rgba(99, 102, 241, 0.05) 25%, transparent 25%),
              linear-gradient(-45deg, rgba(99, 102, 241, 0.05) 25%, transparent 25%),
              linear-gradient(45deg, transparent 75%, rgba(99, 102, 241, 0.05) 75%),
              linear-gradient(-45deg, transparent 75%, rgba(99, 102, 241, 0.05) 75%)
            `,
            backgroundSize: '100px 100px',
            backgroundPosition: '0 0, 0 50px, 50px -50px, -50px 0px',
            animation: 'backgroundShift 20s linear infinite',
          }} />
        </div>

        {/* Subtle moving gradient */}
    <motion.div
          className="absolute inset-0"
      style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.05) 0%, transparent 50%)',
            backgroundSize: '200% 200%',
          }}
      animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
      }}
      transition={{
            duration: 20,
        repeat: Infinity,
        repeatType: "reverse",
            ease: "linear"
          }}
        />

        {/* Consistent grid lines */}
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.12) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.12) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          maskImage: 'radial-gradient(circle at center, black, transparent 80%)'
        }} />

        {/* Optimized floating elements */}
        {[...Array(3)].map((_, i) => (
      <motion.div
            key={`float-${i}`}
            className="absolute rounded-full"
        style={{
              width: `${Math.random() * 300 + 200}px`,
              height: `${Math.random() * 300 + 200}px`,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
              background: `radial-gradient(circle at center, rgba(99, 102, 241, 0.03) 0%, transparent 70%)`,
              filter: 'blur(60px)',
              willChange: 'transform',
              transform: 'translateZ(0)',
              backfaceVisibility: 'hidden'
        }}
        animate={{
          x: [0, Math.random() * 100 - 50],
          y: [0, Math.random() * 100 - 50],
              scale: [1, 1.1, 1],
        }}
        transition={{
              duration: Math.random() * 10 + 10,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }}
      />
    ))}

        {/* Subtle noise texture */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%\' height=\'100%\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
          backgroundSize: '200px 200px',
        }} />
  </div>

      {/* Add CSS animation keyframes */}
      <style jsx>{`
        @keyframes backgroundShift {
          0% {
            background-position: 0 0, 0 50px, 50px -50px, -50px 0px;
          }
          100% {
            background-position: 100px 100px, 100px 150px, 150px 50px, 50px 100px;
          }
        }
        
        /* Ensure content remains visible */
        .content-section {
          visibility: visible !important;
          opacity: 1 !important;
          z-index: 10;
          position: relative;
        }
        
        .permanent-visible {
          visibility: visible !important;
          opacity: 1 !important;
        }
      `}</style>

      {/* Content Sections with Fixed Blur */}
      <motion.section 
        className="relative pt-24 md:pt-40 pb-20 md:pb-32 px-4 overflow-hidden content-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
          willChange: 'transform'
        }}
  >
   <motion.div
          className="max-w-5xl mx-auto text-center relative z-10 permanent-visible"
  initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden',
            willChange: 'transform'
          }}
        >
          <motion.div
            className="mb-8 permanent-visible"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
  whileHover={{ 
    scale: 1.02,
    transition: { duration: 0.3 }
  }}
          >
            <AnimatePresence mode="wait" initial={false}>
        <motion.h1 
                key={currentPhraseIndex}
                className="text-4xl md:text-6xl lg:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400 permanent-visible"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
        >
          {phrases[currentPhraseIndex]}
        </motion.h1>
      </AnimatePresence>
          </motion.div>

    <motion.p 
            className="text-lg md:text-xl text-gray-300 mb-12 max-w-2xl mx-auto permanent-visible"
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
    >
      Buy and sell unused tokens at minimal cost. Get access to premium content 
      without breaking the bank. Our marketplace connects token holders with 
      content seekers for a win-win exchange.
    </motion.p>
    
    <motion.div 
            className="flex flex-col sm:flex-row justify-center gap-5 permanent-visible"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <motion.button 
        variants={fadeInUp}
              whileHover={buttonHoverEffects.hover}
              whileTap={{ scale: 0.95 }}
        onClick={() => navigate('/marketplace')} 
              className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-xl transition-all duration-200 text-lg shadow-lg"
      >
          Browse Marketplace
      </motion.button>
      <motion.button 
        variants={fadeInUp}
              whileHover={buttonHoverEffects.hover}
              whileTap={{ scale: 0.95 }}
        onClick={() => navigate('/login')} 
              className="px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white border-2 border-gray-700 font-medium rounded-xl transition-all duration-200 text-lg shadow-lg"
      >
          Join Us Now
      </motion.button>
    </motion.div>
  </motion.div>
</motion.section>

      {/* Redesigned How Token Flow Works Section */}
      <motion.section 
        className="py-24 px-4 relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
        style={{
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
          willChange: 'transform'
        }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
          <motion.h2 
              className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400 mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
          >
            How Token Flow Works
          </motion.h2>
            <motion.p 
              className="text-xl text-gray-300 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              A seamless process designed for both buyers and sellers
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <FaRobot className="w-8 h-8" />,
                title: "List Your Tokens",
                description: "Easily list your unused tokens with our simple listing process. Set your price and watch the offers come in.",
                color: "from-indigo-500 to-blue-600"
              },
              {
                icon: <FaSmile className="w-8 h-8" />,
                title: "Find Great Deals",
                description: "Browse through verified token listings and find the perfect deal for your needs.",
                color: "from-purple-500 to-violet-600"
              },
              {
                icon: <FaStar className="w-8 h-8" />,
                title: "Secure Exchange",
                description: "Our escrow system ensures safe and secure token transfers between users.",
                color: "from-cyan-500 to-blue-600"
              },
              {
                icon: <FaBrain className="w-8 h-8" />,
                title: "Enjoy Premium Content",
                description: "Access premium content at discounted rates and make the most of your tokens.",
                color: "from-emerald-500 to-teal-600"
              }
            ].map((step, index) => (
              <motion.div 
                key={index}
                className="relative group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                {/* Card background */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl transform group-hover:scale-105 transition-transform duration-300" />
                
                {/* Card content */}
                <div className="relative p-8 rounded-2xl border border-gray-700/50">
                  {/* Icon container */}
                <motion.div 
                    className={`w-16 h-16 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform duration-300`}
                  whileHover={{ rotate: 5 }}
                >
                    {step.icon}
                </motion.div>
                  
                  {/* Step number */}
                  <div className="absolute top-4 right-4 text-4xl font-bold text-gray-700/30">
                    {index + 1}
                  </div>
                  
                <motion.h3 
                    className="text-xl font-bold text-white mb-4"
                    whileHover={{ x: 5 }}
                  >
                    {step.title}
                </motion.h3>
                  
                <motion.p 
                    className="text-gray-400"
                    whileHover={{ x: 5 }}
                  >
                    {step.description}
                </motion.p>
                  
                  {/* Hover effect line */}
                  <motion.div 
                    className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500"
                    initial={{ width: 0 }}
                    whileHover={{ width: "100%" }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Connecting lines between steps */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 transform -translate-y-1/2" />
        </div>
      </motion.section>

      {/* Stats Section with Counter Animation */}
      <motion.section
        className="py-20 bg-gradient-to-b from-gray-900 to-black px-6 content-section"
  ref={statsRef}
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  viewport={{ once: true }}
  transition={{ duration: 0.8 }}
        style={{ zIndex: 10, position: 'relative' }}
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
            <h2 className="text-3xl md:text-5xl font-bold text-gray-100 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-blue-300 to-purple-300">
        Measurable Business Outcomes
      </h2>
            <div className="w-40 h-1 bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500 mx-auto rounded-full mb-6"></div>
            <p className="text-gray-300 max-w-2xl mx-auto text-lg">
              Our enterprise AI platform delivers quantifiable performance improvements across your organization
      </p>
    </motion.div>

          {/* Stats Grid - Redesigned Card Style */}
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
                ),
                color: "from-indigo-500 to-blue-600",
                hoverColor: "hover:from-indigo-600 hover:to-blue-700",
                accentColor: "rgba(99, 102, 241, 0.15)"
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
                ),
                color: "from-purple-500 to-violet-600",
                hoverColor: "hover:from-purple-600 hover:to-violet-700",
                accentColor: "rgba(139, 92, 246, 0.15)"
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
                ),
                color: "from-cyan-500 to-blue-600",
                hoverColor: "hover:from-cyan-600 hover:to-blue-700",
                accentColor: "rgba(6, 182, 212, 0.15)"
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
                ),
                color: "from-emerald-500 to-teal-600",
                hoverColor: "hover:from-emerald-600 hover:to-teal-700",
                accentColor: "rgba(16, 185, 129, 0.15)"
        }
      ].map((stat, index) => (
        <motion.div
          key={index}
                className="relative"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ 
            delay: index * 0.1, 
            duration: 0.7, 
                  ease: [0.22, 1, 0.36, 1]
                }}
              >
                {/* Background accent */}
                <div 
                  className="absolute inset-0 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300"
                  style={{ background: stat.accentColor }}
                />
                
          <motion.div
                  className="group relative bg-gray-800/70 backdrop-blur-md rounded-2xl shadow-xl border border-gray-700/70 h-full overflow-hidden"
            whileHover={{ 
                    y: -10,
                    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3), 0 15px 20px rgba(0, 0, 0, 0.2)",
              transition: { 
                type: "spring", 
                stiffness: 300, 
                damping: 20 
              }
            }}
          >
                  {/* Card gradient accent top line */}
                  <div className={`h-1.5 w-full bg-gradient-to-r ${stat.color} transform origin-left transition-all duration-300 group-hover:scale-x-100`}></div>
                  
                  <div className="p-8">
                    {/* Icon with background circle */}
                    <div className="mb-6 relative">
                      <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${stat.color} ${stat.hoverColor} flex items-center justify-center p-4 text-white shadow-lg transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                  {stat.icon}
                        {/* Pulse animation for icon */}
                        <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${stat.color} animate-ping opacity-20`} style={{ animationDuration: '3s' }}></div>
                </div>
                      
                      {/* Decorative elements */}
                      <div className="absolute top-1/2 right-0 w-24 h-px bg-gradient-to-r from-transparent to-gray-700/70 opacity-50"></div>
              </div>
              
                    {/* Label with colored accent */}
                    <div className="flex items-center mb-2">
                      <h3 className="text-lg font-semibold text-white bg-clip-text">{stat.label}</h3>
                    </div>
                    
                    {/* Value with animation */}
              <motion.div
                      className="flex items-baseline mb-2"
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                      transition={{ delay: 0.3 + index * 0.1, duration: 0.6 }}
              >
                <motion.span 
                        className={`text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${stat.color}`}
                  whileHover={{
                    scale: 1.05,
                    transition: { duration: 0.2 }
                  }}
                >
                  {stat.value}
                </motion.span>
                    </motion.div>
                    
                    {/* Description */}
                    <p className="text-gray-400 font-medium mt-2">
                  {stat.description}
                </p>
            
                    {/* Progress indicator */}
                    <div className="mt-6 h-1.5 w-full bg-gray-700/50 rounded-full overflow-hidden">
              <motion.div 
                        className={`h-full bg-gradient-to-r ${stat.color} rounded-full`}
                        initial={{ width: "0%" }}
                        whileInView={{ width: "85%" }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 + index * 0.1, duration: 1, ease: "easeOut" }}
              />
            </div>
            
                    {/* View details button */}
                    <div className="mt-6 opacity-0 transform translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                      <button className={`w-full py-2 rounded-lg bg-gradient-to-r ${stat.color} ${stat.hoverColor} text-white text-sm flex items-center justify-center`}>
                        <span>View Details</span>
                        <svg className="w-4 h-4 ml-2 transform transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
                      </button>
                    </div>
                  </div>
          </motion.div>
        </motion.div>
      ))}
    </div>
    
          {/* Enhanced Background Elements */}
          <div className="relative w-full h-24 mt-16">
      <motion.div 
              className="absolute hidden lg:block -left-20 -top-40 w-80 h-80 rounded-full opacity-10"
              style={{ background: 'radial-gradient(circle at center, rgba(99, 102, 241, 0.4) 0%, transparent 70%)' }}
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
              className="absolute hidden lg:block right-10 bottom-0 w-60 h-60 rounded-full opacity-10"
              style={{ background: 'radial-gradient(circle at center, rgba(139, 92, 246, 0.4) 0%, transparent 70%)' }}
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
            
            {/* Decorative lines */}
            <div className="absolute inset-y-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-indigo-500/20 to-transparent"></div>
            <div className="absolute inset-y-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-purple-500/20 to-transparent"></div>
          </div>
          
          {/* View All Stats CTA */}
          <div className="flex justify-center mt-8">
            <button className="group relative overflow-hidden px-8 py-3 rounded-xl bg-gray-800/70 backdrop-blur-sm border border-gray-700/50 text-white font-medium transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900">
              <span className="absolute inset-0 w-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-20 group-hover:w-full transition-all duration-300 ease-out"></span>
              <span className="relative flex items-center">
                View All Metrics
                <svg className="w-5 h-5 ml-2 transform transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                </svg>
              </span>
            </button>
    </div>
  </div>
</motion.section>

      {/* Featured Tokens with Staggered Animation - Performance Optimized */}
      <motion.section 
        className="py-16 px-4 bg-gradient-to-b from-black to-gray-900 content-section"
        ref={tokensRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        style={{ zIndex: 10, position: 'relative' }}
      >
        {/* Static grid background instead of animated */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          maskImage: 'radial-gradient(circle at center, black, transparent 80%)'
        }} />
        
        <div className="max-w-6xl mx-auto relative">
          {/* Reduced number of background elements */}
          <div className="absolute left-1/4 top-1/4 w-64 h-64 rounded-full blur-3xl opacity-10"
            style={{
              background: 'radial-gradient(circle at center, rgba(120, 120, 255, 0.2) 0%, transparent 70%)',
              transform: 'translateZ(0)'
            }}
          />
          <div className="absolute right-1/4 bottom-1/4 w-64 h-64 rounded-full blur-3xl opacity-10"
            style={{
              background: 'radial-gradient(circle at center, rgba(180, 120, 255, 0.2) 0%, transparent 70%)',
              transform: 'translateZ(0)'
            }}
          />
          
          <h2 className="text-3xl md:text-5xl font-bold text-center text-white mb-12 permanent-visible">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400">
            Featured Tokens
            </span>
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
  { 
    platform: "ChatGPT", 
    discount: "25% off", 
    icon: <FaRobot />, 
                color: "from-emerald-500 to-teal-500",
                baseColor: "#10b981",
                textColor: "text-emerald-500"
  },
  { 
    platform: "Claude", 
    discount: "30% off", 
    icon: <FaSmile />, 
                color: "from-violet-500 to-purple-500",
                baseColor: "#8b5cf6",
                textColor: "text-violet-500"
  },
  { 
    platform: "Gemini", 
    discount: "40% off", 
    icon: <FaStar />, 
                color: "from-blue-500 to-indigo-500",
                baseColor: "#3b82f6",
                textColor: "text-blue-500"
  },
  { 
    platform: "Anthropic", 
    discount: "20% off", 
    icon: <FaBrain />, 
                color: "from-pink-500 to-rose-500",
                baseColor: "#ec4899",
                textColor: "text-pink-500"
  },
  { 
    platform: "Bard", 
    discount: "35% off", 
    icon: <FaPen />, 
                color: "from-amber-500 to-yellow-500",
                baseColor: "#f59e0b",
                textColor: "text-amber-500"
  },
  { 
    platform: "Llama", 
    discount: "15% off", 
    icon: <FaMagic />, 
                color: "from-indigo-500 to-blue-500",
                baseColor: "#6366f1",
                textColor: "text-indigo-500"
  }
].map((item, index) => (
              <div 
                key={index}
                className="group overflow-hidden cursor-pointer relative h-[280px] sm:h-[320px] bg-gray-800 rounded-2xl border border-gray-700/50 shadow-lg will-change-transform permanent-visible"
                    style={{
                  transform: "translateZ(0)",
                  boxShadow: `0 0 20px 0 rgba(0,0,0,0.5)`
                }}
              >
                {/* Static gradient border instead of animated */}
                <div className="absolute inset-0 rounded-2xl overflow-hidden opacity-50" style={{
                  background: `linear-gradient(45deg, rgba(${item.baseColor.replace('#', '')}, 0.15) 0%, transparent 70%)`,
                  transform: "translateZ(0)"
                }} />
                
                {/* Header with icon */}
                <div className="pt-6 px-6 flex items-center">
                  <div
                    className={`w-14 h-14 flex items-center justify-center rounded-full text-white text-2xl bg-gradient-to-br ${item.color} transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}
                  >
                    {item.icon}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-2xl font-bold text-white permanent-visible mb-1">
                    {item.platform}
                    </h3>
                    <div className="flex items-center">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                          </svg>
                        ))}
                      </div>
                      <span className="text-gray-400 text-sm ml-2">(120+ users)</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 mt-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-gray-400 text-sm">Price</span>
                      <div className="flex items-baseline">
                        <span className="text-3xl font-bold text-white mr-2">
                      {item.discount}
                      </span>
                        <span className="text-gray-400 line-through text-sm">Regular</span>
                  </div>
                </div>
                    <div 
                      className={`px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${item.color} text-white transform transition-transform duration-300 group-hover:scale-105`}
                    >
                      Most Popular
          </div>
        </div>
                  
                  <div className="mt-6 space-y-4">
                    <div className="flex items-center text-gray-300">
                      <svg className="w-4 h-4 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span>Premium access included</span>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <svg className="w-4 h-4 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span>No expiration date</span>
                    </div>
        </div>

                  <button 
                    className={`mt-8 w-full py-3 rounded-xl text-white font-medium bg-gradient-to-r ${item.color} relative overflow-hidden transform transition-all duration-300 group-hover:scale-[1.02]`}
                    style={{
                      transform: "translateZ(0)"
                    }}
                  >
                    <div className="absolute inset-0 w-0 bg-white opacity-20 group-hover:w-full transition-all duration-300 ease-out" />
                    <span className="relative flex items-center justify-center">
                      View Token Details
                      <svg className="w-5 h-5 ml-2 transform transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {/* View more button */}
          <div className="flex justify-center mt-12">
            <button
              className="group relative px-6 py-3 text-white font-medium overflow-hidden rounded-xl bg-gray-800 border border-gray-700/50 transform transition-transform duration-300 hover:scale-105"
              style={{ transform: "translateZ(0)" }}
            >
              <div className="absolute inset-0 w-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-30 group-hover:w-full transition-all duration-300 ease-out" />
              <span className="relative flex items-center justify-center">
                View All Tokens
                <svg className="w-5 h-5 ml-2 transform transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                </svg>
              </span>
            </button>
          </div>
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

      {/* Platforms Showcase Section - Enhanced */}
      <section
        className="py-16 px-4 bg-gradient-to-b from-gray-900 to-black content-section"
        style={{ zIndex: 10, position: 'relative' }}
      >
        {/* Static grid background */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          maskImage: 'radial-gradient(circle at center, black, transparent 80%)'
        }} />
        
        <div className="max-w-6xl mx-auto relative">
          {/* Background accent */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
            <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] -translate-x-1/2 -translate-y-1/2" 
              style={{
                background: 'radial-gradient(circle at center, rgba(99, 102, 241, 0.15) 0%, transparent 60%)',
                transform: 'translateZ(0)'
              }}
            />
          </div>
          
          <h2
            className="text-3xl md:text-5xl font-bold text-center mb-6 permanent-visible"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400">
              Compatible AI Models
            </span>
          </h2>
          
          <p className="text-gray-300 text-center max-w-3xl mx-auto mb-16">
            Token Flow supports a wide range of AI models and platforms, allowing you to maximize the value of your subscriptions across the entire AI ecosystem.
          </p>
          
          {/* AI Model Grid - Improved responsive design */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {[
              {
                name: "ChatGPT",
                subtitle: "OpenAI",
                color: "from-emerald-600 to-teal-600",
                icon: <FaRobot className="w-5 h-5" />,
                accent: "emerald"
              },
              {
                name: "Claude",
                subtitle: "Anthropic",
                color: "from-violet-600 to-purple-600",
                icon: <FaSmile className="w-5 h-5" />,
                accent: "violet"
              },
              {
                name: "Gemini",
                subtitle: "Google",
                color: "from-blue-600 to-indigo-600",
                icon: <FaStar className="w-5 h-5" />,
                accent: "blue"
              },
              {
                name: "GPT-4o",
                subtitle: "OpenAI",
                color: "from-pink-600 to-rose-600",
                icon: <FaBrain className="w-5 h-5" />,
                accent: "pink"
              },
              {
                name: "Bard",
                subtitle: "Google",
                color: "from-amber-600 to-yellow-600",
                icon: <FaPen className="w-5 h-5" />,
                accent: "amber"
              },
              {
                name: "Llama",
                subtitle: "Meta AI",
                color: "from-indigo-600 to-blue-600",
                icon: <FaMagic className="w-5 h-5" />,
                accent: "indigo"
              },
              {
                name: "Mistral",
                subtitle: "Mistral AI",
                color: "from-cyan-600 to-sky-600",
                icon: <FaRobot className="w-5 h-5" />,
                accent: "cyan"
              },
              {
                name: "Palm",
                subtitle: "Google",
                color: "from-lime-600 to-green-600",
                icon: <FaPen className="w-5 h-5" />,
                accent: "lime"
              },
              {
                name: "Claude 3",
                subtitle: "Anthropic",
                color: "from-fuchsia-600 to-pink-600",
                icon: <FaBrain className="w-5 h-5" />,
                accent: "fuchsia"
              },
              {
                name: "GPT-3.5",
                subtitle: "OpenAI",
                color: "from-emerald-600 to-teal-600",
                icon: <FaStar className="w-5 h-5" />,
                accent: "emerald"
              }
            ].map((model, index) => (
              <div
                key={index}
                className={`group rounded-xl overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-lg border border-gray-700/50 bg-gray-800/70 backdrop-blur-sm shadow-md hover:shadow-${model.accent}-900/20 permanent-visible`}
                style={{ 
                  transform: "translateZ(0)",
                  animation: `fadeIn 500ms ${index * 50}ms both`
                }}
              >
                <div className={`p-3 sm:p-4 flex flex-col`}>
                  <div className="flex items-center mb-3">
                    <div className={`w-9 h-9 flex items-center justify-center rounded-full bg-gradient-to-br ${model.color} text-white`}>
                      {model.icon}
                  </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-semibold text-white">{model.name}</h3>
                      <p className="text-xs text-gray-400">{model.subtitle}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-gray-400">Tokens:</span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <div 
                            key={i} 
                            className={`w-2 h-2 rounded-full mx-px ${i < 4 ? 'bg-green-500' : 'bg-gray-600'}`}
                          />
                        ))}
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full bg-${model.accent}-900/20 text-${model.accent}-400`}>
                      Available
                  </span>
                </div>
                </div>
                
                {/* Hover gradient overlay */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300" style={{
                  background: `linear-gradient(45deg, var(--${model.accent}-500), transparent)`,
                }} />
              </div>
            ))}
        </div>
          
          {/* View all platforms button */}
          <div className="flex justify-center mt-12">
            <button
              className="group relative px-6 py-3 text-white font-medium overflow-hidden rounded-xl bg-gray-800 border border-gray-700/50 transform transition-transform duration-300 hover:scale-105"
              style={{ transform: "translateZ(0)" }}
            >
              <div className="absolute inset-0 w-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-30 group-hover:w-full transition-all duration-300 ease-out" />
              <span className="relative flex items-center justify-center">
                Explore All AI Models
                <svg className="w-5 h-5 ml-2 transform transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                </svg>
              </span>
            </button>
          </div>
          
          {/* Add keyframes for fade in animation */}
          <style jsx>{`
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(10px) translateZ(0); }
              to { opacity: 1; transform: translateY(0) translateZ(0); }
            }
          `}</style>
        </div>
      </section>

      {/* FAQ Section with Accordion - Performance Optimized */}
      <section
        className="py-16 px-4 bg-gradient-to-b from-black to-gray-900 content-section"
        style={{ zIndex: 10, position: 'relative' }}
      >
        {/* Static grid background */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          maskImage: 'radial-gradient(circle at center, black, transparent 80%)'
        }} />

        <div className="max-w-4xl mx-auto relative">
          {/* Background decorative elements */}
          <div className="absolute -left-12 -top-12 w-64 h-64 rounded-full blur-3xl opacity-5"
            style={{
              background: 'radial-gradient(circle at center, rgba(120, 120, 255, 0.5) 0%, transparent 70%)',
              transform: 'translateZ(0)'
            }}
          />
          <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full blur-3xl opacity-5"
            style={{
              background: 'radial-gradient(circle at center, rgba(180, 120, 255, 0.5) 0%, transparent 70%)',
              transform: 'translateZ(0)'
            }}
          />
          
          <h2
            className="text-3xl md:text-5xl font-bold text-center text-white mb-12 permanent-visible"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400">
            Frequently Asked Questions
            </span>
          </h2>
          
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
              <OptimizedFAQItem key={index} question={faq.question} answer={faq.answer} index={index} />
            ))}
          </div>
          
          {/* Decorative line */}
          <div className="mt-16 h-px w-full bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent"></div>
          
          {/* Contact CTA */}
          <div className="mt-12 text-center">
            <p className="text-gray-300 mb-6">
              Still have questions? We're here to help!
            </p>
            <button
              className="group relative px-6 py-3 text-white font-medium overflow-hidden rounded-xl bg-gray-800 border border-gray-700/50 transform transition-transform duration-300 hover:scale-105"
              style={{ transform: "translateZ(0)" }}
            >
              <div className="absolute inset-0 w-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-30 group-hover:w-full transition-all duration-300 ease-out" />
              <span className="relative flex items-center justify-center">
                Contact Support
                <svg className="w-5 h-5 ml-2 transform transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                </svg>
              </span>
            </button>
          </div>
        </div>
      <Footer/>
      </section>
    </div>
  );
};

// Optimized FAQ Item Component with CSS transitions
const OptimizedFAQItem = ({ question, answer, index }) => {
  const [isOpen, setIsOpen] = useState(false);
  const answerRef = useRef(null);
  
  return (
    <div 
      className={`border border-gray-700 rounded-lg overflow-hidden transition-all duration-300 transform ${isOpen ? 'border-indigo-500/50 shadow-lg shadow-indigo-500/10' : 'hover:border-gray-600'} permanent-visible`}
      style={{ 
        transform: "translateZ(0)",
        willChange: "transform, box-shadow",
        transitionDelay: `${index * 50}ms`,
        opacity: 1,
        animation: `fadeIn 500ms ${index * 100}ms both`
      }}
    >
      <button
        className="w-full text-left p-5 flex justify-between items-center bg-gray-800 hover:bg-gray-750 transition-colors duration-200 permanent-visible"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <h3 className="text-xl font-medium text-white permanent-visible group-hover:text-indigo-300 transition-colors duration-200">
          {question}
        </h3>
        <div 
          className={`h-8 w-8 rounded-full flex items-center justify-center bg-gray-700 text-white transform transition-transform duration-300 ${isOpen ? 'rotate-180 bg-indigo-600' : ''}`}
        >
          <svg 
            className="w-5 h-5" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>
      
      <div 
        ref={answerRef}
        className={`bg-gray-750 overflow-hidden transition-all duration-300 ease-in-out permanent-visible`} 
        style={{ 
          maxHeight: isOpen ? `${answerRef.current ? answerRef.current.scrollHeight : 300}px` : "0px",
          opacity: isOpen ? 1 : 0
        }}
      >
        <div className="p-5 border-t border-gray-700">
          <p className="text-gray-300 leading-relaxed permanent-visible">
            {answer}
          </p>
          
          {/* Extra action link at the end of each answer */}
          <div className="mt-4 flex justify-end">
            <a 
              href="#" 
              className="text-indigo-400 inline-flex items-center hover:text-indigo-300 transition-colors duration-200 permanent-visible"
            >
              <span>Learn more</span>
              <svg className="w-4 h-4 ml-1 transform transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </div>
      
      {/* Add keyframes for the fade in animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Home;
