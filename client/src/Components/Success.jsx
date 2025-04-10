import React, { useState, useEffect } from "react";

const testimonials = [
  {
    name: "Alex Morgan",
    handle: "@alex_token_trader",
    image: "https://i.pravatar.cc/100?img=11",
    text: "Token Flow is a game-changer! I sold my unused subscription tokens and made back nearly half of what I paid. The process was seamless and secure.",
  },
  {
    name: "Sophia Chen",
    handle: "@sophia_digital",
    image: "https://i.pravatar.cc/100?img=12",
    text: "I was able to access premium content across multiple platforms at 30% less than retail price. This marketplace is revolutionizing how we use digital tokens.",
  },
  {
    name: "Rajan Malhotra",
    handle: "@rajan_tech",
    image: "https://i.pravatar.cc/100?img=13",
    text: "From listing to selling, the entire process took less than an hour. Now I never worry about wasting subscription tokens I can't use!",
  },
  {
    name: "Emma Williams",
    handle: "@emma_content_creator",
    image: "https://i.pravatar.cc/100?img=14",
    text: "As a content creator, I love that my fans can trade tokens among themselves. It makes my premium content more accessible while still supporting my work.",
  },
  {
    name: "Michael Zhang",
    handle: "@michael_z_investor",
    image: "https://i.pravatar.cc/100?img=15",
    text: "The token verification system provides peace of mind for every transaction. I've been both a buyer and seller, and each experience has been fantastic.",
  },
  {
    name: "Priya Sharma",
    handle: "@priya_digital_nomad",
    image: "https://i.pravatar.cc/100?img=16",
    text: "Token Flow helped me save over $200 on annual subscriptions by buying tokens from others who weren't using their full allocation. Brilliant concept!",
  },
];

const TestimonialWall = () => {
  const [visibleTestimonials, setVisibleTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  // Simulate loading and progressively show testimonials
  useEffect(() => {
    setLoading(true);
    
    // Initial delay to show loader
    const initialTimer = setTimeout(() => {
      const loadSequentially = async () => {
        for (let i = 0; i < testimonials.length && i < 6; i++) {
          await new Promise(resolve => setTimeout(resolve, 300));
          setVisibleTestimonials(prev => [...prev, testimonials[i]]);
        }
        setLoading(false);
      };
      
      loadSequentially();
    }, 1200);
    
    return () => {
      clearTimeout(initialTimer);
    };
  }, []);

  // Rotate through highlighted testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % visibleTestimonials.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [visibleTestimonials.length]);
  
  return (
    <section className="py-16 px-4 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-gray-900 dark:to-indigo-900">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            What Our Users Are Saying
          </h2>
          <div className="h-1 w-24 bg-indigo-600 mx-auto rounded-full"></div>
        </div>
        
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center text-indigo-600 font-medium">
                <span className="text-sm">Loading</span>
              </div>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleTestimonials.map((item, index) => (
            <div
              key={index}
              className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform transition-all duration-500 ${
                visibleTestimonials.length === 6 ? 
                  index === activeIndex ? 
                    'scale-105 ring-2 ring-indigo-500 shadow-xl z-10' : 
                    'hover:scale-105' : 
                  'animate-fade-in-up'
              }`}
              style={{ 
                animationDelay: `${index * 0.2}s`,
                opacity: visibleTestimonials.length < 6 ? 0 : 1,
                animation: visibleTestimonials.length < 6 ? `fadeInUp 0.5s ease-out ${index * 0.2}s forwards` : ''
              }}
            >
              <div className={`h-2 ${
                index % 3 === 0 ? 'bg-indigo-500' : 
                index % 3 === 1 ? 'bg-blue-500' : 'bg-purple-500'
              }`}></div>
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="relative">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
                    />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="font-bold text-gray-900 dark:text-white text-lg">{item.name}</h4>
                    <p className="text-indigo-600 dark:text-indigo-400 text-sm">{item.handle}</p>
                  </div>
                </div>
                <div className="relative">
                  <svg className="absolute -top-2 -left-2 w-8 h-8 text-indigo-200 dark:text-indigo-800 opacity-50" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed relative z-10">
                    {item.text}
                  </p>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex space-x-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                      Verified
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      {index % 2 === 0 ? 'Buyer' : 'Seller'}
                    </span>
                  </div>
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Animation style */}
        <style jsx>{`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .animate-fade-in-up {
            animation: fadeInUp 0.5s ease-out forwards;
          }
        `}</style>
      </div>
    </section>
  );
};

export default TestimonialWall;