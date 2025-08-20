import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import walletLogo from '../assets/wallet.png';
import { useAuth } from '../contexts/AuthContext';
import { getWallet } from '../utils/api';

const Wallet = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [walletData, setWalletData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWalletData = async () => {
      if (!user || !user.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const data = await getWallet(user.id);
        if (data.success) {
          setWalletData(data.user);
        } else {
          setError(data.error || 'Failed to fetch wallet data');
        }
      } catch (err) {
        console.error('Error fetching wallet:', err);
        setError('Network error. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchWalletData();
  }, [user]);

  if (!user) {
    return (
      <>
        <Header title="Wallet" />
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
          <div className="text-center">
            <div className="text-white text-xl mb-4">Please login to view your wallet</div>
            <button
              onClick={() => navigate('/login')}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Go to Login
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header title="Wallet" />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Main Wallet Card */}
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8 mb-8">
            <div className="flex items-center justify-center mb-8">
              <div className="bg-gradient-to-br from-red-500 to-red-600 p-4 rounded-full shadow-lg">
                <img src={walletLogo} alt="Wallet" className="w-12 h-12 object-contain" />
              </div>
            </div>
            
            <h1 className="text-4xl font-bold text-center text-white mb-2" style={{ fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif" }}>
              My Wallet
            </h1>
            <p className="text-gray-300 text-center mb-8">Manage your tournament funds</p>

            {/* Balance Display */}
            <div className="text-center mb-8">
              <div className="text-7xl font-black text-white mb-2">
                {loading ? (
                  <div className="animate-pulse">...</div>
                ) : error ? (
                  <div className="text-red-400 text-4xl">Error</div>
                ) : (
                  `₹${walletData?.wallet || 0}`
                )}
              </div>
              <div className="text-xl text-gray-300">Available Balance</div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/pay')}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold text-lg py-4 px-8 rounded-2xl shadow-lg border-2 border-red-500 uppercase tracking-wide transition-all duration-200 transform hover:scale-105 hover:shadow-xl"
                style={{ fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif" }}
              >
                💰 Add Money
              </button>
              
              <button
                onClick={() => navigate('/tournaments')}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold text-lg py-4 px-8 rounded-2xl shadow-lg border-2 border-blue-500 uppercase tracking-wide transition-all duration-200 transform hover:scale-105 hover:shadow-xl"
                style={{ fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif" }}
              >
                🏆 Join Tournament
              </button>
            </div>
          </div>

          {/* User Info Card */}
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
            <h2 className="text-2xl font-bold text-white mb-4 text-center" style={{ fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif" }}>
              Account Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="text-gray-400 text-sm mb-2">Username</div>
                <div className="text-white font-semibold text-lg">
                  {walletData?.username || user.username || 'N/A'}
                </div>
              </div>
              
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="text-gray-400 text-sm mb-2">Email</div>
                <div className="text-white font-semibold text-lg">
                  {walletData?.email || user.email || 'N/A'}
                </div>
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mt-6 bg-red-500/20 border border-red-500/50 rounded-xl p-4">
              <div className="text-red-400 text-center">
                <div className="font-semibold mb-2">⚠️ Error Loading Wallet</div>
                <div>{error}</div>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-3 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          {/* Quick Stats */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-sm rounded-2xl border border-green-500/30 p-6 text-center">
              <div className="text-3xl mb-2">🏆</div>
              <div className="text-green-400 font-semibold text-lg">Tournaments</div>
              <div className="text-white text-2xl font-bold">0</div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm rounded-2xl border border-blue-500/30 p-6 text-center">
              <div className="text-3xl mb-2">🎯</div>
              <div className="text-blue-400 font-semibold text-lg">Wins</div>
              <div className="text-white text-2xl font-bold">0</div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-sm rounded-2xl border border-purple-500/30 p-6 text-center">
              <div className="text-3xl mb-2">⭐</div>
              <div className="text-purple-400 font-semibold text-lg">Rank</div>
              <div className="text-white text-2xl font-bold">#1</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Wallet; 