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
                color: "from-indigo-500 to-purple-500"
              },
              {
                icon: <FaSmile className="w-8 h-8" />,
                title: "Find Great Deals",
                description: "Browse through verified token listings and find the perfect deal for your needs.",
                color: "from-purple-500 to-pink-500"
              },
              {
                icon: <FaStar className="w-8 h-8" />,
                title: "Secure Exchange",
                description: "Our escrow system ensures safe and secure token transfers between users.",
                color: "from-pink-500 to-red-500"
              },
              {
                icon: <FaBrain className="w-8 h-8" />,
                title: "Enjoy Premium Content",
                description: "Access premium content at discounted rates and make the most of your tokens.",
                color: "from-red-500 to-orange-500"
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
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-100 mb-4">
              Measurable Business Outcomes
            </h2>
            <div className="w-20 h-px bg-gradient-to-r from-blue-500 to-blue-600 mx-auto mb-6"></div>
            <p className="text-gray-300 max-w-2xl mx-auto text-lg">
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
                  className="relative bg-gray-800/70 backdrop-blur-sm rounded-lg shadow-md border border-gray-700 h-full overflow-hidden"
                  whileHover={{ 
                    y: -8,
                    boxShadow: "0 15px 30px -5px rgba(0, 0, 0, 0.3), 0 10px 15px -5px rgba(0, 0, 0, 0.2)",
                    transition: { 
                      type: "spring", 
                      stiffness: 300, 
                      damping: 20 
                    }
                  }}
                >
                  <div className="p-6">
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="w-12 h-12 rounded-lg bg-blue-900/50 flex items-center justify-center p-2.5 text-blue-400 transition-all duration-300 group-hover:bg-blue-800 group-hover:text-white">
                        {stat.icon}
                      </div>
                      <h3 className="text-base font-medium text-gray-100">{stat.label}</h3>
                    </div>
                    
                    <motion.div
                      className="space-y-2"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + index * 0.1, duration: 0.4 }}
                    >
                      <motion.span 
                        className="block text-4xl font-bold text-white"
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
                      <p className="text-sm text-gray-300">
                        {stat.description}
                      </p>
                    </motion.div>
                  </div>
                  
                  {/* Progress bar that animates on hover */}
                  <div className="h-1 w-full bg-gray-700 overflow-hidden">
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
                    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue-500/10">
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
              className="absolute hidden lg:block -left-12 -top-32 w-64 h-64 rounded-full bg-blue-500/5"
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
              className="absolute hidden lg:block right-0 top-0 w-32 h-32 rounded-full bg-blue-500/5"
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
        className="py-16 px-4 bg-gradient-to-b from-black to-gray-900 content-section"
        ref={tokensRef}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7 }}
        style={{ zIndex: 10, position: 'relative' }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            className="text-3xl font-bold text-center text-white mb-12"
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
                className="bg-gray-800 rounded-xl overflow-hidden shadow-md group cursor-pointer"
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
                    className="text-xl font-bold text-white mb-3"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    {item.platform}
                  </motion.h3>
                  <div className="flex justify-between items-center">
                    <motion.span 
                      className="text-indigo-600 font-semibold"
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
        className="py-16 px-4 bg-gradient-to-b from-gray-900 to-black content-section"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        style={{ zIndex: 10, position: 'relative' }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2
            className="text-3xl font-bold text-center text-white mb-12"
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
                className="flex items-center justify-center p-4 bg-gray-800 rounded-lg shadow-md hover:shadow-lg border border-gray-700 transition-all duration-300 w-full sm:w-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.3)",
                  transition: { type: "spring", stiffness: 400, damping: 10 }
                }}
              >
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-400 to-blue-500 text-white">
                    {platform.charAt(0)}
                  </div>
                  <span className="font-medium text-white">
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
        className="py-16 px-4 bg-gradient-to-b from-black to-gray-900 content-section"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        style={{ zIndex: 10, position: 'relative' }}
      >
        <div className="max-w-4xl mx-auto">
          <motion.h2
            className="text-3xl font-bold text-center text-white mb-12"
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
    </div>
  );
};

// FAQ Accordion Item Component
const FAQItem = ({ question, answer, index }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <motion.div 
      className="border border-gray-700 rounded-lg overflow-hidden permanent-visible"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <motion.button
        className="w-full text-left p-4 flex justify-between items-center bg-gray-800 hover:bg-gray-700 transition-colors duration-200 permanent-visible"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ backgroundColor: isOpen ? "inherit" : "rgba(255,255,255,0.05)" }}
      >
        <h3 className="text-lg font-medium text-white permanent-visible">{question}</h3>
        <motion.svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5 text-gray-400 permanent-visible" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </motion.svg>
      </motion.button>
      
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div 
            className="bg-gray-700 p-4 permanent-visible"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-gray-300 permanent-visible">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Home;
