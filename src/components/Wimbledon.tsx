import React, { useState, useEffect } from "react";
import { Trophy, X } from "lucide-react";

interface Player {
  name: string;
  played: number;
  wins: number;
  losses: number;
  setsWon: number;
  setsLost: number;
  points: number;
}

interface Match {
  player1: string;
  player2: string;
  player1Sets: number;
  player2Sets: number;
  winner: string;
  date: string;
}

const Wimbledon: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Modal states
  const [showAddPlayerModal, setShowAddPlayerModal] = useState(false);
  const [showAddScoreModal, setShowAddScoreModal] = useState(false);

  // Form states
  const [playerName, setPlayerName] = useState("");
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");
  const [player1Sets, setPlayer1Sets] = useState("");
  const [player2Sets, setPlayer2Sets] = useState("");

  useEffect(() => {
    const savedPlayers = localStorage.getItem("wimbledon_players");
    const savedMatches = localStorage.getItem("wimbledon_matches");

    if (savedPlayers) {
      try {
        setPlayers(JSON.parse(savedPlayers));
      } catch (e) {
        console.error("Error while loading players:", e);
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
      localStorage.setItem("wimbledon_players", JSON.stringify(players));
    }
  }, [players, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("wimbledon_matches", JSON.stringify(matches));
    }
  }, [matches, isLoaded]);

  const addPlayer = () => {
    if (!playerName.trim()) {
      alert("Please enter a player name.");
      return;
    }

    if (
      players.find((p) => p.name.toLowerCase() === playerName.toLowerCase())
    ) {
      alert("Player already exists.");
      return;
    }

    const newPlayer: Player = {
      name: playerName.trim(),
      played: 0,
      wins: 0,
      losses: 0,
      setsWon: 0,
      setsLost: 0,
      points: 0,
    };

    setPlayers([...players, newPlayer]);
    setPlayerName("");
    setShowAddPlayerModal(false);
  };

  const matchExists = (p1: string, p2: string) => {
    return matches.some(
      (m) =>
        (m.player1 === p1 && m.player2 === p2) ||
        (m.player1 === p2 && m.player2 === p1)
    );
  };

  const addMatchResult = () => {
    if (!player1 || !player2) {
      alert("Please select both players.");
      return;
    }

    if (player1 === player2) {
      alert("Players must be different.");
      return;
    }

    const p1Sets = parseInt(player1Sets);
    const p2Sets = parseInt(player2Sets);

    if (isNaN(p1Sets) || isNaN(p2Sets) || p1Sets < 0 || p2Sets < 0) {
      alert("Please enter valid set scores (0 or greater).");
      return;
    }

    if (p1Sets === p2Sets) {
      alert("Match must have a winner (different set scores).");
      return;
    }

    const player1Data = players.find((p) => p.name === player1);
    const player2Data = players.find((p) => p.name === player2);

    if (!player1Data || !player2Data) {
      alert("Selected players must exist.");
      return;
    }

    if (matchExists(player1, player2)) {
      alert("These players have already played.");
      return;
    }

    const winner = p1Sets > p2Sets ? player1 : player2;

    const newMatch: Match = {
      player1,
      player2,
      player1Sets: p1Sets,
      player2Sets: p2Sets,
      winner,
      date: new Date().toLocaleDateString(),
    };

    const updatedPlayers = players.map((player) => {
      if (player.name !== player1 && player.name !== player2) return player;

      let updatedPlayer = { ...player };
      updatedPlayer.played += 1;

      if (player.name === player1) {
        updatedPlayer.setsWon += p1Sets;
        updatedPlayer.setsLost += p2Sets;
        if (winner === player1) {
          updatedPlayer.wins += 1;
          updatedPlayer.points += 3;
        } else {
          updatedPlayer.losses += 1;
          updatedPlayer.points += 1;
        }
      } else if (player.name === player2) {
        updatedPlayer.setsWon += p2Sets;
        updatedPlayer.setsLost += p1Sets;
        if (winner === player2) {
          updatedPlayer.wins += 1;
          updatedPlayer.points += 3;
        } else {
          updatedPlayer.losses += 1;
          updatedPlayer.points += 1;
        }
      }

      return updatedPlayer;
    });

    setMatches([...matches, newMatch]);
    setPlayers(updatedPlayers);
    setPlayer1("");
    setPlayer2("");
    setPlayer1Sets("");
    setPlayer2Sets("");
    setShowAddScoreModal(false);
  };

  const sortedPlayers = [...players].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.wins !== a.wins) return b.wins - a.wins;
    const aDiff = a.setsWon - a.setsLost;
    const bDiff = b.setsWon - b.setsLost;
    if (bDiff !== aDiff) return bDiff - aDiff;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="max-w-xl mx-auto">
      <div className="rounded-2xl shadow-sm border border-slate-300 overflow-hidden bg-slate-50">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-100 border-b border-slate-200">
          <h1 className="text-xl font-bold text-slate-800 font-mono">
            Wimbledon
          </h1>
        </div>

        {/* Action Buttons */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex justify-between items-center">
            <button
              onClick={() => setShowAddPlayerModal(true)}
              className="px-4 py-2 bg-slate-700 text-white font-mono font-medium rounded-lg hover:bg-slate-800 transition-colors text-sm"
            >
              Add Player
            </button>
            <button
              onClick={() => setShowAddScoreModal(true)}
              className="px-4 py-2 bg-slate-700 text-white font-mono font-medium rounded-lg hover:bg-slate-800 transition-colors text-sm"
            >
              Add Score
            </button>
          </div>
        </div>

        {/* Standings */}
        <div className="p-6">
          <div className="overflow-hidden border border-slate-300 rounded-xl bg-white">
            <div className="overflow-x-auto" style={{ maxHeight: "250px" }}>
              <table className="w-full text-xs font-mono">
                <thead className="sticky top-0 bg-slate-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Pos
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Player
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-bold text-slate-700 uppercase tracking-wider">
                      P
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-bold text-slate-700 uppercase tracking-wider">
                      W
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-bold text-slate-700 uppercase tracking-wider">
                      L
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Pts
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {sortedPlayers.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-6 py-12 text-center text-slate-500"
                      >
                        <div className="text-sm font-mono">
                          No players added yet
                        </div>
                      </td>
                    </tr>
                  ) : (
                    sortedPlayers.map((player, index) => (
                      <tr
                        key={player.name}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-4 py-3 text-sm font-bold text-slate-600">
                          {index === 0 && (
                            <Trophy className="inline w-4 h-4 text-amber-500 mr-1" />
                          )}
                          {index + 1}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-slate-800">
                          <span className="truncate">{player.name}</span>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600 text-center">
                          {player.played}
                        </td>
                        <td className="px-4 py-3 text-sm text-center font-medium">
                          <div className="flex items-center justify-center gap-1">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                            <span className="text-slate-700">
                              {player.wins}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-center font-medium">
                          <div className="flex items-center justify-center gap-1">
                            <X className="w-3 h-3 text-red-500" />
                            <span className="text-slate-700">
                              {player.losses}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm font-bold text-slate-800 text-center">
                          {player.points}
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

      {/* Add Player Modal */}
      {showAddPlayerModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-96 mx-4 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-4 font-mono">
              Add Player
            </h3>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Enter player name..."
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none font-mono"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    addPlayer();
                  }
                }}
              />
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowAddPlayerModal(false);
                  setPlayerName("");
                }}
                className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors font-mono"
              >
                Cancel
              </button>
              <button
                onClick={addPlayer}
                disabled={!playerName.trim()}
                className="flex-1 px-4 py-3 bg-slate-700 text-white rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-mono font-medium"
              >
                Add Player
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Score Modal */}
      {showAddScoreModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-96 mx-4 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-4 font-mono">
              Add Match Result
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={player1}
                  onChange={(e) => setPlayer1(e.target.value)}
                  className="px-3 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none font-mono text-sm"
                >
                  <option value="">Player 1</option>
                  {players.map((p) => (
                    <option key={p.name} value={p.name}>
                      {p.name}
                    </option>
                  ))}
                </select>
                <select
                  value={player2}
                  onChange={(e) => setPlayer2(e.target.value)}
                  className="px-3 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none font-mono text-sm"
                >
                  <option value="">Player 2</option>
                  {players.map((p) => (
                    <option key={p.name} value={p.name}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-center gap-4">
                <div className="text-center">
                  <label className="block text-xs font-mono text-slate-600 mb-1">
                    Sets Won
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={player1Sets}
                    onChange={(e) => setPlayer1Sets(e.target.value)}
                    placeholder="0"
                    className="w-20 px-3 py-3 border border-slate-300 rounded-xl text-center focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none text-lg font-bold font-mono"
                  />
                </div>
                <span className="text-slate-400 font-mono font-bold text-lg mt-6">
                  –
                </span>
                <div className="text-center">
                  <label className="block text-xs font-mono text-slate-600 mb-1">
                    Sets Won
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={player2Sets}
                    onChange={(e) => setPlayer2Sets(e.target.value)}
                    placeholder="0"
                    className="w-20 px-3 py-3 border border-slate-300 rounded-xl text-center focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none text-lg font-bold font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowAddScoreModal(false);
                  setPlayer1("");
                  setPlayer2("");
                  setPlayer1Sets("");
                  setPlayer2Sets("");
                }}
                className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors font-mono"
              >
                Cancel
              </button>
              <button
                onClick={addMatchResult}
                className="flex-1 px-4 py-3 bg-slate-700 text-white rounded-xl hover:bg-slate-800 transition-colors font-mono font-medium"
              >
                Add Result
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wimbledon;
