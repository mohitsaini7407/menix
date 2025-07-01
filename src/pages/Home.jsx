import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTournament } from '../contexts/TournamentContext';
import TournamentCard from '../components/TournamentCard';
import CountdownTimer from '../components/CountdownTimer';
import bgmi1 from '../assets/bgmi1.jpeg';
import bgmi2 from '../assets/bgmi2.jpg';
import bgmi3 from '../assets/bgmi3.jpg';
// import bgBg from '../assets/bgmi-bg.jpg';

const sliderImages = [bgmi1, bgmi2, bgmi3];

const Home = () => {
  const { 
    getUpcomingTournaments, 
    getOngoingTournaments, 
    liveMatches,
    loading 
  } = useTournament();
  
  const [currentLiveMatch, setCurrentLiveMatch] = useState(null);
  const [current, setCurrent] = useState(0);

  const upcomingTournaments = getUpcomingTournaments();
  const ongoingTournaments = getOngoingTournaments();

  useEffect(() => {
    if (liveMatches.length > 0) {
      setCurrentLiveMatch(liveMatches[0]);
    }
  }, [liveMatches]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % sliderImages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #111111 0%, #18181b 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        paddingTop: 60,
      }}
    >
      <div style={{
        background: 'rgba(24,24,27,0.85)',
        borderRadius: 16,
        boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
        padding: 32,
        maxWidth: 420,
        width: '90vw',
        margin: '40px 0 24px 0',
        textAlign: 'center',
      }}>
        <h1 style={{ color: '#f87171', fontWeight: 900, fontSize: '2.2rem', marginBottom: 18, letterSpacing: 1 }}>Welcome to Menix BGMI Tournaments</h1>
        <div style={{ position: 'relative', width: '100%', height: 220, marginBottom: 24 }}>
          {sliderImages.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`BGMI Slide ${idx+1}`}
              style={{
                width: '100%',
                height: 220,
                objectFit: 'cover',
                borderRadius: 12,
                boxShadow: idx === current ? '0 2px 16px #b91c1c88' : 'none',
                opacity: idx === current ? 1 : 0,
                position: 'absolute',
                top: 0,
                left: 0,
                transition: 'opacity 0.7s',
                zIndex: idx === current ? 2 : 1,
              }}
            />
          ))}
          <div style={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 8 }}>
            {sliderImages.map((_, idx) => (
              <span key={idx} style={{
                width: 10, height: 10, borderRadius: '50%',
                background: idx === current ? '#b91c1c' : '#fff',
                opacity: idx === current ? 1 : 0.5,
                display: 'inline-block',
                transition: 'background 0.3s',
              }} />
            ))}
          </div>
        </div>
        <Link to="/tournaments">
          <button className="btn" style={{ width: '100%', fontSize: '1.2rem', marginTop: 12 }}>BGMI Tournament</button>
          </Link>
      </div>
    </div>
  );
};

export default Home; 