import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import RaceList from "../components/RaceList";
import RaceForm from "../components/RaceForm";
import ConfirmModal from "../components/ConfirmModal";

export default function Dashboard() {
  const navigate = useNavigate();

  const [races, setRaces] = useState([]);
  const [stats, setStats] = useState(null);
  const [showStats, setShowStats] = useState(false);
  const [editingRace, setEditingRace] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [raceToDelete, setRaceToDelete] = useState(null);

  const RACE_API_URL = "http://localhost:3000/api/races";

  useEffect(() => {
    const user = localStorage.getItem("user");

    if (!user) {
      navigate("/");
      return;
    }

    fetchRaces();
  }, []);

  const fetchRaces = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    try {
      const response = await fetch(`${RACE_API_URL}?userId=${user._id}`);
      const data = await response.json();

      setRaces(data);
      getStats(data);
    } catch (error) {
      alert("Failed to load races");
    }
  };

  const getStats = async (raceData) => {
    try {
      const response = await fetch("http://localhost:3003/stats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          activities: raceData.map((race) => ({
            title: race.raceName,
            distance: Number(race.distance),
          })),
        }),
      });

      const data = await response.json();
      setStats(data);
    } catch (error) {
      setStats(null);
    }
  };

  const sortRaces = async (sortBy) => {
    try {
      const response = await fetch("http://localhost:3002/sort", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sortBy: sortBy,
          races: races,
        }),
      });

      const sortedRaces = await response.json();
      setRaces(sortedRaces);
    } catch (error) {
      alert("Failed to sort races");
    }
  };

  const handleDelete = (raceId) => {
    setRaceToDelete(raceId);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    try {
      const response = await fetch(
        `${RACE_API_URL}/${raceToDelete}?userId=${user._id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        alert("Failed to delete race");
        return;
      }

      setShowModal(false);
      setRaceToDelete(null);
      fetchRaces();
    } catch (error) {
      alert("Error deleting race");
    }
  };

  const cancelDelete = () => {
    setShowModal(false);
    setRaceToDelete(null);
  };

  const handleEdit = (race) => {
    setEditingRace(race);
  };

  return (
    <div className="dashboard-container">
      <Header showLogout={true} />

      <RaceForm
        onRaceAdded={fetchRaces}
        editingRace={editingRace}
        setEditingRace={setEditingRace}
      />

      <RaceList
        races={races}
        onDelete={handleDelete}
        onEdit={handleEdit}
        onSort={sortRaces}
      />

      <div className="stats-section">
        <p>
          Click here to see your activity stats!{" "}
          <button onClick={() => setShowStats(!showStats)}>
            {showStats ? "Hide Stats" : "Show Stats"}
          </button>
        </p>

        {showStats && (
          <div>
            <h2>Activity Stats</h2>

            {stats ? (
              <div>
                <p>Total Distance: {stats.totalDistance}</p>
                <p>Average Distance: {stats.averageDistance.toFixed(2)}</p>
                <p>Longest Activity: {stats.longestActivity}</p>
                <p>Shortest Activity: {stats.shortestActivity}</p>
                <p>Activity Count: {stats.activityCount}</p>
              </div>
            ) : (
              <p>No stats available.</p>
            )}
          </div>
        )}
      </div>

      {showModal && (
        <ConfirmModal onConfirm={confirmDelete} onCancel={cancelDelete} />
      )}
    </div>
  );
}