import React, { useState } from 'react';
import tournaments from './tournaments';

const leaderboardData = {
  1: [
    { team: 'Alpha', points: 100 },
    { team: 'Bravo', points: 80 },
    { team: 'Charlie', points: 60 },
  ],
  2: [
    { team: 'Delta', points: 90 },
    { team: 'Echo', points: 70 },
    { team: 'Foxtrot', points: 50 },
  ],
};

const Leaderboard = () => {
  const [selectedTournament, setSelectedTournament] = useState(tournaments[0]?.id || 1);
  const data = leaderboardData[selectedTournament] || [];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Leaderboard</h1>
      <div className="mb-4">
        <label className="font-semibold mr-2">Select Tournament:</label>
        <select
          value={selectedTournament}
          onChange={e => setSelectedTournament(Number(e.target.value))}
          className="input"
        >
          {tournaments.map(t => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
      </div>
      <div className="bg-gray-100 p-4 rounded shadow">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left">Team</th>
              <th className="text-left">Points</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr><td colSpan={2}>No leaderboard data.</td></tr>
            ) : (
              data.map((row, idx) => (
                <tr key={idx}>
                  <td>{row.team}</td>
                  <td>{row.points}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard; 