import React from "react";
import { useQuery } from "@tanstack/react-query";
import { GET_PLAYER_KEY } from "../../../context/API/QueryKeys";

// Contexts
import { useAPI } from "../../../context/API/API.context";

// Components
import Arrow from "../../SVG/Arrow";

function PlayerInfo(props) {
  const {
    gameID,
    player: { playerID, stats },
    refetch,
    nextPlayer,
    prevPlayer,
  } = props;
  const { getPlayer, updateGameStats } = useAPI();
  const { isPending, isError, error, data } = useQuery({
    queryKey: [GET_PLAYER_KEY(playerID)],
    queryFn: async () => await getPlayer(playerID),
    retry: 3,
  });

  if (isPending) {
    return <div>loading...</div>;
  } else if (isError) {
    return <div>{error.message}</div>;
  }

  const updateStat = async (key, val, isBatting, isDec) => {
    if (isBatting) {
      await updateGameStats(gameID, playerID, {
        stats: {
          ...stats,
          batting: {
            ...stats.batting,
            [key]: isDec ? val - 1 : val + 1,
          },
        },
      });
    } else {
      await updateGameStats(gameID, playerID, {
        stats: {
          ...stats,
          pitching: {
            ...stats.pitching,
            [key]: isDec ? val - 1 : val + 1,
          },
        },
      });
    }

    refetch();
  };

  const {
    playerInfo: { name, image },
  } = data.data.data.player;
  return (
    <div className="player-info">
      <div className="center-vertical">
        <div className="row">
          <button
            type="button"
            className="player-info__prev"
            onClick={prevPlayer}
          >
            <Arrow />
          </button>
          <div className="player-info__img-box">
            {/* <img src={image} alt={name} /> */}
          </div>
          <button
            type="button"
            className="player-info__next"
            onClick={nextPlayer}
          >
            <Arrow />
          </button>
        </div>

        <p className="player-info__name">{name}</p>
      </div>

      {/* Stats */}
      <div className="player-info__box">
        <p className="player-info__title">Batting</p>
        <div className="player-info__stats">
          {Object.keys(stats.batting).map((key) => {
            const stat = stats.batting[key];

            return (
              <div
                key={playerID + key}
                className="player-info__stat between-row"
              >
                <p>
                  {key}: <span>{stat}</span>
                </p>

                <div className="row">
                  <button
                    type="button"
                    className="player-info__dec"
                    onClick={async () =>
                      await updateStat(key, stat, true, true)
                    }
                  >
                    <Arrow />
                  </button>
                  <button
                    type="button"
                    className="player-info__inc"
                    onClick={async () =>
                      await updateStat(key, stat, true, false)
                    }
                  >
                    <Arrow />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="player-info__box">
        <p className="player-info__title">Pitching</p>
        <div className="player-info__stats">
          {Object.keys(stats.pitching).map((key) => {
            const stat = stats.pitching[key];

            return (
              <div
                key={playerID + key}
                className="player-info__stat between-row"
              >
                <p>
                  {key}: <span>{stat}</span>
                </p>

                <div className="row">
                  <button
                    type="button"
                    className="player-info__dec"
                    onClick={async () =>
                      await updateStat(key, stat, false, true)
                    }
                  >
                    <Arrow />
                  </button>
                  <button
                    type="button"
                    className="player-info__inc"
                    onClick={async () =>
                      await updateStat(key, stat, false, false)
                    }
                  >
                    <Arrow />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default PlayerInfo;
