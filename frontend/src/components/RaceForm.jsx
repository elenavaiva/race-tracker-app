import { useState, useEffect } from "react";

export default function RaceForm({ onRaceAdded, editingRace, setEditingRace }) {
  const [raceName, setRaceName] = useState("");
  const [date, setDate] = useState("");
  const [distance, setDistance] = useState("");
  const [distanceUnit, setDistanceUnit] = useState("km");
  const [time, setTime] = useState("");
  const [averagePace, setAveragePace] = useState("");
  const [paceUnit, setPaceUnit] = useState("min/km");

  useEffect(() => {
    if (editingRace) {
      setRaceName(editingRace.raceName || "");
      setDate(editingRace.date ? editingRace.date.split("T")[0] : "");
      setDistance(editingRace.distance || "");
      setDistanceUnit(editingRace.distanceUnit || "km");
      setTime(editingRace.time || "");
      setAveragePace(editingRace.averagePace || "");
      setPaceUnit(editingRace.paceUnit || "min/km");
    }
  }, [editingRace]);

  const resetForm = () => {
    setRaceName("");
    setDate("");
    setDistance("");
    setDistanceUnit("km");
    setTime("");
    setAveragePace("");
    setPaceUnit("min/km");
    setEditingRace(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!raceName || !distance || !date) {
      alert("Please fill in all required fields");
      return;
    }

    if (Number(distance) <= 0) {
      alert("Distance must be greater than 0");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));

    try {
      let response;

      if (editingRace) {
        response = await fetch(`http://localhost:3001/api/races/${editingRace._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user._id,
            raceName,
            date,
            distance: Number(distance),
            distanceUnit,
            time,
            averagePace,
            paceUnit,
          }),
        });
      } else {
        response = await fetch("http://localhost:3001/api/races", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user._id,
            raceName,
            date,
            distance: Number(distance),
            distanceUnit,
            time,
            averagePace,
            paceUnit,
          }),
        });
      }

      if (!response.ok) {
        alert("Failed to save race");
        return;
      }

      resetForm();
      onRaceAdded();
    } catch (error) {
      alert("Error saving race");
    }
  };

  return (
    <div className="form-section">
      <h2>{editingRace ? "Edit Race" : "Add a Race"}</h2>
      <p className="form-description">
        Here you can add new races to your collection!
      </p>
      <p className="form-subdescription">Enter your race details below!</p>

      <form onSubmit={handleSubmit} className="form-container">
        <input
          type="text"
          placeholder="Race name *"
          value={raceName}
          onChange={(e) => setRaceName(e.target.value)}
          required
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        <div className="input-row">
          <input
            type="number"
            placeholder="Distance *"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            min="0.01"
            step="0.01"
            required
          />

          <select
            value={distanceUnit}
            onChange={(e) => setDistanceUnit(e.target.value)}
          >
            <option value="km">km</option>
            <option value="miles">miles</option>
          </select>
        </div>

        <input
          type="text"
          placeholder="Time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />

        <div className="input-row">
          <input
            type="text"
            placeholder="Average pace"
            value={averagePace}
            onChange={(e) => setAveragePace(e.target.value)}
          />

          <select
            value={paceUnit}
            onChange={(e) => setPaceUnit(e.target.value)}
          >
            <option value="min/km">min/km</option>
            <option value="min/mile">min/mile</option>
          </select>
        </div>

        <button type="submit" className="save-button">
          {editingRace ? "Update Race" : "Save Race"}
        </button>

        {editingRace && (
          <button type="button" className="cancel-button" onClick={resetForm}>
            Cancel Edit
          </button>
        )}
      </form>

      <p className="required-note">* Required fields</p>
      <p className="bottom-note">
        Note: You can edit or delete your race data later in “My Races” section.
      </p>
    </div>
  );
}