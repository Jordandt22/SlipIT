import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

// Contexts
import { GET_GAME_KEY } from "../../../context/API/QueryKeys";
import { useAPI } from "../../../context/API/API.context";

// Components
import GameStatus from "./GameStatus";
import AddPlayersPopup from "./AddPlayersPopup";
import ErrorMessage from "../../standalone/status/ErrorMessage";
import Loading from "../../standalone/status/Loading";
import DeleteGamePopup from "./DeleteGamePopup";
import GamePicks from "./GamePicks";
import GamePicksButton from "./GamePicksButton";

function Game() {
  const { gameID } = useParams();
  const { getGame } = useAPI();
  const [playersPopup, setPlayersPopup] = useState({
    show: false,
  });
  const [deletePopup, setDeletePopup] = useState({
    show: false,
  });
  const { isPending, isError, error, data, refetch } = useQuery({
    queryKey: [GET_GAME_KEY(gameID)],
    queryFn: async () => await getGame(gameID),
    retry: 3,
  });

  if (isPending) {
    return <Loading message="Loading Game Data..." />;
  } else if (isError) {
    return <ErrorMessage message={error.message} />;
  }

  const game = data.data.data.game;
  const {
    name,
    eventDate,
    players,
    status,
    sport,
    picksData: { totalPicks, isGenerated },
  } = game;
  const formattedDate = new Date(eventDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <div className="game-container">
      <h2 className="game-container__title">
        {name} <span>({sport.name})</span>
      </h2>
      <p className="game-info__info">
        Game ID: <span>{gameID}</span>
      </p>
      <p className="game-info__info">
        Date: <span>{formattedDate}</span>
      </p>
      {status === 0 ? (
        <p className="game-info__info">
          Status: <span className="status-0">Not Started</span>
        </p>
      ) : status === 1 ? (
        <p className="game-info__info">
          Status: <span className="status-1">In-Progress</span>
        </p>
      ) : (
        <p className="game-info__info">
          Status: <span className="status-2">Ended</span>
        </p>
      )}
      <p className="game-info__info">
        Total Players: <span>{players.length}</span>
      </p>
      <p className="game-info__info">
        Total Game Picks: <span>{totalPicks}</span>
      </p>

      {/* Delete / Generate Game Picks */}
      <GamePicksButton
        gameID={gameID}
        isGenerated={isGenerated}
        refetch={refetch}
        players={players}
      />

      {/* Change Status */}
      <GameStatus gameID={gameID} status={status} refetch={refetch} />

      {/* Players */}
      <div className="game-info__players row">
        <p className="game-info__title">Update Players</p>
        <button
          type="button"
          className="game-info__add"
          onClick={() => setPlayersPopup({ show: true })}
        >
          Add Players
        </button>
      </div>

      {/* Get Picks Data */}
      <GamePicks gameID={gameID} game={game} refetch={refetch} />

      {/* Delete Game */}
      <button
        type="button"
        className={`game-info__delete ${
          isGenerated ? "game-info__delete-disabled" : ""
        }`}
        onClick={() => setDeletePopup({ show: true })}
        disabled={isGenerated}
      >
        Delete Game
      </button>
      {isGenerated && (
        <p className="game-info__delete-msg">
          Please delete all picks for this game before deleting the entire game.
        </p>
      )}

      {/* Add Players Popup */}
      {playersPopup.show && (
        <AddPlayersPopup
          gamePlayers={players}
          closePopup={() => setPlayersPopup({ show: false })}
          refetch={refetch}
          gameID={gameID}
        />
      )}

      {/* Delete Game Popup */}
      {deletePopup.show && (
        <DeleteGamePopup
          gameID={gameID}
          closePopup={() => setDeletePopup({ show: false })}
        />
      )}
    </div>
  );
}

export default Game;
