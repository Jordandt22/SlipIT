import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { GAMES_KEY } from "../../../context/API/QueryKeys";

// Contexts
import { useAPI } from "../../../context/API/API.context";

function GamesSection() {
  const { getGames } = useAPI();
  const [page, setPage] = useState(1);
  const limit = 10;
  const recent = false;
  const { isPending, isError, error, data } = useQuery({
    queryKey: [GAMES_KEY(limit, page, recent)],
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
    <div className="games-section">
      <h2 className="games-section__title">Games</h2>

      {/* Games */}
      <div className="games-section__games">
        {games.map((game) => {
          const { gameID, eventDate, status, players } = game;
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
              <p className="games-section__game-title">
                Game<span>#{gameID}</span>
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
                <NavLink to={`/game/${gameID}`} className="games-section__btn">
                  View
                </NavLink>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default GamesSection;
