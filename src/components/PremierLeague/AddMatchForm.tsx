import React from "react";

interface Team {
  name: string;
}

interface AddMatchFormProps {
  teams: Team[];
  homeTeam: string;
  setHomeTeam: (team: string) => void;
  awayTeam: string;
  setAwayTeam: (team: string) => void;
  homeScore: string;
  setHomeScore: (score: string) => void;
  awayScore: string;
  setAwayScore: (score: string) => void;
  addMatchResult: () => void;
}

const AddMatchForm: React.FC<AddMatchFormProps> = ({
  teams,
  homeTeam,
  setHomeTeam,
  awayTeam,
  setAwayTeam,
  homeScore,
  setHomeScore,
  awayScore,
  setAwayScore,
  addMatchResult,
}) => {
  return (
    <div className="p-4 border-b border-gray-200">
      <h2 className="text-lg font-medium text-gray-900 mb-2">
        Add Match Result
      </h2>
      <div className="space-y-4">
        {/* Dropdowns */}
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={homeTeam}
            onChange={(e) => setHomeTeam(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            <option value="">Select home team</option>
            {teams.map((t) => (
              <option key={t.name} value={t.name}>
                {t.name}
              </option>
            ))}
          </select>

          <select
            value={awayTeam}
            onChange={(e) => setAwayTeam(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            <option value="">Select away team</option>
            {teams.map((t) => (
              <option key={t.name} value={t.name}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        {/* Scores */}
        <div className="flex items-center justify-center gap-2">
          <input
            type="number"
            min="0"
            value={homeScore}
            onChange={(e) => setHomeScore(e.target.value)}
            placeholder="0"
            className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
          <span className="text-gray-600 font-medium">:</span>
          <input
            type="number"
            min="0"
            value={awayScore}
            onChange={(e) => setAwayScore(e.target.value)}
            placeholder="0"
            className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>

        {/* Submit */}
        <button
          onClick={addMatchResult}
          className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Add Result
        </button>
      </div>
    </div>
  );
};

export default AddMatchForm;
