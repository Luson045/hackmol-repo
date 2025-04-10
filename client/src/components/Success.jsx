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

  // Optimized loading with reduced timeouts
  useEffect(() => {
    // Preload images for smoother experience
    testimonials.forEach(item => {
      const img = new Image();
      img.src = item.image;
    });
    
    // Shorter initial delay and faster loading
    const initialTimer = setTimeout(() => {
      setVisibleTestimonials(testimonials);
      setLoading(false);
    }, 800);
    
    return () => {
      clearTimeout(initialTimer);
    };
  }, []);

  // Rotate through highlighted testimonials
  useEffect(() => {
    if (!loading && visibleTestimonials.length > 0) {
      const interval = setInterval(() => {
        setActiveIndex(prev => (prev + 1) % visibleTestimonials.length);
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [loading, visibleTestimonials.length]);
  
  return (
    <section 
      className="py-20 px-4 bg-gradient-to-br from-black via-gray-900 to-black relative z-10 content-section"
      ref={containerRef}
    >
      {/* Enhanced grid pattern background */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `
          linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px',
        maskImage: 'radial-gradient(circle at center, black, transparent 80%)'
      }} />
      
      {/* Background accent circles */}
      <div className="absolute left-1/4 top-1/4 w-64 h-64 rounded-full blur-3xl opacity-10" style={{
        background: 'radial-gradient(circle at center, rgba(120, 120, 255, 0.3) 0%, transparent 70%)',
        transform: 'translateZ(0)'
      }} />
      <div className="absolute right-1/4 bottom-1/3 w-64 h-64 rounded-full blur-3xl opacity-10" style={{
        background: 'radial-gradient(circle at center, rgba(180, 120, 255, 0.3) 0%, transparent 70%)',
        transform: 'translateZ(0)'
      }} />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 permanent-visible">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400">
              What Our Users Are Saying
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            Join thousands of satisfied users who are maximizing their AI subscriptions through our platform
          </p>
          <div className="h-1 w-32 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 mx-auto rounded-full"></div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-gray-700 border-t-indigo-500 border-r-purple-500 rounded-full animate-spin" style={{ animationDuration: '1s' }}></div>
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
                
                return (
                  <div
                    key={index}
                    className={`bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden transition-all duration-300 border border-gray-700/50 permanent-visible ${
                      index === activeIndex ? 
                        'ring-2 ring-indigo-500 shadow-lg shadow-indigo-500/10 scale-[1.03] z-10' : 
                        'hover:shadow-lg hover:shadow-indigo-500/5 hover:scale-[1.01]'
                    }`}
                    style={{ 
                      transform: 'translateZ(0)',
                      willChange: 'transform, box-shadow',
                      opacity: 1,
                      animation: `testimonialFadeIn 500ms ${index * 100}ms both ease-out`
                    }}
                  >
                    {/* Gradient top bar */}
                    <div className={`h-1.5 bg-gradient-to-r ${gradient}`}></div>
                    
                    <div className="p-6">
                      {/* Quote icon in the background */}
                      <div className="absolute top-6 right-6 text-gray-700/20">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                        </svg>
                      </div>
                      
                      {/* User profile */}
                      <div className="flex items-center mb-6">
                        <div className="relative">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-14 h-14 rounded-full object-cover border-2 border-gray-700 bg-gray-800"
                            style={{ objectFit: 'cover' }}
                            loading="lazy"
                          />
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-gray-800 flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                            </svg>
                          </div>
                        </div>
                        <div className="ml-4">
                          <h4 className="font-bold text-white text-lg permanent-visible">{item.name}</h4>
                          <div className="flex flex-col sm:flex-row sm:items-center">
                            <p className="text-gray-400 text-xs">{item.role}</p>
                            <span className="hidden sm:block text-gray-600 mx-2">•</span>
                            <p className="text-indigo-400 text-xs">{item.handle}</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Testimonial text */}
                      <div className="mb-6">
                        <p className="text-gray-300 leading-relaxed relative permanent-visible">
                          "{item.text}"
                        </p>
                      </div>
                      
                      {/* Platform and savings info */}
                      <div className="border-t border-gray-700/50 pt-4 mt-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${gradient.split(' ')[0].split('-')[1]}-900/30 text-${gradient.split(' ')[0].split('-')[1]}-300`}>
                              {item.platform}
                            </span>
                          </div>
                          <div className="flex items-center text-green-400">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            <span className="font-medium text-sm">Saved {item.savings}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Testimonial navigation dots */}
            <div className="flex justify-center mt-10 space-x-2">
              {visibleTestimonials.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === activeIndex ? 
                      'bg-indigo-500 w-6' : 
                      'bg-gray-700 hover:bg-gray-600'
                  }`}
                  onClick={() => setActiveIndex(index)}
                  aria-label={`View testimonial ${index + 1}`}
                />
              ))}
            </div>
            
            {/* CTA Button */}
            <div className="mt-12 text-center">
              <button
                className="group relative px-6 py-3 text-white font-medium overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-indigo-500/20"
                style={{ transform: "translateZ(0)" }}
              >
                <div className="absolute inset-0 w-0 bg-white opacity-20 group-hover:w-full transition-all duration-300 ease-out" />
                <span className="relative flex items-center justify-center">
                  Join Our Community
                  <svg className="w-5 h-5 ml-2 transform transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                  </svg>
                </span>
              </button>
            </div>
          </>
        )}
        
        {/* Optimized animation styles */}
        <style jsx>{`
          @keyframes testimonialFadeIn {
            from { 
              opacity: 0; 
              transform: translateY(20px) translateZ(0); 
            }
            to { 
              opacity: 1; 
              transform: translateY(0) translateZ(0); 
            }
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