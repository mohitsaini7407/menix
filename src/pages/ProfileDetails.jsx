import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import avt1 from '../assets/avatar/avt1.png';
import avt2 from '../assets/avatar/avt2.png';
import avt3 from '../assets/avatar/avt3.png';
import users, { defaultUserPic } from './users';

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

const ProfileDetails = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Find the full user object from users.js if only username/email is stored in auth
  const fullUser = user
    ? users.find(
        u =>
          u.username === user.username ||
          u.email === user.email
      ) || user
    : null;

  if (!fullUser) return <div className="text-center mt-8">No user data found.</div>;

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]" style={{ fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif" }}>
      <div className="relative w-full max-w-md bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute left-4 top-4 bg-gray-200 rounded-full p-2 hover:bg-gray-300"
          aria-label="Back"
          style={{ marginRight: '16px' }}
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-arrow-left"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
        </button>
        {/* Avatar */}
        <img
          src={getProfileAvatar(fullUser)}
          alt="Profile Avatar"
          className="rounded-full object-cover mb-4 border-4 border-gray-300 mx-auto mt-4"
          style={{ width: '100px', height: '100px', borderRadius: '100px', marginTop: '16px' }}
        />
        {/* Username */}
        <h2 className="text-2xl font-bold mb-3 text-center" style={{ fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif", fontWeight: '900' }}>{fullUser.username || 'NA'}</h2>
        {/* Email */}
        <p className="text-gray-600 text-center mb-2" style={{ fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif" }}>Email: {fullUser.email || 'NA'}</p>
        {/* Mobile */}
        {fullUser.mobile && <p className="text-gray-600 text-center mb-4" style={{ fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif" }}>Mobile: {fullUser.mobile}</p>}
        {/* Teams */}
        {fullUser.teams && (
          <div className="mt-4 w-full">
            <h3 className="font-semibold mb-2" style={{ fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif" }}>Teams:</h3>
            <ul className="list-disc list-inside text-gray-700" style={{ fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif" }}>
              {fullUser.teams.map((team, idx) => (
                <li key={idx}>{team}</li>
              ))}
            </ul>
          </div>
        )}
        {/* Earnings */}  
        {fullUser.earnings && (
          <div className="mt-4 w-full">
            <h3 className="font-semibold mb-2" style={{ fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif" }}>Earnings:</h3>
            <p className="text-green-600 font-bold" style={{ fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif" }}>₹{fullUser.earnings}</p>
          </div>
        )}
        {/* Past Tournaments */}
        {fullUser.pastTournaments && (
          <div className="mt-4 w-full">
            <h3 className="font-semibold mb-2" style={{ fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif" }}>Past Tournaments:</h3>
            <ul className="list-disc list-inside text-gray-700" style={{ fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif" }}>
              {fullUser.pastTournaments.map((t, idx) => (
                <li key={idx}>{t.name} - {t.result} ({t.prize})</li>
              ))}
            </ul>
          </div>
        )}
        {/* Logout Button */}
          <button
            onClick={handleLogout}
          className="mt-6 bg-red-500 text-white px-6 py-2 rounded-lg font-bold hover:bg-red-700"
          style={{ fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif" }}
          >
            Logout
          </button>
      </div>
    </div>
  );
};

export default ProfileDetails; 