import { useState, useEffect, useCallback } from 'react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoAnimated, setLogoAnimated] = useState(false);

  // Memoize scroll handler for better performance
  const handleScroll = useCallback(() => {
    if (window.scrollY > 50) {
      if (!scrolled) setScrolled(true);
    } else {
      if (scrolled) setScrolled(false);
    }
  }, [scrolled]);

  // Handle scroll effect for navbar
  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Start logo animation after component mounts - using requestAnimationFrame for better performance
    const animationFrame = requestAnimationFrame(() => {
      setTimeout(() => {
        setLogoAnimated(true);
      }, 300);
    });
    
    // Cleanup listeners
    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrame);
    };
  }, [handleScroll]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    // Prevent scrolling when mobile menu is open
    document.body.style.overflow = !mobileMenuOpen ? 'hidden' : '';
  };

  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-gray-900/95 backdrop-blur-md shadow-lg shadow-black/10 py-2' 
          : 'bg-transparent py-4'
      }`}
      style={{ transform: 'translateZ(0)' }}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo with improved animation */}
        <div className="relative z-10">
          <div className={`flex items-center transition-all duration-500 ${
            logoAnimated ? 'opacity-100 transform translate-x-0' : 'opacity-0 transform -translate-x-4'
          }`}>
            <div className="font-bold md:pl-8 pl-5 text-xl md:text-2xl flex items-center">
              {/* Logo glow effect */}
              <div className="mr-2 relative">
                <span className="absolute inset-0 rounded-full bg-indigo-500 blur-md opacity-30"></span>
                <span className="relative z-10 text-2xl">⚘</span>
              </div>
              
              <span className="text-gray-100 dark:text-gray-100">Token</span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">Flow</span>
            </div>
          </div>
        </div>

        {/* Desktop Navigation with enhanced hover effects */}
        <nav className="hidden pr-10 md:block">
          <ul className="flex space-x-8">
            {['Home', 'Marketplace', 'About', 'Resources'].map((item, index) => (
              <li key={index}>
                <a 
                  href={item === 'Home' ? '/' : `/${item.toLowerCase()}`} 
                  className={`relative font-medium text-sm tracking-wide transition-all duration-300
                    text-gray-200 hover:text-white group flex items-center
                  `}
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 group-hover:w-full"></span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Sign In / Sign Up buttons on desktop */}
        <div className="hidden md:flex items-center space-x-4">
          <a 
            href="/signin" 
            className="px-4 py-1.5 text-sm text-gray-100 hover:text-white transition-colors duration-300 flex items-center"
          >
            Sign In
          </a>
          <a 
            href="/signup" 
            className="px-5 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 relative group overflow-hidden"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg"></span>
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            <span className="relative text-white flex items-center justify-center">
              Sign Up
              <svg className="w-4 h-4 ml-1.5 transform transition-transform duration-300 group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </span>
          </a>
        </div>

        {/* Mobile Menu Button with enhanced animation */}
        <button 
          className="md:hidden z-20 mr-5 relative w-10 h-10 focus:outline-none"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
          style={{ transform: 'translateZ(0)' }}
        >
          <div className="absolute w-5 transform -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2">
            <span 
              className={`absolute h-0.5 w-5 bg-white transform transition duration-300 ease-in-out
                ${mobileMenuOpen ? 'rotate-45 delay-200' : '-translate-y-1.5'}`}
            ></span>
            <span 
              className={`absolute h-0.5 bg-white transform transition-all duration-200 ease-in-out
                ${mobileMenuOpen ? 'w-0 opacity-0' : 'w-5 delay-200'}`}
            ></span>
            <span 
              className={`absolute h-0.5 w-5 bg-white transform transition duration-300 ease-in-out
                ${mobileMenuOpen ? '-rotate-45 delay-200' : 'translate-y-1.5'}`}
            ></span>
          </div>
        </button>

        {/* Mobile Navigation Menu with improved design */}
        <nav 
          className={`fixed top-0 left-0 w-full h-screen bg-gradient-to-b from-gray-900 to-indigo-900 z-10 transform transition-transform duration-300 ease-in-out ${
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          style={{ transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(100%)', willChange: 'transform' }}
        >
          {/* Background patterns for mobile menu */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.2) 1px, transparent 1px), 
              radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.2) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            backgroundPosition: '0 0',
          }}></div>
          
          <div className="absolute top-0 right-0 mt-8 mr-8 opacity-5">
            <svg width="300" height="300" viewBox="0 0 100 100" fill="none">
              <circle cx="50" cy="50" r="40" stroke="white" strokeWidth="0.5" />
              <circle cx="50" cy="50" r="30" stroke="white" strokeWidth="0.5" />
              <circle cx="50" cy="50" r="20" stroke="white" strokeWidth="0.5" />
            </svg>
          </div>
          
          <div className="flex flex-col items-center justify-center h-full">
            <ul className="flex flex-col items-center space-y-8">
              {['Home', 'Marketplace', 'About', 'Resources'].map((item, index) => (
                <li 
                  key={index} 
                  className="overflow-hidden"
                  style={{ 
                    transform: mobileMenuOpen ? 'translateY(0)' : 'translateY(20px)',
                    opacity: mobileMenuOpen ? 1 : 0,
                    transition: `transform 0.5s ease ${index * 0.1}s, opacity 0.5s ease ${index * 0.1}s`
                  }}
                >
                  <a 
                    href={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                    className="text-white text-2xl font-medium hover:text-indigo-200 transition-colors duration-300 relative group"
                    onClick={toggleMobileMenu}
                  >
                    {item}
                    <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-indigo-400 transition-all duration-300 group-hover:w-full"></span>
                  </a>
                </li>
              ))}
            </ul>
            
            {/* Mobile sign in/up buttons */}
            <div className="mt-12 flex flex-col space-y-4 items-center">
              <a 
                href="/signin" 
                className="px-6 py-2 text-white border border-white/20 rounded-lg hover:bg-white/10 transition-colors duration-300"
                onClick={toggleMobileMenu}
              >
                Sign In
              </a>
              <a 
                href="/signup" 
                className="px-6 py-2 text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/20"
                onClick={toggleMobileMenu}
              >
                Sign Up
              </a>
            </div>
            
            <div className="absolute bottom-10 flex space-x-6">
              {['Facebook', 'Twitter', 'Instagram'].map((social, index) => (
                <a 
                  key={index}
                  href={`https://${social.toLowerCase()}.com`} 
                  className="text-white/70 hover:text-white transition-colors duration-300"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social}
                >
                  {social === 'Facebook' ? (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                    </svg>
                  ) : social === 'Twitter' ? (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                    </svg>
                  )}
                </a>
              ))}
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;