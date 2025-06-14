import React from "react";

function AddPlayersForm(props) {
  const { players, addedPlayers, addPlayer, removePlayer } = props;

  return (
    <div>
      {players.length > 0 ? (
        <>
          {players.map((player) => {
            const {
              playerID,
              playerInfo: { name },
            } = player;
            const alreadyAdded = addedPlayers.some(
              (addedPlayer) => addedPlayer.playerID === playerID
            );
            return (
              <div key={playerID} className="ap-popup__player between-row">
                <p className="ap-popup__player-name">{name}</p>

                {alreadyAdded ? (
                  <button
                    type="button"
                    className="ap-popup__added"
                    onClick={() => removePlayer(playerID)}
                  >
                    Added
                  </button>
                ) : (
                  <button
                    type="button"
                    className="ap-popup__add"
                    onClick={() => addPlayer(playerID)}
                  >
                    Add
                  </button>
                )}
              </div>
            );
          })}
        </>
      ) : (
        <p className="ap-popup__no-players">No Players</p>
      )}
    </div>
  );
}

export default AddPlayersForm;
