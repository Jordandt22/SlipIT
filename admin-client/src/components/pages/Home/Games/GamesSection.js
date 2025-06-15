import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

// Contexts
import { useAPI } from "../../../../context/API/API.context";
import { GET_GAMES_KEY } from "../../../../context/API/QueryKeys";

// Components
import CreateGamePopup from "./CreateGamePopup";

function GamesSection() {
  const { getGames } = useAPI();
  const [page, setPage] = useState(1);
  const limit = 10;
  const recent = false;
  const [createGamePopup, setCreateGamePopup] = useState({ show: false });
  const { isPending, isError, error, data, refetch } = useQuery({
    queryKey: [GET_GAMES_KEY(limit, page, recent)],
    queryFn: async () => await getGames(limit, page, recent),
    retry: 3,
  });

  if (isPending) {
    return <div>loading...</div>;
  } else if (isError) {
    return <div>{error.message}</div>;
  }

  const { games, totalGames } = data.data.data;
  return (
    <div className="games-section home-section">
      <button
        type="button"
        className="home-section__create"
        onClick={() => setCreateGamePopup({ show: true })}
      >
        Create a Game
      </button>

      {/* Games */}
      <div className="games-section__games">
        {totalGames > 0 ? (
          games.map((game) => {
            const { gameID, name, eventDate, status, players } = game;
            const formattedDate = new Date(eventDate).toLocaleDateString(
              "en-US",
              {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
              }
            );

            return (
              <div key={gameID} className="games-section__game">
                <p className="games-section__game-title">{name}</p>
                <p className="games-section__game-info">
                  Game ID: <span>{gameID}</span>
                </p>
                <p className="games-section__game-info">
                  Date: <span>{formattedDate}</span>
                </p>
                {status === 0 ? (
                  <p className="games-section__game-info">
                    Status: <span className="status-0">Not Started</span>
                  </p>
                ) : status === 1 ? (
                  <p className="games-section__game-info">
                    Status: <span className="status-1">In-Progress</span>
                  </p>
                ) : (
                  <p className="games-section__game-info">
                    Status: <span className="status-2">Ended</span>
                  </p>
                )}
                <p className="games-section__game-info">
                  Total Players: <span>{players.length}</span>
                </p>

                {/* Btns */}
                <div className="row">
                  <NavLink
                    to={`/game/${gameID}`}
                    className="games-section__btn"
                  >
                    View
                  </NavLink>
                </div>
              </div>
            );
          })
        ) : (
          <p>No Games</p>
        )}
      </div>

      {/* Create Game Popup */}
      {createGamePopup.show && (
        <CreateGamePopup
          setCreateGamePopup={setCreateGamePopup}
          refetch={refetch}
        />
      )}
    </div>
  );
}

export default GamesSection;
