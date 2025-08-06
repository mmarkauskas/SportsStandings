import React, { useState } from 'react';
import footballVideo from './assets/videos/FootballField.mp4';
import LeagueSelector from './components/LeagueSelector';
import PremierLeague from './components/PremierLeague';

const App: React.FC = () => {
  const [selectedLeague, setSelectedLeague] = useState('Premier League');

  return (
    <div className="relative min-h-screen overflow-hidden">
      <video
        className="absolute inset-0 w-full h-full object-cover z-0"
        autoPlay
        loop
        muted
      >
        <source src={footballVideo} type="video/mp4" />
      </video>

      <LeagueSelector selected={selectedLeague} onChange={setSelectedLeague} />

      <div className="relative">
        {selectedLeague === 'Premier League' && <PremierLeague />}
      </div>
    </div>
  );
};

export default App;
