import React, { useState } from "react";
import LeagueSelector from "./components/LeagueSelector";
import PremierLeague from "./components/PremierLeague";
import Eurobasket from "./components/Eurobasket";
import Wimbledon from "./components/Wimbledon";

const App: React.FC = () => {
  const [selectedLeague, setSelectedLeague] = useState("Premier League");

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-gray-400/20 to-gray-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-gray-300/20 to-gray-600/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute top-3/4 left-1/6 w-64 h-64 bg-gradient-to-r from-gray-500/15 to-gray-400/15 rounded-full blur-3xl animate-pulse"></div>
      
      <LeagueSelector selected={selectedLeague} onChange={setSelectedLeague} />
      
      <div className="relative z-10">
        {selectedLeague === "Premier League" && <PremierLeague />}
        {selectedLeague === "Eurobasket" && <Eurobasket />}
        {selectedLeague === "Wimbledon" && <Wimbledon />}
      </div>
    </div>
  );
};

export default App;
