import React, { useState } from "react";

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

  return (
    <div className="shadow-container center">
      <div className="cg-popup">
        <h2 className="cg-popup__title">Create a Game</h2>

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
        <button
          type="button"
          className="cg-popup__submit"
          onClick={async () => {
            await createGame({ eventDate, players: addedPlayers });
            setCreateGamePopup({ show: false });
            refetch();
          }}
        >
          Create
        </button>
      </div>
    </div>
  );
}

export default CreateGamePopup;
