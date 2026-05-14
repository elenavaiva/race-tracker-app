import React, { useEffect, useState } from "react";

export default function RaceList({ races, onDelete, onEdit, onSort }) {
  const [expandedRaceId, setExpandedRaceId] = useState(null);
  const [labels, setLabels] = useState({});

  useEffect(() => {
    const getLabels = async () => {
      const newLabels = {};

      for (const race of races) {
        try {
          const response = await fetch("http://localhost:3004/label", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              distance: Number(race.distance),
            }),
          });

          const data = await response.json();
          newLabels[race._id] = data.label;
        } catch (error) {
          newLabels[race._id] = "Label unavailable";
        }
      }

      setLabels(newLabels);
    };

    if (races.length > 0) {
      getLabels();
    }
  }, [races]);

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

      <div className="sort-section">
        <label htmlFor="sortBy">Sort by: </label>

        <select
          id="sortBy"
          onChange={(event) => onSort(event.target.value)}
          defaultValue=""
        >
          <option value="" disabled>
            Select option
          </option>
          <option value="date">Date</option>
          <option value="distance">Distance</option>
        </select>
      </div>

      {races.length === 0 ? (
        <p>No races yet.</p>
      ) : (
        <table className="race-table">
          <thead>
            <tr>
              <th>Race Name</th>
              <th>Date</th>
              <th>Distance</th>
              <th>Activity Label</th>
              <th>Time</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {races.map((race) => (
              <React.Fragment key={race._id}>
                <tr>
                  <td>{race.raceName}</td>
                  <td>{race.date?.split("T")[0]}</td>
                  <td>
                    {race.distance} {race.distanceUnit}
                  </td>
                  <td>{labels[race._id] || "Loading..."}</td>
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
                    <td colSpan="6" className="details-row">
                      <p>
                        <strong>Average Pace:</strong>{" "}
                        {race.averagePace || "Not entered"} {race.paceUnit}
                      </p>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}