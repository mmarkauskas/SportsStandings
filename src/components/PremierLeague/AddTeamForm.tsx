import React from "react";

interface AddTeamFormProps {
  newTeamName: string;
  setNewTeamName: (name: string) => void;
  addTeam: () => void;
}

const AddTeamForm: React.FC<AddTeamFormProps> = ({
  newTeamName,
  setNewTeamName,
  addTeam,
}) => {
  return (
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
  );
};

export default AddTeamForm;
