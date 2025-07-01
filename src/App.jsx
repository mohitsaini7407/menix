import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { TournamentProvider } from './contexts/TournamentContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Tournaments from './pages/Tournaments';
import CreateTournament from './pages/CreateTournament';
import TournamentDetail from './pages/TournamentDetail';
import RegisterTeam from './pages/RegisterTeam';
import LiveMatch from './pages/LiveMatch';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProtectedRoute from './components/ProtectedRoute';
import ProfileDetails from './pages/ProfileDetails';
import React from 'react';

function App() {
  // Pull-to-refresh logic
  React.useEffect(() => {
    let startY = 0;
    let isPulling = false;
    let threshold = 80; // px
    let startScroll = 0;
    let lastTouchTime = 0;

    const onTouchStart = (e) => {
      if (window.scrollY === 0) {
        startY = e.touches[0].clientY;
        startScroll = window.scrollY;
        isPulling = true;
        lastTouchTime = Date.now();
      }
    };
    const onTouchMove = (e) => {
      if (!isPulling) return;
      const currentY = e.touches[0].clientY;
      if (currentY - startY > threshold && window.scrollY === 0) {
        window.location.reload();
        isPulling = false;
      }
    };
    const onTouchEnd = () => {
      isPulling = false;
    };
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  return (
    <AuthProvider>
      <TournamentProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            <Navbar />
            <main className="container mx-auto px-4 py-8" style={{marginLeft: 1, marginRight: 1}}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/tournaments" element={<Tournaments />} />
                <Route path="/tournament/:id" element={<TournamentDetail />} />
                <Route path="/tournament/:id/register" element={<RegisterTeam />} />
                <Route path="/tournament/:id/live" element={<LiveMatch />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route 
                  path="/admin/create" 
                  element={
                    <ProtectedRoute adminOnly>
                      <CreateTournament />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } 
                />
                <Route path="/profile-details" element={<ProfileDetails />} />
              </Routes>
            </main>
          </div>
        </Router>
      </TournamentProvider>
    </AuthProvider>
  );
}

export default App;
