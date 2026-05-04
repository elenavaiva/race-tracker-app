import { useState, useEffect } from "react";

export default function RaceForm({ onRaceAdded, editingRace, setEditingRace }) {
  const [raceName, setRaceName] = useState("");
  const [date, setDate] = useState("");
  const [distance, setDistance] = useState("");
  const [distanceUnit, setDistanceUnit] = useState("km");
  const [time, setTime] = useState("");
  const [averagePace, setAveragePace] = useState("");
  const [paceUnit, setPaceUnit] = useState("min/km");

  const RACE_API_URL = "http://localhost:3000/api/races";
  const CONVERTER_API_URL = "http://localhost:3001/convert";

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

  const handleCommonDistanceChange = (e) => {
    const selectedDistance = e.target.value;

    if (selectedDistance === "") {
      return;
    }

    if (selectedDistance === "5k") {
      setDistance("5");
      setDistanceUnit("km");
    } else if (selectedDistance === "10k") {
      setDistance("10");
      setDistanceUnit("km");
    } else if (selectedDistance === "half") {
      setDistance("21");
      setDistanceUnit("km");
    } else if (selectedDistance === "marathon") {
      setDistance("42");
      setDistanceUnit("km");
    }
  };

  const convertDistance = async () => {
    if (!distance) {
      alert("Enter a distance first");
      return;
    }

    let fromUnit;
    let toUnit;

    if (distanceUnit === "km") {
      fromUnit = "kilometers";
      toUnit = "miles";
    } else {
      fromUnit = "miles";
      toUnit = "kilometers";
    }

    try {
      const response = await fetch(CONVERTER_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          value: Number(distance),
          fromUnit: fromUnit,
          toUnit: toUnit,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Conversion failed");
        return;
      }

      setDistance(data.convertedValue);

      if (distanceUnit === "km") {
        setDistanceUnit("miles");
        setPaceUnit("min/mile");
      } else {
        setDistanceUnit("km");
        setPaceUnit("min/km");
      }
    } catch (error) {
      alert("Could not connect to the unit converter microservice");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!raceName || !distance || !date) {
      alert("Please fill in all required fields");
      return;
    }

    if (Number(distance) < 1) {
      alert("Distance must be at least 1");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));

    try {
      let response;

      if (editingRace) {
        response = await fetch(`${RACE_API_URL}/${editingRace._id}`, {
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
        response = await fetch(RACE_API_URL, {
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

        <select onChange={handleCommonDistanceChange} defaultValue="">
          <option value="">Choose common distance</option>
          <option value="5k">5K</option>
          <option value="10k">10K</option>
          <option value="half">Half Marathon</option>
          <option value="marathon">Marathon</option>
        </select>

        <div className="input-row">
          <input
            type="number"
            placeholder="Or type distance manually *"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            min="1"
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

        <button type="button" onClick={convertDistance}>
          Convert Distance
        </button>

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