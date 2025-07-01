import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import logo from '../assets/logo.png';

const Navbar = () => {
  const { user } = useAuth();
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(window.scrollY);

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

  return (
    <nav className={`navbar transition-all duration-300 ${showNavbar ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} style={{marginLeft: 1, marginRight: 1}}>
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" style={{display:'flex',alignItems:'center',gap:8}}>
          <img src={logo} alt="Menix Logo" style={{height:32, width:32, objectFit:'contain', marginRight:6}} />
          <span>Menix</span>
        </Link>
        <div className="navbar-links">
          <Link to="/" className="navbar-link">Home</Link>
          <Link to="/tournaments" className="navbar-link">Tournaments</Link>
          {user ? (
            <Link to="/profile-details" className="navbar-link" title="Profile">
              <span style={{display:'inline-block',verticalAlign:'middle',marginRight:6}}>
                <svg width="22" height="22" fill="#f87171" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M12 14c-4.418 0-8 1.79-8 4v2h16v-2c0-2.21-3.582-4-8-4z"/></svg>
              </span>
              {user.identifier}
            </Link>
          ) : (
            <>
              <Link to="/login" className="navbar-link">Login</Link>
              <Link to="/signup" className="navbar-link">Signup</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 