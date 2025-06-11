import React from "react";

// Contexts
import { useAPI } from "../../../context/API/API.context";

function GameStatus(props) {
  const { gameID, status, refetch } = props;
  const { updateGameStatus } = useAPI();

  const updateStatusHandler = async (status) => {
    await updateGameStatus(gameID, { status });
    refetch();
  };

  return (
    <>
      <p className="game-info__title">Update Status</p>
      <div className="row">
        {status !== 0 && (
          <button
            type="button"
            className="game-info__not-started"
            onClick={() => updateStatusHandler(0)}
          >
            Not Started
          </button>
        )}

        {status !== 1 && (
          <button
            type="button"
            className="game-info__in-progress"
            onClick={() => updateStatusHandler(1)}
          >
            In-Progress
          </button>
        )}

        {status !== 2 && (
          <button
            type="button"
            className="game-info__ended"
            onClick={() => updateStatusHandler(2)}
          >
            Ended
          </button>
        )}
      </div>
    </>
  );
}

export default GameStatus;
