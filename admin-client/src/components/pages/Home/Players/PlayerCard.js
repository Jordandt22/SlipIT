import React, { useState } from "react";
import { NavLink } from "react-router-dom";

// Misc
import { getListOfSports } from "../../../../misc/Sports";
import DeletePlayerPopup from "./DeleteGamePopup";

function PlayerCardGames(props) {
  const {
    sport: { games, label },
  } = props;
  const numOfRecentGames = 3;

  return (
    <>
      {games.length > 0 ? (
        <>
          {games
            .slice(games.length - numOfRecentGames, games.length)
            .map((game) => {
              const { gameID } = game;
              return (
                <NavLink
                  key={gameID}
                  to={`/game/${gameID}`}
                  className="player-card__game"
                >
                  Game<span>#{gameID}</span>
                </NavLink>
              );
            })}
        </>
      ) : (
        <p className="player-card__none">No {label} Games Played</p>
      )}
    </>
  );
}

function PlayerCard(props) {
  const {
    player: {
      playerID,
      playerInfo: { name, image },
      playerStats,
    },
    openPopup,
    refetch,
  } = props;
  const [activeSport, setActiveSport] = useState(0);
  let totalGames = 0;
  const sports = getListOfSports().map((sport) => {
    totalGames += playerStats[sport].games.length;
    return {
      label: sport,
      games: playerStats[sport].games,
    };
  });

  return (
    <div className="player-card center-vertical">
      <div className="player-card__profile center-vertical">
        <div className="row">
          <div className="player-card__img-box">
            <img src={image} alt={name} />
          </div>
        </div>

        <p className="player-card__name">{name}</p>
        {totalGames <= 0 && (
          <button
            type="button"
            className="player-card__delete"
            onClick={() => openPopup(playerID, refetch)}
          >
            Delete Player
          </button>
        )}
      </div>

      {/* Games Played */}
      <div className="row player-card__tabs">
        {sports.map((sport, i) => {
          return (
            <button
              key={sport.label + "-player-tab"}
              type="button"
              className={`player-card__tab ${
                activeSport === i ? "player-card__tab-active" : ""
              }`}
              onClick={() => setActiveSport(i)}
            >
              {sport.label}
            </button>
          );
        })}
      </div>
      <PlayerCardGames sport={sports[activeSport]} />
    </div>
  );
}

export default PlayerCard;
