import React, { useState } from "react";
import LeagueSelector from "./components/LeagueSelector";
import PremierLeague from "./components/PremierLeague";

const App: React.FC = () => {
  const [selectedLeague, setSelectedLeague] = useState("Premier League");

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-emerald-400/20 to-teal-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute top-3/4 left-1/6 w-64 h-64 bg-gradient-to-r from-violet-400/15 to-pink-500/15 rounded-full blur-3xl animate-pulse"></div>
      
      <LeagueSelector selected={selectedLeague} onChange={setSelectedLeague} />
      
      <div className="relative z-10">
        {selectedLeague === "Premier League" && <PremierLeague />}
      </div>
    </div>
  );
};

export default App;
