"use client";

import React, { useState, useEffect } from "react";

interface Team {
  name: string;
  played: number;
  wins: number;
  losses: number;
  pointsFor: number;
  pointsAgainst: number;
  pointsDifference: number;
  points: number;
  flag?: string;
  code?: string;
}

interface Match {
  home: string;
  away: string;
  homeScore: number;
  awayScore: number;
  result: "home" | "away";
  date: string;
  homeFlag?: string;
  awayFlag?: string;
}

interface EurobasketTeam {
  name: string;
  flag: string;
}

const Eurobasket: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [eurobasketTeams, setEurobasketTeams] = useState<EurobasketTeam[]>([]);
  const [loadingTeams, setLoadingTeams] = useState(false);

  const [showAddTeamModal, setShowAddTeamModal] = useState(false);
  const [showAddScoreModal, setShowAddScoreModal] = useState(false);

  const [selectedEurobasketTeam, setSelectedEurobasketTeam] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [homeTeam, setHomeTeam] = useState("");
  const [awayTeam, setAwayTeam] = useState("");
  const [homeScore, setHomeScore] = useState("");
  const [awayScore, setAwayScore] = useState("");

  // Mock'as eurobasket teams
  const mockEurobasketTeams: EurobasketTeam[] = [
    { name: "Spain", flag: "🇪🇸" },
    { name: "France", flag: "🇫🇷" },
    { name: "Germany", flag: "🇩🇪" },
    { name: "Italy", flag: "🇮🇹" },
    { name: "Greece", flag: "🇬🇷" },
    { name: "Serbia", flag: "🇷🇸" },
    { name: "Slovenia", flag: "🇸🇮" },
    { name: "Lithuania", flag: "🇱🇹" },
    { name: "Turkey", flag: "🇹🇷" },
    { name: "Poland", flag: "🇵🇱" },
    { name: "Czech Republic", flag: "🇨🇿" },
    { name: "Finland", flag: "🇫🇮" },
    { name: "Croatia", flag: "🇭🇷" },
    { name: "Latvia", flag: "🇱🇻" },
    { name: "Estonia", flag: "🇪🇪" },
    { name: "Montenegro", flag: "🇲🇪" },
    { name: "Ukraine", flag: "🇺🇦" },
    { name: "Georgia", flag: "🇬🇪" },
    { name: "Netherlands", flag: "🇳🇱" },
    { name: "Belgium", flag: "🇧🇪" },
    { name: "Israel", flag: "🇮🇱" },
    { name: "Hungary", flag: "🇭🇺" },
    { name: "Bosnia and Herzegovina", flag: "🇧🇦" },
    { name: "North Macedonia", flag: "🇲🇰" },
  ];

  useEffect(() => {
    const savedTeams = localStorage.getItem("eurobasket_teams");
    const savedMatches = localStorage.getItem("eurobasket_matches");

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
      localStorage.setItem("eurobasket_teams", JSON.stringify(teams));
    }
  }, [teams, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("eurobasket_matches", JSON.stringify(matches));
    }
  }, [matches, isLoaded]);

  const fetchEurobasketTeams = async () => {
    setLoadingTeams(true);
    try {
      setEurobasketTeams(mockEurobasketTeams);
    } catch (error) {
      console.error("Error fetching teams:", error);
    } finally {
      setLoadingTeams(false);
    }
  };

  useEffect(() => {
    if (showAddTeamModal && eurobasketTeams.length === 0) {
      fetchEurobasketTeams();
    }
  }, [showAddTeamModal]);

  // Filter based on search
  const filteredTeams = eurobasketTeams.filter((team) =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedTeamData = eurobasketTeams.find(
    (team) => team.name === selectedEurobasketTeam
  );

  const addTeam = () => {
    if (!selectedEurobasketTeam) {
      alert("Please select a team.");
      return;
    }

    const euroTeam = eurobasketTeams.find(
      (t) => t.name === selectedEurobasketTeam
    );
    if (!euroTeam) {
      alert("Selected team not found.");
      return;
    }

    if (
      teams.find((t) => t.name.toLowerCase() === euroTeam.name.toLowerCase())
    ) {
      alert("Team already exists.");
      return;
    }

    const newTeam: Team = {
      name: euroTeam.name,
      played: 0,
      wins: 0,
      losses: 0,
      pointsFor: 0,
      pointsAgainst: 0,
      pointsDifference: 0,
      points: 0,
      flag: euroTeam.flag,
    };

    setTeams([...teams, newTeam]);
    setSelectedEurobasketTeam("");
    setSearchTerm("");
    setIsDropdownOpen(false);
    setShowAddTeamModal(false);
  };

  const handleTeamSelect = (team: EurobasketTeam) => {
    setSelectedEurobasketTeam(team.name);
    setSearchTerm(team.name);
    setIsDropdownOpen(false);
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

    const homeTeamData = teams.find((t) => t.name === homeTeam);
    const awayTeamData = teams.find((t) => t.name === awayTeam);

    if (!homeTeamData || !awayTeamData) {
      alert("Selected teams must exist.");
      return;
    }

    if (matchExists(homeTeam, awayTeam)) {
      alert("These teams have already played.");
      return;
    }

    let result: "home" | "away";
    if (homeScoreNum > awayScoreNum) {
      result = "home";
    } else {
      result = "away";
    }

    const newMatch: Match = {
      home: homeTeam,
      away: awayTeam,
      homeScore: homeScoreNum,
      awayScore: awayScoreNum,
      result: result,
      date: new Date().toLocaleDateString(),
      homeFlag: homeTeamData.flag,
      awayFlag: awayTeamData.flag,
    };

    const updatedTeams = teams.map((team) => {
      if (team.name !== homeTeam && team.name !== awayTeam) return team;

      let updatedTeam = { ...team };
      updatedTeam.played += 1;

      if (team.name === homeTeam) {
        updatedTeam.pointsFor += homeScoreNum;
        updatedTeam.pointsAgainst += awayScoreNum;
        if (result === "home") {
          updatedTeam.wins += 1;
          updatedTeam.points += 2;
        } else {
          updatedTeam.losses += 1;
          updatedTeam.points += 1;
        }
      } else if (team.name === awayTeam) {
        updatedTeam.pointsFor += awayScoreNum;
        updatedTeam.pointsAgainst += homeScoreNum;
        if (result === "away") {
          updatedTeam.wins += 1;
          updatedTeam.points += 2;
        } else {
          updatedTeam.losses += 1;
          updatedTeam.points += 1;
        }
      }

      updatedTeam.pointsDifference =
        updatedTeam.pointsFor - updatedTeam.pointsAgainst;
      return updatedTeam;
    });

    setMatches([...matches, newMatch]);
    setTeams(updatedTeams);
    setHomeTeam("");
    setAwayTeam("");
    setHomeScore("");
    setAwayScore("");
    setShowAddScoreModal(false);
  };

  const sortedTeams = [...teams].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.pointsDifference !== a.pointsDifference)
      return b.pointsDifference - a.pointsDifference;
    if (b.pointsFor !== a.pointsFor) return b.pointsFor - a.pointsFor;
    return a.name.localeCompare(b.name);
  });

  const recentMatches = [...matches].reverse().slice(0, 2);

  return (
    <div className="max-w-xl mx-auto" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      <div
        className="rounded-2xl shadow-sm border border-green-600 overflow-hidden"
        style={{ backgroundColor: "#1a4d3a" }}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-green-700/30" style={{ backgroundColor: "#1a4d3a" }}>
          <h1 className="text-xl font-semibold text-white">Eurobasket</h1>
        </div>

        {/* Action Buttons */}
        <div className="p-6 border-b border-green-700/30">
          <div className="flex justify-between items-center">
            <button
              onClick={() => setShowAddTeamModal(true)}
              className="px-3 py-2 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors text-sm"
            >
              Add Team
            </button>
            <button
              onClick={() => setShowAddScoreModal(true)}
              className="px-3 py-2 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors text-sm"
            >
              Add Score
            </button>
          </div>
        </div>

        {/* Recent Matches */}
        <div className="p-6 border-b border-green-700/30">
          <div className="space-y-3">
            {recentMatches.length === 0 ? (
              <div className="text-center text-green-200 py-8">
                <div className="text-sm">No matches yet</div>
              </div>
            ) : (
              recentMatches.map((match, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-green-800/20 rounded-xl border border-green-700/30"
                >
                  <div className="flex items-center gap-4 w-full">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <span className="text-lg">{match.homeFlag}</span>
                      <span className="text-sm font-medium text-white truncate">
                        {match.home}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-green-900/50 rounded-lg">
                      <span className="text-lg font-semibold text-white">
                        {match.homeScore}
                      </span>
                      <span className="text-orange-300">–</span>
                      <span className="text-lg font-semibold text-white">
                        {match.awayScore}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 min-w-0 flex-1 justify-end">
                      <span className="text-sm font-medium text-white truncate">
                        {match.away}
                      </span>
                      <span className="text-lg">{match.awayFlag}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Standings */}
        <div className="p-6">
          <div
            className="overflow-hidden border border-gray-800 rounded-xl"
            style={{ backgroundColor: "#0f2419" }}
          >
            <div className="overflow-x-auto" style={{ maxHeight: "250px" }}>
              <table className="w-full text-xs">
                <thead
                  className="sticky top-0"
                  style={{ backgroundColor: "#0f2419" }}
                >
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Pos
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Team
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                      P
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                      P
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                      W
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                      L
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-orange-300 uppercase tracking-wider font-semibold">
                      Pts
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700 ">
                  {sortedTeams.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-6 py-12 text-center text-gray-300"
                      >
                        <div className="text-sm">No teams added yet</div>
                      </td>
                    </tr>
                  ) : (
                    sortedTeams.map((team, index) => (
                      <tr
                        key={team.name}
                        className="hover:bg-gray-800/50 transition-colors"
                      >
                        <td className="px-4 py-3 text-sm font-medium text-orange-300">
                          {index + 1}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-white">
                          <div className="flex items-center gap-2">
                            <span className="text-base">{team.flag}</span>
                            <span className="truncate">{team.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-300 text-center">
                          {team.played}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-300 text-center">
                          {team.played}
                        </td>
                        <td className="px-4 py-3 text-sm text-green-400 text-center font-medium">
                          {team.wins}
                        </td>
                        <td className="px-4 py-3 text-sm text-orange-300 text-center font-medium">
                          {team.losses}
                        </td>
                        <td className="px-4 py-3 text-sm font-semibold text-orange-300 text-center">
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

      {/* Add Team Modal */}
      {showAddTeamModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-96 mx-4 shadow-xl">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">
              Add EuroBasket Team
            </h3>

            {loadingTeams ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-sm text-neutral-600">Loading teams...</div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Search Input with Dropdown */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search and select a team..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setIsDropdownOpen(true);
                      if (!e.target.value) {
                        setSelectedEurobasketTeam("");
                      }
                    }}
                    onFocus={() => setIsDropdownOpen(true)}
                    className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                    autoFocus
                  />

                  {/* Selected team flag display */}
                  {selectedTeamData && searchTerm === selectedTeamData.name && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <span className="text-xl">{selectedTeamData.flag}</span>
                    </div>
                  )}

                  {/* Dropdown Results */}
                  {isDropdownOpen && searchTerm && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-neutral-200 rounded-xl shadow-lg z-10 max-h-48 overflow-y-auto">
                      {filteredTeams.length === 0 ? (
                        <div className="p-3 text-center text-neutral-500 text-sm">
                          No teams found
                        </div>
                      ) : (
                        filteredTeams.map((team) => (
                          <div
                            key={team.name}
                            className="flex items-center gap-3 p-3 cursor-pointer hover:bg-neutral-50 border-b border-neutral-50 last:border-b-0"
                            onClick={() => handleTeamSelect(team)}
                          >
                            <span className="text-xl">{team.flag}</span>
                            <span className="font-medium text-neutral-900">
                              {team.name}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowAddTeamModal(false);
                  setSelectedEurobasketTeam("");
                  setSearchTerm("");
                  setIsDropdownOpen(false);
                }}
                className="flex-1 px-4 py-3 border border-neutral-200 text-neutral-700 rounded-xl hover:bg-neutral-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={addTeam}
                disabled={!selectedEurobasketTeam || loadingTeams}
                className="flex-1 px-4 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Team
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Score Modal */}
      {showAddScoreModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-96 mx-4 shadow-xl">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">
              Add Score
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={homeTeam}
                  onChange={(e) => setHomeTeam(e.target.value)}
                  className="px-3 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                >
                  <option value="">Home team</option>
                  {teams.map((t) => (
                    <option key={t.name} value={t.name}>
                      {t.flag} {t.name}
                    </option>
                  ))}
                </select>
                <select
                  value={awayTeam}
                  onChange={(e) => setAwayTeam(e.target.value)}
                  className="px-3 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                >
                  <option value="">Away team</option>
                  {teams.map((t) => (
                    <option key={t.name} value={t.name}>
                      {t.flag} {t.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-center gap-4">
                <input
                  type="number"
                  min="0"
                  value={homeScore}
                  onChange={(e) => setHomeScore(e.target.value)}
                  placeholder="0"
                  className="w-20 px-3 py-3 border border-neutral-200 rounded-xl text-center focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-lg font-semibold"
                />
                <span className="text-neutral-400 font-medium">–</span>
                <input
                  type="number"
                  min="0"
                  value={awayScore}
                  onChange={(e) => setAwayScore(e.target.value)}
                  placeholder="0"
                  className="w-20 px-3 py-3 border border-neutral-200 rounded-xl text-center focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-lg font-semibold"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowAddScoreModal(false);
                  setHomeTeam("");
                  setAwayTeam("");
                  setHomeScore("");
                  setAwayScore("");
                }}
                className="flex-1 px-4 py-3 border border-neutral-200 text-neutral-700 rounded-xl hover:bg-neutral-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={addMatchResult}
                className="flex-1 px-4 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Eurobasket;
