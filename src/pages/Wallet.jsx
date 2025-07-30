import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import walletLogo from '../assets/wallet.png';
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
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="bg-white/10 rounded-2xl shadow-2xl p-10 flex flex-col items-center border-4 border-white max-w-md w-full">
          <img src={walletLogo} alt="Wallet Logo" className="w-20 h-20 object-contain mb-4 drop-shadow-lg" />
          <h1 className="text-3xl font-bold text-red-500 mb-4" style={{ fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif", fontWeight: '900' }}>Wallet</h1>
          <div className="text-6xl font-extrabold text-white mb-2">
            {loading ? '...' : `₹${wallet}`}
          </div>
          <div className="text-lg text-gray-300 mb-4">Your current balance</div>
          <button
            className="w-full bg-red-700 hover:bg-red-800 text-white font-extrabold text-lg py-3 rounded-xl shadow-lg border-2 border-red-600 uppercase tracking-wide transition mb-2"
            style={{ fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif" }}
            onClick={() => navigate('/pay')}
          >
            Add Money
          </button>
        </div>
      </div>
    </>
  );
};

export default Wallet; 