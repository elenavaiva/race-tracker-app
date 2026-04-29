import { useState } from "react";

export default function RaceList({ races, onDelete, onEdit }) {
  const [expandedRaceId, setExpandedRaceId] = useState(null);

  const toggleDetails = (raceId) => {
    if (expandedRaceId === raceId) {
      setExpandedRaceId(null);
    } else {
      setExpandedRaceId(raceId);
    }
  };

  return (
    <div className="race-list-section">
      <h2>My Races</h2>

      {races.length === 0 ? (
        <p>No races yet.</p>
      ) : (
        <table className="race-table">
          <thead>
            <tr>
              <th>Race Name</th>
              <th>Date</th>
              <th>Distance</th>
              <th>Time</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {races.map((race) => (
              <>
                <tr key={race._id}>
                  <td>{race.raceName}</td>
                  <td>{race.date?.split("T")[0]}</td>
                  <td>
                    {race.distance} {race.distanceUnit}
                  </td>
                  <td>{race.time}</td>
                  <td>
                    <button onClick={() => toggleDetails(race._id)}>
                      {expandedRaceId === race._id
                        ? "Hide Details"
                        : "More Details"}
                    </button>
                    <button onClick={() => onEdit(race)}>Edit</button>
                    <button onClick={() => onDelete(race._id)}>Delete</button>
                  </td>
                </tr>

                {expandedRaceId === race._id && (
                  <tr>
                    <td colSpan="5" className="details-row">
                      <p>
                        <strong>Average Pace:</strong>{" "}
                        {race.averagePace || "Not entered"} {race.paceUnit}
                      </p>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}