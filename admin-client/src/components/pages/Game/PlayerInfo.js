import React from "react";
import { useQuery } from "@tanstack/react-query";
import { GET_PLAYER_KEY } from "../../../context/API/QueryKeys";

// Contexts
import { useAPI } from "../../../context/API/API.context";
import PlayerStats from "./PlayerStats";

function PlayerInfo(props) {
  const {
    gameID,
    player: { playerID, stats },
    refetch,
  } = props;
  const { getPlayer, updateGameStats, removeGamePlayer } = useAPI();
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
          <div className="player-info__img-box">
            {/* <img src={image} alt={name} /> */}
          </div>
        </div>

        <p className="player-info__name">{name}</p>

        <button
          type="button"
          className="player-info__remove"
          onClick={async () => {
            await removeGamePlayer(gameID, { players: [{ playerID }] });
            refetch();
          }}
        >
          Remove Player
        </button>
      </div>

      {/* Stats */}
      <PlayerStats
        title="Batting"
        playerID={playerID}
        stats={stats.batting}
        updateStat={updateStat}
      />
      <PlayerStats
        title="Pitching"
        playerID={playerID}
        stats={stats.pitching}
        updateStat={updateStat}
      />
    </div>
  );
}

export default PlayerInfo;
