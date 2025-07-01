import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import users, { defaultUserPic } from './users';

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
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="relative w-full max-w-md bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute left-4 top-4 bg-gray-200 rounded-full p-2 hover:bg-gray-300"
          aria-label="Back"
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-arrow-left"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
        </button>
        {/* Default Profile Picture Always Shown Above Username */}
        <img
          src={defaultUserPic}
          alt="Default Profile"
          className="rounded-full w-24 h-24 object-cover mb-2 border-4 border-gray-300 mx-auto mt-2"
          style={{ marginTop: 0 }}
        />
        {/* Username */}
        <h2 className="text-2xl font-bold mb-1 text-center">{fullUser.username || 'NA'}</h2>
        {/* Email */}
        <p className="text-gray-600 text-center">Email: {fullUser.email || 'NA'}</p>
        {/* Mobile */}
        <p className="text-gray-600 text-center">Mobile: {fullUser.mobile || 'NA'}</p>
        {/* Teams */}
        <p className="text-gray-600 text-center">Teams: {fullUser.teams ? fullUser.teams.join(', ') : 'NA'}</p>
        {/* Earnings */}  
        <p className="text-gray-600 text-center">Earnings: ${fullUser.earnings || 0}</p>
        {/* Logout Button Centered */}
        <div className="flex justify-center w-full">
          <button
            onClick={handleLogout}
            className="mt-8 px-8 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 text-lg font-semibold shadow"
            style={{ display: 'block', margin: '0 auto' }}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetails; 