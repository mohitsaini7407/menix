import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import walletLogo from '../assets/wallet.png';
import bgmiBg from '../assets/bgmi-bg.jpg';
import { useAuth } from '../contexts/AuthContext';

const Wallet = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [wallet, setWallet] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.id) {
      fetch(`http://localhost:3002/users`)
        .then(res => res.json())
        .then(users => {
          const u = users.find(u => u.id === user.id);
          setWallet(u ? u.wallet : 0);
          setLoading(false);
        })
        .catch(() => {
          setWallet(0);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [user]);

  return (
    <>
      <Header title="Wallet" />
      <div 
        className="min-h-screen relative overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.8)), url(${bgmiBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Animated background overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-purple-900/20 to-blue-900/20 animate-pulse"></div>
        
        {/* Floating particles effect */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-red-500/30 rounded-full animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>

        {/* Main content */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
          {/* Wallet Card */}
          <div className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/30 max-w-md w-full relative overflow-hidden">
            {/* Card background pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-purple-500/10 rounded-3xl"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-500/20 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-500/20 to-transparent rounded-full translate-y-12 -translate-x-12"></div>
            
            {/* Content */}
            <div className="relative z-10 text-center">
              {/* Wallet Icon */}
              <div className="relative mb-6">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-red-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl border-4 border-white/30">
                  <img src={walletLogo} alt="Wallet" className="w-12 h-12 object-contain filter brightness-0 invert" />
                </div>
                {/* Glow effect */}
                <div className="absolute inset-0 w-24 h-24 mx-auto bg-gradient-to-br from-red-500 to-purple-600 rounded-full blur-xl opacity-50 animate-pulse"></div>
              </div>

              {/* Title */}
              <h1 
                className="text-4xl font-black text-white mb-6 tracking-wider"
                style={{ fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif" }}
              >
                WALLET
              </h1>

              {/* Balance Display */}
              <div className="mb-8">
                <div className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-yellow-400 to-green-400 mb-2">
                  {loading ? '...' : `₹${wallet}`}
                </div>
                <div className="text-xl text-gray-300 font-medium">Current Balance</div>
              </div>

              {/* Add Money Button */}
              <button
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-black text-xl py-4 rounded-2xl shadow-2xl border-2 border-red-500/50 uppercase tracking-widest transition-all duration-300 transform hover:scale-105 hover:shadow-red-500/25 active:scale-95"
                style={{ fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif" }}
                onClick={() => navigate('/pay')}
              >
                💰 Add Money
              </button>

              {/* Additional Info */}
              <div className="mt-6 text-center">
                <div className="text-sm text-gray-400">
                  Secure • Fast • Reliable
                </div>
              </div>
            </div>
          </div>

          {/* Bottom decorative elements */}
          <div className="mt-8 flex space-x-4">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Wallet; 