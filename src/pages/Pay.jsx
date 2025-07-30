import React from 'react';
import Header from '../components/Header';

const Pay = () => {
  return (
    <>
      <Header title="Pay" />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
        <h1 className="text-3xl font-bold text-purple-600 mb-6" style={{ fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif", fontWeight: '900' }}>Pay with PhonePe</h1>
        <div className="bg-white rounded-full p-8 shadow-lg flex items-center justify-center">
          {/* Placeholder for PhonePe logo */}
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="60" cy="60" r="60" fill="#5F259F"/>
            <text x="50%" y="50%" textAnchor="middle" dy=".3em" fontSize="40" fill="white" fontFamily="Arial">P</text>
          </svg>
        </div>
        <p className="mt-6 text-lg text-gray-200">This is a placeholder for the PhonePe logo.</p>
      </div>
    </>
  );
};

export default Pay; 