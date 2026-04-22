export default function RaceList({ races, onDelete, onEdit }) {
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
                <th>Average Pace</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {races.map((race) => (
                <tr key={race._id}>
                  <td>{race.raceName}</td>
                  <td>{race.date?.split("T")[0]}</td>
                  <td>{race.distance} {race.distanceUnit}</td>
                  <td>{race.time}</td>
                  <td>{race.averagePace} {race.paceUnit}</td>
                  <td>
                    <button onClick={() => onEdit(race)}>Edit</button>
                    <button onClick={() => onDelete(race._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  }