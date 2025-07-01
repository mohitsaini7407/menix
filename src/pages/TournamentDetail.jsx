import React from 'react';
import tournaments from './tournaments';

const TournamentDetail = () => {
  // For demo, show the first tournament
  const tournament = tournaments[0];

  return (
    <div className="page-container">
      <h1 className="section-title">Tournament Details</h1>
      <div className="card">
        {tournament ? (
          <>
            <h2 className="text-xl font-bold mb-2">{tournament.name}</h2>
            <p><strong>Date:</strong> {tournament.date}</p>
            <p><strong>Location:</strong> {tournament.location}</p>
            <p><strong>Prize:</strong> {tournament.prize}</p>
          </>
        ) : (
          <p>No tournament details available.</p>
        )}
      </div>
    </div>
  );
};

export default TournamentDetail; 