import React from "react";
import { useQuery } from "@tanstack/react-query";

// Misc
import { sports } from "../../../misc/Sports";

// Contexts
import { useAPI } from "../../../context/API/API.context";
import { GET_PLAYER_KEY } from "../../../context/API/QueryKeys";
import { useGlobal } from "../../../context/Global/Global.context";

// Components
import BlitzballStats from "./blitzball/BlitzballStats";
import SoccerStats from "./soccer/SoccerStats";
import ErrorMessage from "../../standalone/status/ErrorMessage";
import Loading from "../../standalone/status/Loading";

function PlayerInfo(props) {
  const {
    player: { playerID },
    game: { gameID, sport },
    refetch,
  } = props;
  const { getPlayer, removeGamePlayer } = useAPI();
  const { showLoading, hideLoading } = useGlobal();
  const { isPending, isError, error, data } = useQuery({
    queryKey: [GET_PLAYER_KEY(playerID)],
    queryFn: async () => await getPlayer(playerID),
    retry: 3,
  });

  if (isPending) {
    return <Loading message="Loading Player Data..." />;
  } else if (isError) {
    return <ErrorMessage message={error.message} />;
  }

  const {
    playerInfo: { name, image },
  } = data.data.data.player;
  return (
    <div className="player-info">
      <div className="center-vertical">
        <div className="row">
          <div className="player-info__img-box center">
            <img src={image} alt={name} />
          </div>
        </div>

        <p className="player-info__name">{name}</p>

        <button
          type="button"
          className="player-info__remove"
          onClick={async () => {
            showLoading("Removing Player from Game...");
            await removeGamePlayer(gameID, { players: [{ playerID }] });
            hideLoading();
            refetch();
          }}
        >
          Remove Player
        </button>
      </div>

      {/* Stats */}
      {sport.name === sports.BLITZBALL ? (
        <BlitzballStats {...props} />
      ) : (
        <SoccerStats {...props} />
      )}
    </div>
  );
}

export default PlayerInfo;
