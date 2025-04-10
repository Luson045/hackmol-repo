import React, { useState, useEffect, useRef } from "react";

const testimonials = [
  {
    name: "Alex Morgan",
    role: "AI Developer",
    handle: "@alex_token_trader",
    image: "https://i.pravatar.cc/100?img=11",
    text: "Token Flow is a game-changer! I sold my unused subscription tokens and made back nearly half of what I paid. The process was seamless and secure.",
    platform: "ChatGPT Plus",
    savings: "$12/month"
  },
  {
    name: "Sophia Chen",
    role: "Data Scientist",
    handle: "@sophia_digital",
    image: "https://i.pravatar.cc/100?img=12",
    text: "I was able to access premium content across multiple platforms at 30% less than retail price. This marketplace is revolutionizing how we use digital tokens.",
    platform: "Claude Pro",
    savings: "$15/month"
  },
  {
    name: "Rajan Malhotra",
    role: "Software Engineer",
    handle: "@rajan_tech",
    image: "https://i.pravatar.cc/100?img=13",
    text: "From listing to selling, the entire process took less than an hour. Now I never worry about wasting subscription tokens I can't use!",
    platform: "Midjourney",
    savings: "$20/month"
  },
  {
    name: "Emma Williams",
    role: "Content Creator",
    handle: "@emma_content_creator",
    image: "https://i.pravatar.cc/100?img=14",
    text: "As a content creator, I love that my fans can trade tokens among themselves. It makes my premium content more accessible while still supporting my work.",
    platform: "GPT-4o",
    savings: "$10/month"
  },
  {
    name: "Michael Zhang",
    role: "Product Manager",
    handle: "@michael_z_investor",
    image: "https://i.pravatar.cc/100?img=15",
    text: "The token verification system provides peace of mind for every transaction. I've been both a buyer and seller, and each experience has been fantastic.",
    platform: "Gemini Advanced",
    savings: "$8/month"
  },
  {
    name: "Priya Sharma",
    role: "Digital Nomad",
    handle: "@priya_digital_nomad",
    image: "https://i.pravatar.cc/100?img=16",
    text: "Token Flow helped me save over $200 on annual subscriptions by buying tokens from others who weren't using their full allocation. Brilliant concept!",
    platform: "Multiple Platforms",
    savings: "$18/month"
  },
];

const TestimonialWall = () => {
  const [visibleTestimonials, setVisibleTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef(null);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Optimized loading with performance improvements
  useEffect(() => {
    // Use requestAnimationFrame for smoother visual updates
    const loadFrame = requestAnimationFrame(() => {
      // Preload images in parallel for faster loading
      const preloadPromises = testimonials.map(item => {
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = resolve;
          img.onerror = resolve; // Handle error gracefully
          img.src = item.image;
        });
      });

      // Shorter initial delay and progressive loading
      Promise.all(preloadPromises).then(() => {
        setVisibleTestimonials(testimonials);
        setLoading(false);
      });
    });
    
    return () => cancelAnimationFrame(loadFrame);
  }, []);

  // Optimized animation handling
  useEffect(() => {
    if (!loading && visibleTestimonials.length > 0 && !hasInteracted) {
      const interval = setInterval(() => {
        setActiveIndex(prev => (prev + 1) % visibleTestimonials.length);
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [loading, visibleTestimonials.length, hasInteracted]);
  
  // Handle user interaction to pause automatic rotation
  const handleCardInteraction = (index) => {
    setActiveIndex(index);
    setHasInteracted(true);
    
    // Resume auto-rotation after period of inactivity
    const timer = setTimeout(() => setHasInteracted(false), 10000);
    return () => clearTimeout(timer);
  };

  return (
    <section 
      className="py-24 px-4 bg-gradient-to-br from-black via-gray-900 to-black relative z-10"
      ref={containerRef}
      style={{ 
        transform: 'translateZ(0)',
        willChange: 'transform',
        backfaceVisibility: 'hidden'
      }}
    >
      {/* Enhanced grid pattern background with subtle motion */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          maskImage: 'radial-gradient(circle at center, black, transparent 80%)'
        }} />
        
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 opacity-20" style={{
          background: 'linear-gradient(45deg, transparent, rgba(130, 130, 255, 0.1), transparent)',
          backgroundSize: '200% 200%',
          animation: 'gradientMove 20s infinite linear'
        }} />
      </div>
      
      {/* Background accent circles with subtle animation */}
      <div className="absolute left-1/4 top-1/4 w-64 h-64 rounded-full blur-3xl opacity-10" style={{
        background: 'radial-gradient(circle at center, rgba(120, 120, 255, 0.5) 0%, transparent 70%)',
        transform: 'translateZ(0)',
        animation: 'float 15s infinite ease-in-out'
      }} />
      <div className="absolute right-1/4 bottom-1/3 w-64 h-64 rounded-full blur-3xl opacity-10" style={{
        background: 'radial-gradient(circle at center, rgba(180, 120, 255, 0.5) 0%, transparent 70%)',
        transform: 'translateZ(0)',
        animation: 'float 20s infinite ease-in-out reverse'
      }} />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 relative">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400 inline-block transform transition-transform duration-700">
              What Our Users Are Saying
            </span>
            {/* Decorative element */}
            <div className="absolute w-full h-px bottom-0 left-0">
              <div className="absolute left-1/2 transform -translate-x-1/2 w-32 h-1 mt-2 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500" />
            </div>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8 leading-relaxed">
            Join thousands of satisfied users who are maximizing their AI subscriptions through our platform
          </p>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="relative w-20 h-20">
              {/* Layered loading spinner for more visual interest */}
              <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20 animate-ping" style={{ animationDuration: '2s' }}></div>
              <div className="absolute inset-0 rounded-full border-4 border-gray-700 border-t-indigo-500 border-r-purple-500 animate-spin" style={{ animationDuration: '1s' }}></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-indigo-400 font-medium">Loading</span>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {visibleTestimonials.map((item, index) => {
                // Calculate a unique gradient for each card
                const gradients = [
                  "from-indigo-500 to-purple-500",
                  "from-blue-500 to-indigo-500", 
                  "from-purple-500 to-pink-500",
                  "from-pink-500 to-rose-500",
                  "from-rose-500 to-orange-500",
                  "from-orange-500 to-amber-500"
                ];
                const gradient = gradients[index % gradients.length];
                const isActive = index === activeIndex;
                
                return (
                  <div
                    key={index}
                    className={`bg-gray-800/80 backdrop-blur-sm rounded-xl overflow-hidden transition-all duration-500 border border-gray-700/50 ${
                      isActive ? 
                        'ring-2 ring-indigo-500 shadow-lg shadow-indigo-500/20 scale-[1.03] z-10' : 
                        'hover:shadow-lg hover:shadow-indigo-500/10 hover:scale-[1.02]'
                    }`}
                    style={{ 
                      transform: 'translateZ(0)',
                      willChange: 'transform, box-shadow',
                      opacity: 1,
                      animation: `testimonialFadeIn 700ms ${index * 100}ms both cubic-bezier(0.22, 1, 0.36, 1)`
                    }}
                    onMouseEnter={() => handleCardInteraction(index)}
                    onClick={() => handleCardInteraction(index)}
                  >
                    {/* Gradient top bar with animation */}
                    <div className={`h-1.5 bg-gradient-to-r ${gradient} relative overflow-hidden`}>
                      <div className="absolute inset-0 w-full h-full bg-white/20" style={{
                        transform: 'translateX(-100%)',
                        animation: isActive ? 'shimmer 2s infinite' : 'none'
                      }} />
                    </div>
                    
                    <div className="p-6">
                      {/* Improved quote icon in the background */}
                      <div className="absolute top-6 right-6 text-gray-700/10">
                        <svg width="50" height="50" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                        </svg>
                      </div>
                      
                      {/* Enhanced user profile with animation */}
                      <div className="flex items-center mb-6">
                        <div className="relative group">
                          <div className={`absolute -inset-1 rounded-full bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-30 blur-sm transition-opacity duration-300`}></div>
                          <div className="relative">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-14 h-14 rounded-full object-cover border-2 border-gray-700 bg-gray-800 transform transition-all duration-300 group-hover:scale-105"
                              style={{ objectFit: 'cover' }}
                              loading="lazy"
                            />
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-gray-800 flex items-center justify-center">
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                              </svg>
                            </div>
                          </div>
                        </div>
                        <div className="ml-4">
                          <h4 className="font-bold text-white text-lg group-hover:text-indigo-300 transition-colors duration-300">{item.name}</h4>
                          <div className="flex flex-col sm:flex-row sm:items-center">
                            <p className="text-gray-400 text-xs">{item.role}</p>
                            <span className="hidden sm:block text-gray-600 mx-2">•</span>
                            <p className="text-indigo-400 text-xs">{item.handle}</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Enhanced testimonial text with highlighting */}
                      <div className="mb-6">
                        <p className="text-gray-300 leading-relaxed relative">
                          <span className="absolute -left-2 top-0 text-indigo-500 font-bold text-2xl opacity-20">"</span>
                          <span className="relative">
                            {item.text.split(' ').map((word, i) => (
                              <span 
                                key={i} 
                                className={i % 6 === 0 ? "text-indigo-300" : ""}
                                style={{ 
                                  animation: isActive ? `wordPulse 5s infinite ${i * 0.1}s` : 'none',
                                  display: 'inline-block'
                                }}
                              >
                                {word}{' '}
                              </span>
                            ))}
                          </span>
                          <span className="absolute -right-2 bottom-0 text-indigo-500 font-bold text-2xl opacity-20">"</span>
                        </p>
                      </div>
                      
                      {/* Enhanced platform and savings info */}
                      <div className="border-t border-gray-700/50 pt-4 mt-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-${gradient.split(' ')[0].split('-')[1]}-900/40 text-${gradient.split(' ')[0].split('-')[1]}-300 border border-${gradient.split(' ')[0].split('-')[1]}-700/30`}>
                              {item.platform}
                            </span>
                          </div>
                          <div className="flex items-center text-green-400">
                            <div className="relative">
                              <div className="absolute inset-0 bg-green-500/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                              <svg className="w-4 h-4 mr-1 relative" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                              </svg>
                            </div>
                            <span className="font-medium text-sm">Saved {item.savings}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* New: Animated action button on hover */}
                      <div className="mt-5 pt-3 border-t border-gray-700/20 opacity-0 transform translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                        <button className="w-full py-2 rounded-lg bg-gradient-to-r from-transparent via-indigo-600/30 to-transparent text-indigo-300 text-sm flex items-center justify-center group-hover:from-indigo-700/20 group-hover:to-purple-700/20 transition-all duration-300">
                          Read full story
                          <svg className="w-4 h-4 ml-1 transform transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7-7 7"></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Testimonial navigation dots with enhanced animation */}
            <div className="flex justify-center mt-12 space-x-2">
              {visibleTestimonials.map((_, index) => {
                const isActive = index === activeIndex;
                
                return (
                  <button
                    key={index}
                    className={`transition-all duration-500 rounded-full relative overflow-hidden ${
                      isActive ? 
                        'w-10 h-3' : 
                        'w-3 h-3 hover:bg-gray-600'
                    }`}
                    onClick={() => handleCardInteraction(index)}
                    aria-label={`View testimonial ${index + 1}`}
                  >
                    <span className={`absolute inset-0 ${isActive ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-gray-700'}`}></span>
                    {isActive && (
                      <span className="absolute inset-0 bg-white/20" style={{
                        transform: 'translateX(-100%)',
                        animation: 'shimmer 2s infinite'
                      }}></span>
                    )}
                  </button>
                );
              })}
            </div>
            
            {/* Enhanced CTA Button with more sophisticated effects */}
            <div className="mt-16 text-center">
              <div className="inline-block relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg blur-md opacity-30 group-hover:opacity-100 transition-all duration-700"></div>
                <button
                  className="group relative px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg text-white font-medium shadow-xl overflow-hidden transform transition-all duration-500 hover:scale-105 hover:shadow-indigo-500/30 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                  style={{ transform: "translateZ(0)" }}
                >
                  {/* Shine effect */}
                  <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></span>
                  
                  {/* Border gradient */}
                  <span className="absolute inset-0 rounded-lg border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  
                  <span className="relative flex items-center justify-center">
                    Join Our Community
                    <svg className="w-5 h-5 ml-2 transform transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                    </svg>
                  </span>
                </button>
              </div>
            </div>
          </>
        )}
        
        {/* Enhanced animation styles */}
        <style jsx>{`
          @keyframes testimonialFadeIn {
            0% { 
              opacity: 0; 
              transform: translateY(30px) translateZ(0); 
            }
            100% { 
              opacity: 1; 
              transform: translateY(0) translateZ(0); 
            }
          }
          
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0) translateZ(0); }
            50% { transform: translateY(-20px) translateZ(0); }
          }
          
          @keyframes wordPulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
          }
          
          @keyframes gradientMove {
            0% { background-position: 0% 0%; }
            100% { background-position: 100% 100%; }
          }
          
          .permanent-visible {
            visibility: visible !important;
            opacity: 1 !important;
          }
        `}</style>
      </div>
    </section>
  );
};

export default TestimonialWall;