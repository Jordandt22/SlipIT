import React from "react";
import { NavLink } from "react-router-dom";

function PlayerCard(props) {
  const {
    player: {
      playerInfo: { name, image },
      playerStats: { games },
    },
  } = props;

  const numOfRecentGames = 3;
  return (
    <div className="player-card center-vertical">
      <div className="player-card__profile center-vertical">
        <div className="row">
          <div className="player-card__img-box">
            <img src={image} alt={name} />
          </div>
        </div>

        <p className="player-card__name">{name}</p>
      </div>

      {/* Games Played */}
      <p className="player-card__title">Games Played</p>
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
        <p className="player-card__none">No games Played</p>
      )}
    </div>
  );
}

export default PlayerCard;
