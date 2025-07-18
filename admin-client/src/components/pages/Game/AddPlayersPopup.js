import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";

// Contexts
import { useAPI } from "../../../context/API/API.context";
import { GET_PLAYERS_KEY } from "../../../context/API/QueryKeys";
import { useGlobal } from "../../../context/Global/Global.context";

// Components
import AddPlayersForm from "../../standalone/players/AddPlayersForm";
import ErrorMessage from "../../standalone/status/ErrorMessage";
import Loading from "../../standalone/status/Loading";

function AddPlayersPopup(props) {
  const { gameID, gamePlayers, closePopup, refetch } = props;
  const { getPlayers, addGamePlayer } = useAPI();
  const { showLoading, hideLoading } = useGlobal();
  const [addedPlayers, setAddedPlayers] = useState([]);
  const page = 1;
  const limit = 15;
  const recent = false;
  const { isPending, isError, error, data } = useQuery({
    queryKey: [GET_PLAYERS_KEY(limit, page, recent)],
    queryFn: async () => await getPlayers(limit, page, recent),
    retry: 3,
  });

  // Add Players to Temp List
  const addPlayer = (playerID) =>
    setAddedPlayers((curPlayers) => [...curPlayers, { playerID }]);

  // Remove Players to Temp List
  const removePlayer = (playerID) =>
    setAddedPlayers((curPlayers) =>
      [...curPlayers].filter((curPlayer) => curPlayer.playerID !== playerID)
    );

  if (isPending) {
    return <Loading message="Loading Players..." />;
  } else if (isError) {
    return (
      <div className="shadow-container center">
        <div className="ap-popup">
          <h1 className="ap-popup__title">Add Players</h1>
          <ErrorMessage message={error.message} />

          <div className="ap-popup__btns row">
            <button
              type="button"
              className="ap-popup__cancel"
              onClick={closePopup}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }
  const { players } = data.data.data;

  // Filters out players already in the game
  const filteredPlayers = players.filter((player) => {
    const isGamePlayer = gamePlayers.some(
      (gamePlayer) => gamePlayer.playerID === player.playerID
    );
    return isGamePlayer ? false : true;
  });
  return (
    <div className="shadow-container center">
      <div className="ap-popup">
        <h1 className="ap-popup__title">Add Players</h1>

        {/* Players */}
        <AddPlayersForm
          players={filteredPlayers}
          addedPlayers={addedPlayers}
          addPlayer={addPlayer}
          removePlayer={removePlayer}
        />

        {/* Form Buttons */}
        <div className="ap-popup__btns row">
          <button
            type="button"
            className="ap-popup__cancel"
            onClick={closePopup}
          >
            Cancel
          </button>
          {addedPlayers.length > 0 && (
            <button
              type="button"
              className="ap-popup__save"
              onClick={async () => {
                showLoading("Adding Players to Game...");
                await addGamePlayer(gameID, { players: [...addedPlayers] });
                closePopup();
                hideLoading();
                refetch();
              }}
            >
              Save
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default AddPlayersPopup;
