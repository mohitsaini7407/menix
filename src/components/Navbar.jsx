import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import logo from '../assets/logo.png';
import walletLogo from '../assets/wallet.png';
import avt1 from '../assets/avatar/avt1.png';
import avt2 from '../assets/avatar/avt2.png';
import avt3 from '../assets/avatar/avt3.png';

const avatars = [avt1, avt2, avt3];
const getProfileAvatar = (user) => {
  const key = user?.username || user?.email || '';
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = key.charCodeAt(i) + ((hash << 5) - hash);
  }
  const idx = Math.abs(hash) % avatars.length;
  return avatars[idx];
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(window.scrollY);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Move the conditional return after all hooks
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          if (currentScrollY > lastScrollY && currentScrollY > 40) {
            setShowNavbar(false); // Hide on scroll down
          } else {
            setShowNavbar(true); // Show on scroll up
          }
          setLastScrollY(currentScrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    toggleMenu();
    navigate('/login', { replace: true });
  };

  // Now check if not home page, return null
  const isHomePage = location.pathname === '/';
  if (!isHomePage) {
    return null;
  }

  return (
    <>
      {/* Horizontal Top Navbar */}
      <nav className="navbar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', width: '100%', fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif" }}>
        {/* Hamburger menu on the far left */}
        <div className="navbar-hamburger" style={{ marginRight: '16px' }}>
          <button
            onClick={toggleMenu}
            className="p-0 focus:outline-none flex-shrink-0"
            aria-label="Toggle menu"
            style={{background: 'transparent', boxShadow: 'none'}}
          >
            <svg width="28" height="28" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="25" y2="6"></line>
              <line x1="3" y1="14" x2="25" y2="14"></line>
              <line x1="3" y1="22" x2="25" y2="22"></line>
            </svg>
          </button>
        </div>

        {/* Menix logo and name centered */}
        <div className="navbar-logo" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img 
            src={logo} 
            alt="Menix Logo" 
            style={{height:48, width:48, objectFit:'contain', marginTop: '4px'}} 
            className="flex-shrink-0"
            onError={(e) => {
              console.log('Logo failed to load, using fallback');
              e.target.style.display = 'none';
            }}
          />
          <span className="text-xs text-white font-bold tracking-widest truncate max-w-[60px]" style={{ fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif" }}>Menix</span>
        </div>

        {/* Wallet icon on the far right */}
        <div className="navbar-wallet" style={{ marginLeft: '16px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
          <Link to="/wallet" title="Wallet" className="inline-flex items-center justify-center flex-shrink-0" style={{marginRight: 0}}>
            <img 
              src={walletLogo} 
              alt="Wallet" 
              style={{ width: 44, height: 44, borderRadius: '50%', boxShadow: '0 2px 8px rgba(0,0,0,0.25)', border: '2.5px solid #e40019', background: '#fff', padding: 4 }}
              onError={(e) => {
                console.log('Wallet logo failed to load');
                e.target.style.display = 'none';
              }}
            />
          </Link>
        </div>
      </nav>

      {/* Side Menu Overlay (only render when isMenuOpen) */}
      {isMenuOpen && (
        <div className={`fixed inset-0 z-50`} style={{transition: 'all 0.3s ease-in-out'}}> 
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 pointer-events-auto"
            onClick={toggleMenu}
            style={{transition: 'opacity 0.3s ease-in-out'}}
          ></div>
          {/* Side Menu - Paytm Style */}
          <div
            className={`absolute left-0 top-0 h-full bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} pointer-events-auto`}
            style={{width: '50%', minWidth: '280px', maxWidth: '350px', zIndex: 60}}
          >
            {/* Header Section with Profile */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                {user && (
                  <>
                    <img
                      src={getProfileAvatar(user)}
                      alt="Profile"
                      className="rounded-full object-cover border-3 border-white shadow-lg"
                      style={{ width: '60px', height: '60px' }}
                    />
                    <div>
                      <h3 className="text-white text-lg font-bold" style={{ fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif" }}>
                        {user.username || 'User'}
                      </h3>
                      <p className="text-red-100 text-sm" style={{ fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif" }}>
                        {user.email || user.phone || 'Welcome!'}
                      </p>
                    </div>
                  </>
                )}
              </div>
              <button
                onClick={toggleMenu}
                className="text-white hover:text-red-200 p-2 transition-colors"
                aria-label="Close menu"
              >
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            {/* Menu Items */}
            <div className="flex-1 py-4">
              <nav className="space-y-1">
                <Link 
                  to="/profile-details" 
                  className="flex items-center gap-4 px-6 py-4 text-gray-700 hover:bg-gray-50 transition-colors"
                  onClick={toggleMenu}
                  style={{ fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif" }}
                >
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                  <span className="font-medium">My Profile</span>
                </Link>
                
                <Link 
                  to="/tournaments" 
                  className="flex items-center gap-4 px-6 py-4 text-gray-700 hover:bg-gray-50 transition-colors"
                  onClick={toggleMenu}
                  style={{ fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif" }}
                >
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 11H7v9a2 2 0 002 2h6a2 2 0 002-2v-9h-2m-4 0V6a2 2 0 012-2h2a2 2 0 012 2v5m-6 0h4"/>
                  </svg>
                  <span className="font-medium">Orders</span>
                </Link>
                
                <Link 
                  to="/wallet" 
                  className="flex items-center gap-4 px-6 py-4 text-gray-700 hover:bg-gray-50 transition-colors"
                  onClick={toggleMenu}
                  style={{ fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif" }}
                >
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21 18v1a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v1M16 10h2a2 2 0 012 2v4a2 2 0 01-2 2h-2m-4-8h4a2 2 0 012 2v4a2 2 0 01-2 2h-4m0-8a2 2 0 00-2 2v4a2 2 0 002 2"/>
                  </svg>
                  <span className="font-medium">Wallet</span>
                </Link>
                
                <button 
                  className="flex items-center gap-4 px-6 py-4 text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                  onClick={handleLogout}
                  style={{ fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif" }}
                >
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16 17l5-5-5-5M19.8 12H9M10 3H5a2 2 0 00-2 2v14a2 2 0 002 2h5"/>
                  </svg>
                  <span className="font-medium">Logout</span>
                </button>
              </nav>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center" style={{ fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif" }}>
                Menix BGMI Tournaments
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar; 