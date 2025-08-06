import React from "react";

interface Team {
  name: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  points: number;
}

interface LeagueTableProps {
  teams: Team[];
}

const LeagueTable: React.FC<LeagueTableProps> = ({ teams }) => {
  if (teams.length === 0) {
    return (
      <tr>
        <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
          <div className="text-sm">No teams added yet</div>
          <div className="text-xs text-gray-400 mt-1">
            Add your first team above to get started
          </div>
        </td>
      </tr>
    );
  }

  return (
    <>
      {teams.map((team, index) => (
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
      ))}
    </>
  );
};

export default LeagueTable;
