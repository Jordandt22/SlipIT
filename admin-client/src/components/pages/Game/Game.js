import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { GET_GAME_KEY } from "../../../context/API/QueryKeys";

// Contexts
import { useAPI } from "../../../context/API/API.context";

// Components
import PlayerInfo from "./PlayerInfo";

function Game() {
  const { gameID } = useParams();
  const { getGame } = useAPI();
  const [curPlayerIndex, setCurPlayerIndex] = useState(0);
  const { isPending, isError, error, data, refetch } = useQuery({
    queryKey: [GET_GAME_KEY(gameID)],
    queryFn: async () => await getGame(gameID),
    retry: 3,
  });

  if (isPending) {
    return <div>loading...</div>;
  } else if (isError) {
    return <div>{error.message}</div>;
  }

  const { eventDate, players, status } = data.data.data.game;
  const formattedDate = new Date(eventDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  const nextPlayer = () => {
    setCurPlayerIndex((curIndex) => {
      if (curIndex >= players.length - 1) {
        return 0;
      } else {
        return curIndex + 1;
      }
    });
  };

  const prevPlayer = () => {
    setCurPlayerIndex((curIndex) => {
      if (curIndex <= 0) {
        return players.length - 1;
      } else {
        return curIndex - 1;
      }
    });
  };

  return (
    <div className="game-container">
      <h2 className="game-container__title">
        Game<span>#{gameID}</span>
      </h2>

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

      {/* Change Status */}
      <p className="game-info__title">Update Status</p>
      <div className="row">
        {status !== 0 && (
          <button type="button" className="game-info__not-started">
            Not Started
          </button>
        )}

        {status !== 1 && (
          <button type="button" className="game-info__in-progress">
            In-Progress
          </button>
        )}

        {status !== 2 && (
          <button type="button" className="game-info__ended">
            Ended
          </button>
        )}
      </div>

      {/* Players */}
      <p className="game-info__title">Update Players</p>
      <PlayerInfo
        gameID={gameID}
        player={players[curPlayerIndex]}
        refetch={refetch}
        nextPlayer={nextPlayer}
        prevPlayer={prevPlayer}
      />
    </div>
  );
}

export default Game;
