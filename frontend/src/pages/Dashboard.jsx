import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import RaceList from "../components/RaceList";
import RaceForm from "../components/RaceForm";
import ConfirmModal from "../components/ConfirmModal";

export default function Dashboard() {
  const navigate = useNavigate();
  const [races, setRaces] = useState([]);
  const [editingRace, setEditingRace] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [raceToDelete, setRaceToDelete] = useState(null);

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
      const response = await fetch(
        `http://localhost:3001/api/races?userId=${user._id}`
      );
      const data = await response.json();
      setRaces(data);
    } catch (error) {
      alert("Failed to load races");
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
        `http://localhost:3001/api/races/${raceToDelete}?userId=${user._id}`,
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

      <div>
        <RaceForm
          onRaceAdded={fetchRaces}
          editingRace={editingRace}
          setEditingRace={setEditingRace}
        />
      </div>

      <RaceList races={races} onDelete={handleDelete} onEdit={handleEdit} />

      {showModal && (
        <ConfirmModal onConfirm={confirmDelete} onCancel={cancelDelete} />
      )}
    </div>
  );
}