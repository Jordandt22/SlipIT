import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getListOfSports } from "../../../../misc/Sports";

// Contexts
import { useAPI } from "../../../../context/API/API.context";
import { GET_GAMES_KEY } from "../../../../context/API/QueryKeys";

// Components
import CreateGamePopup from "./CreateGamePopup";
import ErrorMessage from "../../../standalone/status/ErrorMessage";

function GamesSection() {
  const { getGames } = useAPI();
  const [activeSport, setActiveSport] = useState(0);
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
    return <ErrorMessage message={error.message} />;
  }

  const sports = getListOfSports();
  const { games } = data.data.data;
  const filteredGames = games.filter((game) => {
    const activeSportName = sports[activeSport].toLowerCase();
    return game.sport.name === activeSportName;
  });
  return (
    <div className="games-section home-section">
      <button
        type="button"
        className="home-section__create"
        onClick={() => setCreateGamePopup({ show: true })}
      >
        Create a Game
      </button>
      <div className="row games-section__tabs">
        {sports.map((sport, i) => {
          return (
            <button
              key={sport}
              type="button"
              className={`games-section__tab ${
                activeSport === i ? "games-section__tab-active" : ""
              }`}
              onClick={() => setActiveSport(i)}
            >
              {sport}
            </button>
          );
        })}
      </div>

      {/* Games */}
      <div className="games-section__games">
        {filteredGames.length > 0 ? (
          filteredGames.map((game) => {
            const { gameID, name, eventDate, status, players, sport } = game;
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
                  {name} <span>({sport.name})</span>
                </p>
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
          <p className="games-section__none">No {sports[activeSport]} Games</p>
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
