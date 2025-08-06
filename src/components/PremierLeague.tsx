import React, { useState, useEffect } from "react";

interface Team {
  name: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

interface Match {
  home: string;
  away: string;
  homeScore: number;
  awayScore: number;
  result: "home" | "away" | "draw";
}

const PremierLeague: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [homeTeam, setHomeTeam] = useState("");
  const [awayTeam, setAwayTeam] = useState("");
  const [homeScore, setHomeScore] = useState("");
  const [awayScore, setAwayScore] = useState("");

  useEffect(() => {
    const savedTeams = localStorage.getItem("pl_teams");
    const savedMatches = localStorage.getItem("pl_matches");

    if (savedTeams) {
      try {
        setTeams(JSON.parse(savedTeams));
      } catch (e) {
        console.error("Error while loading teams:", e);
      }
    }

    if (savedMatches) {
      try {
        setMatches(JSON.parse(savedMatches));
      } catch (e) {
        console.error("Error while loading matches:", e);
      }
    }

    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("pl_teams", JSON.stringify(teams));
    }
  }, [teams, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("pl_matches", JSON.stringify(matches));
    }
  }, [matches, isLoaded]);

  // Add a new team
  const addTeam = () => {
    const trimmedName = newTeamName.trim();
    if (!trimmedName) {
      alert("Please enter a team name.");
      return;
    }

    if (teams.find((t) => t.name.toLowerCase() === trimmedName.toLowerCase())) {
      alert("Team already exists.");
      return;
    }

    const newTeam: Team = {
      name: trimmedName,
      played: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0,
    };

    setTeams([...teams, newTeam]);
    setNewTeamName("");
  };

  const matchExists = (home: string, away: string) => {
    return matches.some(
      (m) =>
        (m.home === home && m.away === away) ||
        (m.home === away && m.away === home)
    );
  };

  const addMatchResult = () => {
    if (!homeTeam || !awayTeam) {
      alert("Please select both teams.");
      return;
    }

    if (homeTeam === awayTeam) {
      alert("Teams must be different.");
      return;
    }

    const homeScoreNum = parseInt(homeScore);
    const awayScoreNum = parseInt(awayScore);

    if (
      isNaN(homeScoreNum) ||
      isNaN(awayScoreNum) ||
      homeScoreNum < 0 ||
      awayScoreNum < 0
    ) {
      alert("Please enter valid scores (0 or greater).");
      return;
    }

    if (
      !teams.find((t) => t.name === homeTeam) ||
      !teams.find((t) => t.name === awayTeam)
    ) {
      alert("Selected teams must exist.");
      return;
    }

    if (matchExists(homeTeam, awayTeam)) {
      alert("These teams have already played.");
      return;
    }

    // Determine result
    let result: "home" | "away" | "draw";
    if (homeScoreNum > awayScoreNum) {
      result = "home";
    } else if (awayScoreNum > homeScoreNum) {
      result = "away";
    } else {
      result = "draw";
    }

    // Record match
    const newMatch: Match = {
      home: homeTeam,
      away: awayTeam,
      homeScore: homeScoreNum,
      awayScore: awayScoreNum,
      result: result,
    };

    // Update teams stats
    const updatedTeams = teams.map((team) => {
      if (team.name !== homeTeam && team.name !== awayTeam) return team;

      let updatedTeam = { ...team };
      updatedTeam.played += 1;

      if (team.name === homeTeam) {
        updatedTeam.goalsFor += homeScoreNum;
        updatedTeam.goalsAgainst += awayScoreNum;

        if (result === "home") {
          updatedTeam.wins += 1;
          updatedTeam.points += 3;
        } else if (result === "away") {
          updatedTeam.losses += 1;
        } else {
          updatedTeam.draws += 1;
          updatedTeam.points += 1;
        }
      } else if (team.name === awayTeam) {
        updatedTeam.goalsFor += awayScoreNum;
        updatedTeam.goalsAgainst += homeScoreNum;

        if (result === "away") {
          updatedTeam.wins += 1;
          updatedTeam.points += 3;
        } else if (result === "home") {
          updatedTeam.losses += 1;
        } else {
          updatedTeam.draws += 1;
          updatedTeam.points += 1;
        }
      }

      updatedTeam.goalDifference =
        updatedTeam.goalsFor - updatedTeam.goalsAgainst;
      return updatedTeam;
    });

    setMatches([...matches, newMatch]);
    setTeams(updatedTeams);

    setHomeTeam("");
    setAwayTeam("");
    setHomeScore("");
    setAwayScore("");
  };

  const sortedTeams = [...teams].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference)
      return b.goalDifference - a.goalDifference;
    if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="py-4 px-2">
      <div className="max-w-xl max-h-full mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2">
            <h1 className="text-xl font-semibold text-white">
              Premier League Tracker
            </h1>
          </div>

          {/* Add Team */}
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 mb-2">Add Team</h2>
            <div className="flex gap-3">
              <input
                type="text"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                placeholder="Enter team name"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                onKeyPress={(e) => e.key === "Enter" && addTeam()}
              />
              <button
                onClick={addTeam}
                className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Add Team
              </button>
            </div>
          </div>

          {/* Add Match Result */}
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

          {/* League Standings */}
          <div className="p-4">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              League Standings
            </h2>
            <div className="overflow-hidden border border-gray-200 rounded-lg">
              <div
                className="overflow-x-auto max-h-full"
                style={{ maxHeight: "150px" }}
              >
                <table className="w-full text-xs table-fixed">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        #
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Team
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        P
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        W
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        D
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        L
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider font-semibold">
                        Pts
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sortedTeams.length === 0 ? (
                      <tr>
                        <td
                          colSpan={7}
                          className="px-6 py-12 text-center text-gray-500"
                        >
                          <div className="text-sm">No teams added yet</div>
                          <div className="text-xs text-gray-400 mt-1">
                            Add your first team above to get started
                          </div>
                        </td>
                      </tr>
                    ) : (
                      sortedTeams.map((team, index) => (
                        <tr
                          key={team.name}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">
                            {index + 1}
                          </td>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">
                            {team.name}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700 text-center">
                            {team.played}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700 text-center">
                            {team.wins}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700 text-center">
                            {team.draws}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700 text-center">
                            {team.losses}
                          </td>
                          <td className="px-4 py-3 text-sm font-bold text-gray-900 text-center">
                            {team.points}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremierLeague;
