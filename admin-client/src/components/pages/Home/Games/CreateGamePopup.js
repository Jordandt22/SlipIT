import React, { useState } from "react";

// Misc
import { getListOfSports } from "../../../../misc/Sports";

// Contexts
import { useAPI } from "../../../../context/API/API.context";

// Components
import AddPlayersInput from "./AddPlayersInput";
import DatePicker from "../../../standalone/DatePicker";

function CreateGamePopup(props) {
  const { setCreateGamePopup, refetch } = props;
  const [eventDate, setDateChange] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [addedPlayers, setAddedPlayers] = useState([]);
  const { createGame } = useAPI();
  const [gameName, setGameName] = useState("Game 1");
  const [sportName, setSportName] = useState("blitzball");
  const sports = getListOfSports();

  return (
    <div className="shadow-container center">
      <div className="cg-popup">
        <h2 className="cg-popup__title">Create a Game</h2>

        {/* Name */}
        <div className="cg-popup__box">
          <label className="cg-popup__label">Game Name</label>
          <input
            type="text"
            name="name"
            value={gameName}
            onChange={(e) => setGameName(e.target.value)}
            placeholder="Create a name for this game..."
            className="cg-popup__input"
          />
        </div>

        {/* Sport */}
        <div className="cg-popup__box">
          <label className="cg-popup__label">Sport</label>
          <select
            name="sport"
            value={sportName}
            onChange={(e) => setSportName(e.target.value)}
            className="cg-popup__dropdown"
          >
            {sports.map((sport) => {
              return (
                <option key={sport + "-dropdown-opt"} value={sport}>
                  {sport}
                </option>
              );
            })}
          </select>
        </div>

        {/* Event Date */}
        <div className="cg-popup__box">
          <label className="cg-popup__label">Event Date</label>
          <button
            className="cg-popup__date-btn"
            onClick={() => setShowCalendar(!showCalendar)}
          >
            {showCalendar ? "Close" : "Open"} Calendar
          </button>
          {showCalendar && (
            <DatePicker
              value={eventDate}
              onChange={(date) => setDateChange(date)}
            />
          )}
        </div>
        {/* Players */}
        {!showCalendar && (
          <div className="cg-popup__box">
            <label className="cg-popup__label">Add Players</label>
            <AddPlayersInput
              addedPlayers={addedPlayers}
              setAddedPlayers={setAddedPlayers}
            />
          </div>
        )}
        {/* Submit Btn */}
        {addedPlayers.length > 0 && (
          <button
            type="button"
            className="cg-popup__submit"
            onClick={async () => {
              await createGame({
                name: gameName,
                eventDate,
                players: addedPlayers,
                sport: {
                  name: sportName
                }
              });
              setCreateGamePopup({ show: false });
              refetch();
            }}
          >
            Create
          </button>
        )}
        <button
          type="button"
          className="cg-popup__cancel"
          onClick={() => {
            setCreateGamePopup({ show: false });
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default CreateGamePopup;
