import React from "react";

// Contexts
import { useGlobal } from "../../../context/Global/Global.context";
import { useAPI } from "../../../context/API/API.context";

function GamePicksButton(props) {
  const { isGenerated, gameID, refetch, players } = props;
  const { showLoading, hideLoading } = useGlobal();
  const { deleteGamePicks, generateGamePicks } = useAPI();
  const formattedPlayers = players.map((player) => ({
    playerID: player.playerID,
    type: 2, // Generate Picks for Both Categories
  }));

  return (
    <>
      {isGenerated ? (
        <button
          type="button"
          className="game-info__delete game-info__delete-picks"
          onClick={async () => {
            showLoading("Deleting All Game Picks...");
            await deleteGamePicks(gameID);
            hideLoading();
            refetch();
          }}
        >
          Delete All Game Picks
        </button>
      ) : (
        <button
          type="button"
          className="game-info__generate"
          onClick={async () => {
            showLoading("Generating Game Picks...");
            await generateGamePicks(gameID, { players: formattedPlayers });
            hideLoading();
            refetch();
          }}
        >
          Generate Game Picks
        </button>
      )}
    </>
  );
}

export default GamePicksButton;
