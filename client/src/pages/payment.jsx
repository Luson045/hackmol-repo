import React, { useState, useEffect } from 'react';
import { Check, ArrowRight, Loader2, CreditCard } from 'lucide-react';

export default function PaymentGateway() {
  const [paymentStep, setPaymentStep] = useState('select'); // select, upi, processing, success
  const [countdown, setCountdown] = useState(3);
  const [hoverOption, setHoverOption] = useState(null); // Track which option is being hovered
  const [upiId, setUpiId] = useState('');

  // Simulate payment process when UPI payment is submitted
  const handleUpiPayment = (e) => {
    e.preventDefault();
    if (upiId.trim().length > 0) {
      setPaymentStep('processing');
      
      // Simulate processing time
      setTimeout(() => {
        setPaymentStep('success');
      }, 2000);
    }
  };

  // Countdown for redirect after successful payment
  useEffect(() => {
    if (paymentStep === 'success' && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
    
    // Redirect to dashboard when countdown reaches 0
    if (paymentStep === 'success' && countdown === 0) {
      setPaymentStep('dashboard');
    }
  }, [paymentStep, countdown]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6">
      
      {/* Common Header */}
      <div className="w-full max-w-md mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-blue-500">
          SecurePay Gateway
        </h1>
        <p className="text-slate-300">Fast, secure payments for your convenience</p>
      </div>
      
      {/* Payment Selection Screen */}
      {paymentStep === 'select' && (
        <div className="bg-slate-800/50 backdrop-blur-lg p-8 rounded-2xl border border-slate-700 w-full max-w-md shadow-xl transition-all duration-500 ease-in-out hover:shadow-emerald-500/10">
          <h2 className="text-xl font-semibold mb-6">Select Payment Method</h2>
          
          <div>
            <button 
              className={`w-full transition-all duration-500 flex items-center justify-between p-4 rounded-xl ${
                hoverOption === 'upi' 
                  ? 'bg-gradient-to-r from-emerald-900/50 to-emerald-700/30 shadow-lg shadow-emerald-500/20 border border-emerald-500/30' 
                  : 'bg-slate-700 hover:bg-slate-600 border border-transparent'
              }`}
              onClick={() => setPaymentStep('upi')}
              onMouseEnter={() => setHoverOption('upi')}
              onMouseLeave={() => setHoverOption(null)}
            >
              <div className="flex items-center">
                <div className={`p-2 rounded-lg mr-3 transition-all duration-500 ${
                  hoverOption === 'upi' 
                    ? 'bg-emerald-500/40 scale-110' 
                    : 'bg-emerald-500/20'
                }`}>
                  <CreditCard className={`transition-colors duration-500 ${
                    hoverOption === 'upi' ? 'text-emerald-300' : 'text-emerald-400'
                  }`} size={24} />
                </div>
                <span>Pay with UPI</span>
              </div>
              <ArrowRight className={`transition-all transform ${
                hoverOption === 'upi' 
                  ? 'text-white translate-x-1' 
                  : 'text-slate-400'
              }`} size={20} />
            </button>
          </div>
          
          <div className="mt-6 pt-6 border-t border-slate-700 text-sm text-slate-400 flex items-center">
            <div className="bg-emerald-500/20 p-1 rounded-full mr-2">
              <Check size={16} className="text-emerald-400" />
            </div>
            Secure payment processing
          </div>
        </div>
      )}
      
      {/* UPI ID Screen */}
      {paymentStep === 'upi' && (
        <div className="bg-slate-800/50 backdrop-blur-lg p-8 rounded-2xl border border-slate-700 w-full max-w-md shadow-xl animate-fadeIn">
          <h2 className="text-xl font-semibold mb-6">Enter UPI ID</h2>
          
          <form onSubmit={handleUpiPayment}>
            <div className="mb-6">
              <label htmlFor="upiId" className="block text-slate-300 mb-2 text-sm">
                Your UPI ID
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="upiId"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="example@upi"
                  className="w-full bg-slate-700/50 border border-slate-600 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 rounded-lg p-3 text-white outline-none transition-all duration-300"
                  required
                />
                <div className="absolute inset-0 rounded-lg pointer-events-none shadow-glow opacity-0 transition-opacity duration-300"></div>
              </div>
              <p className="mt-2 text-xs text-slate-400">
                Enter your UPI ID to complete the payment of <span className="text-emerald-400 font-semibold">$99.99</span>
              </p>
            </div>

            <div className="flex justify-between items-center space-x-4">
              <button 
                type="button"
                className="px-4 py-3 bg-slate-700 hover:bg-slate-600 transition-all duration-300 rounded-xl text-sm flex-1"
                onClick={() => setPaymentStep('select')}
              >
                Back
              </button>
              
              <button 
                type="submit"
                className="px-4 py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 transition-all duration-300 rounded-xl text-sm font-medium flex-1 shadow-lg shadow-emerald-600/20"
              >
                Pay Now
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Processing Payment */}
      {paymentStep === 'processing' && (
        <div className="bg-slate-800/50 backdrop-blur-lg p-8 rounded-2xl border border-slate-700 w-full max-w-md shadow-xl animate-fadeIn flex flex-col items-center">
          <div className="mb-6">
            <Loader2 size={48} className="text-emerald-400 animate-spin" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Processing Payment</h2>
          <p className="text-slate-300 text-center">
            Please wait while we confirm your payment...
          </p>
        </div>
      )}
      
      {/* Success Screen */}
      {paymentStep === 'success' && (
        <div className="bg-slate-800/50 backdrop-blur-lg p-8 rounded-2xl border border-emerald-500/20 w-full max-w-md shadow-xl shadow-emerald-500/10 animate-fadeIn flex flex-col items-center">
          <div className="mb-6 bg-emerald-500/20 p-4 rounded-full">
            <Check size={48} className="text-emerald-400" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Payment Successful!</h2>
          <p className="text-slate-300 text-center mb-6">
            Your transaction has been completed successfully.
          </p>
          <div className="text-sm text-slate-400">
            Redirecting to dashboard in <span className="text-emerald-400 font-bold">{countdown}</span> seconds...
          </div>
        </div>
      )}
      
      {/* Dashboard */}
      {paymentStep === 'dashboard' && (
        <div className="w-full max-w-4xl animate-fadeIn">
          <div className="bg-slate-800/50 backdrop-blur-lg p-8 rounded-2xl border border-slate-700 shadow-xl">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-blue-500">
                Welcome to Your Dashboard
              </h2>
              <div className="bg-emerald-500/20 px-3 py-1 rounded-full text-sm text-emerald-400">
                Premium User
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Dashboard Cards */}
              <div className="bg-slate-700/50 p-6 rounded-xl border border-slate-600 hover:border-emerald-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/5">
                <h3 className="font-semibold mb-2">Recent Activity</h3>
                <p className="text-slate-300 text-sm">Payment completed successfully</p>
                <p className="text-xs text-slate-400 mt-2">Just now</p>
              </div>
              
              <div className="bg-slate-700/50 p-6 rounded-xl border border-slate-600 hover:border-blue-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/5">
                <h3 className="font-semibold mb-2">Account Balance</h3>
                <p className="text-slate-300 text-sm">$1,245.00</p>
                <p className="text-xs text-slate-400 mt-2">Updated today</p>
              </div>
              
              <div className="bg-slate-700/50 p-6 rounded-xl border border-slate-600 hover:border-purple-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/5">
                <h3 className="font-semibold mb-2">Next Payment</h3>
                <p className="text-slate-300 text-sm">May 15, 2025</p>
                <p className="text-xs text-slate-400 mt-2">37 days remaining</p>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <button 
                className="bg-gradient-to-r from-emerald-500 to-blue-500 px-6 py-3 rounded-xl font-medium hover:opacity-90 transition-all duration-300 shadow-lg shadow-emerald-500/20"
                onClick={() => setPaymentStep('select')}
              >
                Return to Payment Page
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Add custom animations to style */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        
        .shadow-glow {
          box-shadow: 0 0 15px 2px rgba(52, 211, 153, 0.3);
        }
        
        input:focus + .shadow-glow {
          opacity: 0.5;
        }
      `}</style>
    </div>
  );
}