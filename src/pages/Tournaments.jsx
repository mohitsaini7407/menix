import React, { useState } from 'react';
import tournaments from './tournaments';

const getStatus = (date) => {
  const now = new Date();
  const tournamentDate = new Date(date);
  if (tournamentDate > now) return 'Upcoming';
  if (tournamentDate.toDateString() === now.toDateString()) return 'Ongoing';
  return 'Past';
};

const Tournaments = () => {
  const [filter, setFilter] = useState('All');
  const filteredTournaments = tournaments.filter(t => {
    const status = getStatus(t.date);
    return filter === 'All' || status === filter;
  });

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Tournaments</h1>
      <div className="mb-4 flex gap-2">
        {['All', 'Upcoming', 'Ongoing', 'Past'].map(f => (
          <button
            key={f}
            className={`btn ${filter === f ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>
      <div className="grid gap-4">
        {filteredTournaments.length === 0 ? (
          <p>No tournaments found.</p>
        ) : (
          filteredTournaments.map(t => (
            <div key={t.id} className="bg-gray-100 p-4 rounded shadow">
              <h2 className="text-lg font-bold">{t.name}</h2>
              <p>Date: {t.date}</p>
              <p>Location: {t.location}</p>
              <p>Prize: {t.prize}</p>
              <p>Status: {getStatus(t.date)}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Tournaments; 