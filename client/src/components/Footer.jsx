import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const fadeInUpVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };
  
  const linkHoverVariant = {
    hover: { 
      x: 6, 
      transition: { duration: 0.3, ease: "easeOut" } 
    }
  };
  
  return (
    <footer className="pt-16 overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-gray-900 via-gray-800 to-black pointer-events-none"></div>
      
      {/* Subtle pattern overlay */}
      <div 
        className="absolute inset-0 -z-10 opacity-10 pointer-events-none" 
        style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, rgba(120, 119, 198, 0.1) 1px, transparent 1px), 
            radial-gradient(circle at 75% 75%, rgba(120, 119, 198, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      ></div>
      
      {/* Subtle glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 w-3/4 h-32 bg-indigo-600/20 blur-[100px] rounded-full"></div>
      
      {/* Main Footer Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          {/* Company Column */}
          <motion.div 
            className="col-span-1 lg:col-span-2"
            variants={fadeInUpVariant}
          >
            <motion.div 
              className="flex items-center mb-4"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/30 blur-md rounded-full"></div>
                <svg className="relative h-8 w-8 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21.4 7.5c.8.8.8 2.1 0 2.8l-9 9c-.8.8-2.1.8-2.8 0l-6-6c-.8-.8-.8-2.1 0-2.8.8-.8 2.1-.8 2.8 0L12 13.2l7.5-7.5c.8-.8 2.1-.8 2.9 0z"></path>
              </svg>
            </div>
              <span className="ml-2 text-xl font-bold">
                <span className="text-white">Token</span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">Flow</span>
              </span>
            </motion.div>
            <motion.p 
              className="text-gray-400 mb-6 max-w-md"
              variants={fadeInUpVariant}
            >
              Get premium ChatGPT access at a fraction of the cost. Our marketplace connects you with unused tokens from enterprise accounts.
            </motion.p>
            <motion.div 
              className="flex space-x-5"
              variants={fadeInUpVariant}
            >
              {[
                { name: 'Twitter', icon: 'M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84' },
                { name: 'LinkedIn', icon: 'M19.7,3H4.3C3.582,3,3,3.582,3,4.3v15.4C3,20.418,3.582,21,4.3,21h15.4c0.718,0,1.3-0.582,1.3-1.3V4.3 C21,3.582,20.418,3,19.7,3z M8.339,18.338H5.667v-8.59h2.672V18.338z M7.004,8.574c-0.857,0-1.549-0.694-1.549-1.548 c0-0.855,0.691-1.548,1.549-1.548c0.854,0,1.547,0.694,1.547,1.548C8.551,7.881,7.858,8.574,7.004,8.574z M18.339,18.338h-2.669 v-4.177c0-0.996-0.017-2.278-1.387-2.278c-1.389,0-1.601,1.086-1.601,2.206v4.249h-2.667v-8.59h2.559v1.174h0.037 c0.356-0.675,1.227-1.387,2.526-1.387c2.703,0,3.203,1.779,3.203,4.092V18.338z' },
                { name: 'Facebook', icon: 'M22,12.1c0-5.5-4.5-10-10-10c-5.5,0-10,4.5-10,10c0,5,3.7,9.1,8.4,9.9v-7H7.9v-2.9h2.5V9.9c0-2.5,1.5-3.9,3.8-3.9 c1.1,0,2.2,0.2,2.2,0.2v2.5h-1.3c-1.2,0-1.6,0.8-1.6,1.6v1.9h2.8L15.9,15h-2.3v7C18.3,21.2,22,17.1,22,12.1z' },
                { name: 'Instagram', icon: 'M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z' }
              ].map((social, index) => (
                <motion.a 
                  key={index}
                  href={`https://${social.name.toLowerCase()}.com`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="relative p-2.5 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-colors duration-300 hover:border-white/20 hover:bg-white/10 group"
                  whileHover={{ 
                    scale: 1.1,
                    transition: { duration: 0.2, ease: "easeOut" }
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-600/20 to-blue-600/20 opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300"></span>
                  <span className="sr-only">{social.name}</span>
                  <svg className="h-5 w-5 relative" fill="currentColor" viewBox="0 0 24 24">
                    <path d={social.icon}></path>
                </svg>
                </motion.a>
              ))}
            </motion.div>
          </motion.div>

          {/* Links Columns */}
          {[
            { 
              title: "Quick Links", 
              links: [
                { name: "Pricing", path: "/pricing" },
                { name: "How It Works", path: "/how-it-works" },
                { name: "Documentation", path: "/docs" },
                { name: "FAQs", path: "/faqs" },
                { name: "Blog", path: "/blog" }
              ] 
            },
            { 
              title: "Company", 
              links: [
                { name: "About Us", path: "/about" },
                { name: "Careers", path: "/careers" },
                { name: "Press", path: "/press" },
                { name: "Contact", path: "/contact" },
                { name: "Partners", path: "/partners" }
              ] 
            },
            { 
              title: "Support", 
              links: [
                { name: "Help Center", path: "/support" },
                { name: "Terms of Service", path: "/terms" },
                { name: "Privacy Policy", path: "/privacy" },
                { name: "Refund Policy", path: "/refund" },
                { name: "System Status", path: "/status" }
              ] 
            }
          ].map((column, idx) => (
            <motion.div key={idx} variants={fadeInUpVariant}>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider">{column.title}</h3>
              <motion.ul 
                className="mt-4 space-y-2"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
              >
                {column.links.map((link, linkIdx) => (
                  <motion.li key={linkIdx} variants={fadeInUpVariant}>
                    <Link 
                      to={link.path} 
                      className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center group"
                    >
                      <motion.span variants={linkHoverVariant} whileHover="hover">
                        {link.name}
                      </motion.span>
                      <motion.svg 
                        className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0"
                        initial={{ opacity: 0, x: -5 }}
                        variants={{
                          hover: { opacity: 1, x: 0, transition: { duration: 0.3 } }
                        }}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                      </motion.svg>
                </Link>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Newsletter Section */}
      <div className="border-t border-gray-800 relative">
        <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent"></div>
        
        <motion.div 
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-gray-900 to-gray-800 p-8 shadow-xl">
            {/* Background elements */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent"></div>
            <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent"></div>
            <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-indigo-500/30 to-transparent"></div>
            <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-blue-500/30 to-transparent"></div>
            
            <div className="absolute -right-24 -top-24 w-64 h-64 bg-indigo-600/30 rounded-full blur-[80px] opacity-50"></div>
            
            <div className="flex flex-col md:flex-row justify-between items-center relative">
              <div className="md:w-1/2 mb-8 md:mb-0">
                <motion.h3 
                  className="text-xl font-medium text-white mb-3"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  viewport={{ once: true }}
                >
                  Subscribe to our newsletter
                </motion.h3>
                <motion.p 
                  className="text-gray-300"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  Get the latest news and special offers delivered directly to your inbox
                </motion.p>
            </div>
              <div className="md:w-1/2 w-full">
                <form className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-grow">
                <label htmlFor="email-address" className="sr-only">Email address</label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                      className="w-full px-5 py-3 bg-white/10 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 text-white"
                  placeholder="Enter your email"
                />
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 border border-transparent rounded-lg py-3 px-5 flex items-center justify-center text-base font-medium text-white hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 shadow-lg shadow-blue-500/20"
                  >
                    Subscribe
                  </button>
                  </motion.div>
              </form>
            </div>
          </div>
        </div>
        </motion.div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 py-8">
        <div className="relative">
          <div className="absolute left-0 right-0 h-px -top-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex space-x-6 mb-4 md:mb-0">
            {['Terms', 'Privacy', 'Cookies'].map((item, i) => (
              <Link 
                key={i}
                to={`/${item.toLowerCase()}`} 
                className="text-sm text-gray-400 hover:text-white transition-colors duration-300 relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            ))}
          </div>
          <motion.p 
            className="text-sm text-gray-400"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            &copy; {currentYear} TokenFlow. All rights reserved.
          </motion.p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;