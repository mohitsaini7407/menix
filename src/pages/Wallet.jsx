import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import walletLogo from '../assets/wallet.png';
import bgmiBg from '../assets/bgmi-bg.jpg';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../utils/api';

const Wallet = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [wallet, setWallet] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWallet() {
      try {
        if (!user) {
          setLoading(false);
          return;
        }

        // Use wallet from auth if present
        if (typeof user.wallet === 'number') {
          setWallet(user.wallet);
        }

        // Attempt to fetch fresh value from API
        const users = await apiService.getUsers();
        // Match by _id or email
        const matched = Array.isArray(users)
          ? users.find((u) => u._id === user.id || u.email === user.email)
          : null;
        if (matched && typeof matched.wallet === 'number') {
          setWallet(matched.wallet);
        } else if (typeof user.wallet === 'number') {
          setWallet(user.wallet);
        } else {
          setWallet(0);
        }
      } catch (err) {
        // Fallback to user wallet or 0
        setWallet(typeof user?.wallet === 'number' ? user.wallet : 0);
      } finally {
        setLoading(false);
      }
    }

    loadWallet();
  }, [user]);

  // Auto-refresh wallet on window focus and at intervals
  useEffect(() => {
    let intervalId;
    let isUnmounted = false;

    async function refreshOnDemand() {
      if (!user || isUnmounted) return;
      try {
        const users = await apiService.getUsers();
        const matched = Array.isArray(users)
          ? users.find((u) => u._id === user.id || u.email === user.email)
          : null;
        if (matched && typeof matched.wallet === 'number') {
          setWallet(matched.wallet);
        }
      } catch (_) {
        // ignore transient errors
      }
    }

    const handleFocus = () => refreshOnDemand();
    window.addEventListener('focus', handleFocus);

    // Poll every 15s
    intervalId = setInterval(refreshOnDemand, 15000);

    return () => {
      isUnmounted = true;
      window.removeEventListener('focus', handleFocus);
      if (intervalId) clearInterval(intervalId);
    };
  }, [user]);

  return (
    <>
      <Header title="Wallet" />
      <div className="min-h-screen bg-gradient-to-b from-indigo-700 via-purple-700 to-indigo-900">
        {/* Header Card */}
        <div className="px-4 pt-6">
          <div className="rounded-3xl p-5 bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center">
                  <img src={walletLogo} alt="Wallet" className="w-6 h-6 filter brightness-0 invert" />
                </div>
                <div>
                  <div className="text-sm opacity-80">Total Balance</div>
                  <div className="text-3xl font-extrabold">{loading ? '...' : `₹${wallet}`}</div>
                </div>
              </div>
              <button
                onClick={() => navigate('/pay')}
                className="px-4 py-2 rounded-xl bg-white text-indigo-700 font-bold shadow">
                + Add Money
              </button>
            </div>
            {/* Quick actions */}
            <div className="grid grid-cols-4 gap-3 mt-4 text-center">
              <button onClick={() => navigate('/pay')} className="bg-white/10 hover:bg-white/20 rounded-2xl py-3 flex flex-col items-center">
                <span className="text-xl">⬆️</span>
                <span className="text-xs mt-1">Deposit</span>
              </button>
              <button className="bg-white/10 hover:bg-white/20 rounded-2xl py-3 flex flex-col items-center">
                <span className="text-xl">⬇️</span>
                <span className="text-xs mt-1">Withdraw</span>
              </button>
              <button className="bg-white/10 hover:bg-white/20 rounded-2xl py-3 flex flex-col items-center">
                <span className="text-xl">📤</span>
                <span className="text-xs mt-1">Transfer</span>
              </button>
              <button className="bg-white/10 hover:bg-white/20 rounded-2xl py-3 flex flex-col items-center">
                <span className="text-xl">⋯</span>
                <span className="text-xs mt-1">More</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="px-4 mt-6 grid grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl p-4 shadow border border-gray-100">
            <div className="text-xs text-gray-500">Income</div>
            <div className="text-green-600 font-extrabold text-2xl mt-1">₹552.95</div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow border border-gray-100">
            <div className="text-xs text-gray-500">Expenses</div>
            <div className="text-red-600 font-extrabold text-2xl mt-1">₹86.45</div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow border border-gray-100">
            <div className="text-xs text-gray-500">Total Bills</div>
            <div className="text-gray-900 font-extrabold text-2xl mt-1">₹53.25</div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow border border-gray-100">
            <div className="text-xs text-gray-500">Savings</div>
            <div className="text-indigo-600 font-extrabold text-2xl mt-1">₹120.99</div>
          </div>
        </div>

        {/* Transactions */}
        <div className="px-4 mt-6">
          <div className="bg-white rounded-3xl shadow border border-gray-100">
            <div className="p-4 flex items-center justify-between">
              <div className="font-bold text-gray-900">Transactions</div>
              <button className="text-xs text-indigo-600 font-semibold">View All</button>
            </div>
            <div className="divide-y">
              {[{name:'Amazon Shopping', amount:'- ₹150', time:'Today, 10:20 AM'}, {name:'UPI Add Money', amount:'+ ₹500', time:'Yesterday, 04:12 PM'}, {name:'YouTube Premium', amount:'- ₹129', time:'Mon, 12:01 PM'}].map((t, i) => (
                <div key={i} className="p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-2xl bg-gray-100 flex items-center justify-center">💳</div>
                    <div>
                      <div className="font-semibold text-gray-900">{t.name}</div>
                      <div className="text-xs text-gray-500">{t.time}</div>
                    </div>
                  </div>
                  <div className={`font-extrabold ${t.amount.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>{t.amount}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="h-10"/>
        </div>
      </div>
    </>
  );
};

export default Wallet; 