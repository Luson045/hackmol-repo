import React, { useState, useEffect, useRef } from 'react';
import { 
  Orbit, 
  Webhook, 
  Unplug, 
  Blocks, 
  Cpu, 
  ShieldCheck, 
  Rocket,
  Globe,
  Database,
  Zap,
  Lock,
  ChevronRight,
  ChevronDown,
  ArrowRight,
  RefreshCw,
  CreditCard,
  CheckCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef(null);
  
  // Convert string newlines to JSX line breaks
  const renderAnswer = () => {
    // Check if answer contains actual \n characters
    if (answer.includes('\n')) {
      return answer.split('\n').map((text, i, array) => (
        <React.Fragment key={i}>
          {text}
          {i < array.length - 1 && <br />}
        </React.Fragment>
      ));
    }
    
    // Handle escaped \n in string literals
    if (answer.includes('\\n')) {
      return answer.split('\\n').map((text, i, array) => (
        <React.Fragment key={i}>
          {text}
          {i < array.length - 1 && <br />}
        </React.Fragment>
      ));
    }
    
    // If no newlines are found, return the original text
    return answer;
  };

  return (
    <motion.div 
      initial={false}
      className="bg-gray-800 rounded-xl mb-4 overflow-hidden"
    >
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-6 text-left"
        initial={false}
        animate={{ 
          backgroundColor: isOpen 
            ? 'rgba(14, 165, 233, 0.2)' 
            : 'transparent' 
        }}
      >
        <span className="text-lg font-semibold">{question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="text-cyan-400" />
        </motion.div>
      </motion.button>
      
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { 
                opacity: 1, 
                height: 'auto',
                transition: { 
                  duration: 0.3,
                  ease: [0.04, 0.62, 0.23, 0.98]
                }
              },
              collapsed: { 
                opacity: 0, 
                height: 0,
                transition: { 
                  duration: 0.3,
                  ease: [0.04, 0.62, 0.23, 0.98]
                }
              }
            }}
            className="overflow-hidden"
          >
            <div className="p-6 pt-0 text-gray-400">
              {renderAnswer()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const NetworkGraph = () => {
  const [nodes, setNodes] = useState([]);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    // Generate network nodes with velocity and more dynamic properties
    const generateNodes = () => {
      const nodeCount = 30;
      const newNodes = Array.from({ length: nodeCount }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 5 + 2,
        vx: (Math.random() - 0.5) * 0.5, // slower horizontal velocity
        vy: (Math.random() - 0.5) * 0.5, // slower vertical velocity
        color: `rgba(0, ${Math.floor(Math.random() * 170) + 85}, 255, 0.6)` // varying blue shades
      }));
      setNodes(newNodes);
    };

    // Animate nodes with more complex movement
    const animateNodes = () => {
      setNodes(prevNodes => prevNodes.map(node => {
        let newX = node.x + node.vx;
        let newY = node.y + node.vy;
        let newVx = node.vx;
        let newVy = node.vy;

        // Bounce off walls with slight randomness
        if (newX < 0 || newX > 100) {
          newVx = -node.vx * (0.8 + Math.random() * 0.4);
          newX = newX < 0 ? 0 : 100;
        }
        if (newY < 0 || newY > 100) {
          newVy = -node.vy * (0.8 + Math.random() * 0.4);
          newY = newY < 0 ? 0 : 100;
        }

        return {
          ...node,
          x: newX,
          y: newY,
          vx: newVx,
          vy: newVy
        };
      }));

      animationFrameRef.current = requestAnimationFrame(animateNodes);
    };

    generateNodes();
    animationFrameRef.current = requestAnimationFrame(animateNodes);

    // Cleanup animation frame
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 100 100" 
      className="absolute inset-0 w-full h-full opacity-30"
    >
      {/* Gradient definition */}
      <defs>
        <radialGradient id="nodeGradient">
          <stop offset="10%" stopColor="rgba(0, 170, 255, 0.8)" />
          <stop offset="95%" stopColor="rgba(0, 170, 255, 0.2)" />
        </radialGradient>
      </defs>

      {nodes.map((node, i) => (
        <React.Fragment key={node.id}>
          {/* Connection lines */}
          {nodes.slice(0, i).map((otherNode) => {
            const distance = Math.sqrt(
              Math.pow(node.x - otherNode.x, 2) + 
              Math.pow(node.y - otherNode.y, 2)
            );
            
            return distance < 30 ? (
              <line
                key={`line-${otherNode.id}`}
                x1={node.x}
                y1={node.y}
                x2={otherNode.x}
                y2={otherNode.y}
                stroke="rgba(0, 170, 255, 0.2)"
                strokeWidth="0.5"
              />
            ) : null;
          })}
          
          {/* Glowing nodes */}
          <circle
            cx={node.x}
            cy={node.y}
            r={node.size / 2}
            fill={node.color}
            className="animate-pulse"
          />
        </React.Fragment>
      ))}
    </svg>
  );
};

// New component for the How It Works steps
const HowItWorksStep = ({ icon, title, description, step }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: step * 0.1 }}
      className="bg-gray-800 p-6 rounded-xl relative"
    >
      <div className="absolute -top-4 -left-4 bg-cyan-600 w-8 h-8 rounded-full flex items-center justify-center font-bold">
        {step}
      </div>
      <motion.div 
        className="mb-6 text-cyan-400"
        whileHover={{ scale: 1.1, rotate: 5 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        {icon}
      </motion.div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </motion.div>
  );
};

// New component for the token problem collage
const TokenProblemCollage = () => {
  const problems = [
    {
      username: "@lightdreamscape",
      platform: "Claude",
      message: "What do I need Claude for anymore... It's 2-3x the price.\nIs there a cool open source project I should try out that requires a smarter model? Is there an app idea/workflow that requires using a smarter model that I can add to my workflow in the next week?\n**Is there a way to sell these credits?**",
      color: "bg-red-600"
    },
    {
      username: "@aMan42",
      platform: "OpenAI",
      message: "Just paid for 1000 GPT-4 tokens and only used 200 this month. Wish I could transfer them to next month's quota!",
      color: "bg-blue-600"
    },
    {
      username: "@gewappnet",
      platform: "OpenAI",
      message: "Please have a look at my Usage I have nto even used it extensively or heavily still my API has expired so is it based on the Time Period Allotted ? Or the amount of Usage done ?How do I get my API working again ? someone please advise.",
      color: "bg-purple-600"
    },
    {
      username: "@paachuthakdu",
      platform: "Gemini",
      message: "If you could give me your api key i will happily use it for my graduation project and I pinky promise I will not use after that!",
      color: "bg-green-600"
    },
    {
      username: "@dev_tools",
      platform: "Mistral AI",
      message: "Why can't we share tokens between teams? Some projects barely use any while others need more.",
      color: "bg-yellow-600"
    },
    {
      username: "@augustya15",
      platform: "OpenAI",
      message: "Does the Free API not have monthly replenish cycle where it gets replenished again every month ? is it only once in life time after signing up ?Will it not ever get replenished for free?",
      color: "bg-teal-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {problems.map((problem, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          whileHover={{ scale: 1.03 }}
          className={`${problem.color} bg-opacity-20 p-4 rounded-xl border border-gray-700`}
        >
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center mr-3">
              {problem.username.charAt(1).toUpperCase()}
            </div>
            <div>
              <p className="font-bold">{problem.username}</p>
              <p className="text-sm text-gray-400">{problem.platform}</p>
            </div>
          </div>
          <p className="text-gray-300">{problem.message}</p>
        </motion.div>
      ))}
    </div>
  );
};

// Mobile Menu Component
const MobileMenu = ({ isOpen, toggleMenu }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden absolute top-16 left-0 right-0 bg-gray-900 border-b border-gray-800 z-50"
        >
          <div className="flex flex-col p-4 space-y-4">
            <a href="#" className="hover:text-cyan-400 transition-colors py-2">Home</a>
            <a href="#how-it-works" className="hover:text-cyan-400 transition-colors py-2">How It Works</a>
            <a href="#faq" className="hover:text-cyan-400 transition-colors py-2">FAQs</a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};



const Home = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const features = [
    {
      icon: <Unplug className="w-12 h-12 text-cyan-400" />,
      title: "Unused Token Marketplace",
      description: "Sell or buy excess AI platform tokens from multiple providers in one centralized marketplace."
    },
    {
      icon: <Blocks className="w-12 h-12 text-purple-400" />,
      title: "Multi-Platform Support",
      description: "Trade tokens from various AI platforms including OpenAI, Anthropic, and more with ease."
    },
    {
      icon: <ShieldCheck className="w-12 h-12 text-green-400" />,
      title: "Secure Transactions",
      description: "Guaranteed safe exchanges with our robust verification and encryption system."
    }
  ];

  const stats = [
    {
      icon: <Globe className="w-10 h-10 text-blue-400" />,
      value: "20+",
      label: "AI Platforms Supported"
    },
    {
      icon: <Database className="w-10 h-10 text-green-400" />,
      value: "$500K+",
      label: "Total Token Volume"
    },
    {
      icon: <Zap className="w-10 h-10 text-yellow-400" />,
      value: "1000+",
      label: "Active Traders"
    }
  ];

  const howItWorksSteps = [
    {
      icon: <RefreshCw className="w-12 h-12" />,
      title: "List Your Unused Tokens",
      description: "Connect your API accounts or manually list your unused tokens from various AI platforms for sale."
    },
    {
      icon: <CreditCard className="w-12 h-12" />,
      title: "Set Your Price",
      description: "Define your selling price or browse available tokens to purchase at competitive rates."
    },
    {
      icon: <CheckCircle className="w-12 h-12" />,
      title: "Secure Transfer",
      description: "Our platform securely handles the token transfer and payment without reavealing any of your sensitive data through our extensive encryption and filtering algorithms."
    },
    {
      icon: <Rocket className="w-12 h-12" />,
      title: "Start Using Immediately",
      description: "Purchased tokens are instantly available in your account for immediate use on the respective platforms."
    }
  ];
  
  const faqs = [
    {
      question: "How does TokenSwapAI work?",
      answer: "TokenSwapAI is a centralized marketplace where users can buy, sell, and exchange unused AI platform tokens. Simply create an account, list your tokens, and start trading securely. How it works? When you sell tokens:\n1. Our system verifies the available credit on your API key\n2. We create a temporary, encrypted copy of your API key in our secure database\n 3. The buyer receives access to this temporary key through our platform (buyer cannot see it)\n4. The buyer can use our in-app AI interface with this temporary access\n5. Once the purchased credits are used up or the access period ends, the temporary API key is permanently deleted"
    },
    {
      question: "Which AI platforms are supported?",
      answer: "Our aim is to be a generic platform and support tokens from major AI platforms including OpenAI, Anthropic, Google AI, and many others."
    },
    {
      question: "Is trading tokens safe?",
      answer: "We use advanced security protocols, including encryption and two-factor authentication, to ensure the safety of all transactions on our platform. \n\n Furthermore we use LLM models to verify if the buyer is not entering any malicious prompt, to keep the sellers identity and personal records safe."
    },
    {
      question: "Is there any legal issue?",
      answer: "Our platform operates in a regulatory space that's still evolving. While current AI platform terms of service have varying policies on token transfers, we closely monitor these policies and maintain open communication channels with major AI providers. Should any legal concerns arise, we're prepared to form partnerships with these companies to ensure compliance. For most models, sharing unused tokens between users is not currently restricted, allowing our marketplace to operate. We're committed to transparency and will promptly inform users of any policy changes that might affect token trading capabilities."
    },
    {
      question: "Can I sell partial token amounts?",
      answer: "Yes! You can list and trade fractional AI tokens, giving you maximum flexibility in managing your unused resources."
    }
  ];

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      
      <div className="pt-16 md:pt-0"></div>
      {/* Hero Section */}
      <header className="relative container mx-auto pt-24 pb-16 px-4 text-center overflow-hidden">
        {/* Network Graph Background */}
        <NetworkGraph />

        <div className="relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Trade <span className="text-cyan-400">Unused AI Tokens</span>
            <br className="hidden md:block" /> Maximize Your Digital Resources
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10">
            A centralized marketplace where you can buy, sell, and exchange unused AI platform tokens securely and efficiently.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button className="bg-cyan-600 hover:bg-cyan-500 px-6 py-3 rounded-full text-lg font-semibold transition-colors flex items-center justify-center">
              Start Trading <ChevronRight className="ml-2" />
            </button>
            <button className="border border-cyan-400 text-cyan-400 hover:bg-cyan-400/10 px-6 py-3 rounded-full text-lg font-semibold transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </header>


      {/* Features Section */}
      <section className="container mx-auto py-16 px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Key <span className="text-cyan-400">Features</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              className={`
                bg-gray-800 p-6 rounded-xl 
                transform transition-all duration-300
                ${activeFeature === index 
                  ? 'scale-105 border border-cyan-400 shadow-lg shadow-cyan-400/20' 
                  : 'hover:scale-105'}
              `}
              onMouseEnter={() => setActiveFeature(index)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <motion.div 
                className="mb-4"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                {feature.icon}
              </motion.div>
              <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Problem Collage Section - Replacing Testimonials */}
      <section className="container mx-auto py-16 px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-2">
          The <span className="text-cyan-400">Problem</span> We Solve
        </h2>
        <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
          Users everywhere face the same challenge - unused tokens that go to waste every month
        </p>
        <TokenProblemCollage />
      </section>

      {/* How It Works Section - New Addition */}
      <section id="how-it-works" className="container mx-auto py-16 px-4">
        <motion.h2 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-center mb-12"
        >
          How It <span className="text-cyan-400">Works</span>
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connecting line between steps */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-cyan-600 to-blue-600 transform -translate-y-1/2 z-0"></div>
          
          {howItWorksSteps.map((step, index) => (
            <HowItWorksStep
              key={index}
              icon={step.icon}
              title={step.title}
              description={step.description}
              step={index + 1}
            />
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto py-16 px-4">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Our <span className="text-cyan-400">Vision</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 text-center">
          {stats.map((stat, index) => (
            <motion.div 
              key={index} 
              className="bg-gray-800 p-6 rounded-xl hover:scale-105 transition-transform"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <motion.div 
                className="mb-4 flex justify-center"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 1 }}
              >
                {stat.icon}
              </motion.div>
              <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
              <p className="text-gray-400">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq"className="container mx-auto py-16 px-4">
        <motion.h2 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-center mb-12"
        >
          Frequently Asked <span className="text-cyan-400">Questions</span>
        </motion.h2>
        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <FAQItem 
              key={index} 
              question={faq.question} 
              answer={faq.answer} 
            />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Cpu className="w-6 h-6 text-cyan-400" />
              <span className="text-xl font-bold">Token<span className="text-cyan-400">Flow</span></span>
            </div>
            <div className="flex flex-wrap justify-center space-x-6">
              <a href="#" className="text-gray-400 hover:text-cyan-400 mb-2">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-cyan-400 mb-2">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-cyan-400 mb-2">Contact</a>
            </div>
          </div>
          <p className="text-gray-400 text-center">
            © 2025 TokenFlow. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;