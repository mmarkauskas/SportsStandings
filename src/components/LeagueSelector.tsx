import React from 'react';

type Props = {
  selected: string;
  onChange: (league: string) => void;
};

const LeagueSelector: React.FC<Props> = ({ selected, onChange }) => {
  const leagues = ['Premier League', 'Eurobasket', 'Wimbledon'];

  return (
    <div className="flex justify-center gap-4 py-6 z-10 relative">
      {leagues.map((league) => (
        <button
          key={league}
          className={`px-6 py-2 rounded-lg font-semibold transition ${
            selected === league
              ? 'bg-blue-600 text-white'
              : 'bg-white bg-opacity-70 hover:bg-blue-100'
          }`}
          onClick={() => onChange(league)}
        >
          {league}
        </button>
      ))}
    </div>
  );
};

export default LeagueSelector;
