import React, { useState, useEffect } from "react";
import AddTeamForm from "./PremierLeague/AddTeamForm";
import AddMatchForm from "./PremierLeague/AddMatchForm";
import LeagueTable from "./PremierLeague/LeagueTable";

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
    <div className="max-w-xl px-2 max-h-full mx-auto" style={{ fontFamily: "'Roboto', sans-serif" }}>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2">
          <h1 className="text-xl font-semibold text-white" >Premier League Tracker</h1>
        </div>

        <AddTeamForm
          newTeamName={newTeamName}
          setNewTeamName={setNewTeamName}
          addTeam={addTeam}
        />

        <AddMatchForm
          teams={teams}
          homeTeam={homeTeam}
          setHomeTeam={setHomeTeam}
          awayTeam={awayTeam}
          setAwayTeam={setAwayTeam}
          homeScore={homeScore}
          setHomeScore={setHomeScore}
          awayScore={awayScore}
          setAwayScore={setAwayScore}
          addMatchResult={addMatchResult}
        />

        <div className="overflow-x-auto mb-6 p-6" style={{ maxHeight: "200px"}}>
          <table className="w-full border-collapse text-left text-gray-500">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-sm font-semibold text-gray-900">#</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-900">Team</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-900 text-center">P</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-900 text-center">W</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-900 text-center">D</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-900 text-center">L</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-900 text-center">Pts</th>
              </tr>
            </thead>
            <tbody>
              <LeagueTable teams={sortedTeams} />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PremierLeague;
