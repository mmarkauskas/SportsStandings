import React from "react";

type Props = {
  selected: string;
  onChange: (league: string) => void;
};

const LeagueSelector: React.FC<Props> = ({ selected, onChange }) => {
  const leagues = ["Premier League", "Eurobasket", "Wimbledon"];

  return (
    <div className="flex justify-center gap-3 py-6 z-10 relative">
      {leagues.map((league) => (
        <button
          key={league}
          className={`
            px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ease-in-out
            border border-gray-200/50 backdrop-blur-sm
            ${
              selected === league
                ? "bg-gray-900 text-white shadow-lg shadow-gray-900/25 border-gray-900"
                : "bg-white/80 text-gray-700 hover:bg-white hover:shadow-md hover:shadow-gray-200/50 hover:-translate-y-0.5"
            }
          `}
          onClick={() => onChange(league)}
        >
          {league}
        </button>
      ))}
    </div>
  );
};

export default LeagueSelector;
