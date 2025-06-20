import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";

// Misc
import { sports } from "../../../../misc/Sports";

// Contexts
import { useAPI } from "../../../../context/API/API.context";
import { GET_PLAYER_KEY } from "../../../../context/API/QueryKeys";
import { useGlobal } from "../../../../context/Global/Global.context";

// Components
import BlitzballStats from "./BlitzballStats";
import SoccerStats from "./SoccerStats";
import ErrorMessage from "../../../standalone/status/ErrorMessage";
import Loading from "../../../standalone/status/Loading";
import PlayerPicks from "./PlayerPicks";

function PlayerInfo(props) {
  const {
    player: { playerID },
    game: { gameID, sport },
    refetch,
  } = props;
  const { getPlayer, removeGamePlayer } = useAPI();
  const { showLoading, hideLoading } = useGlobal();
  const [activeTab, setActiveTab] = useState(0);
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

  const tabs = ["Stats", "Picks"];
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

      {/* Tabs */}
      <div className="row player-info__tabs">
        {tabs.map((tab, i) => {
          const isActive = i === activeTab;

          return (
            <button
              key={tab}
              type="button"
              className={`player-info__tab ${
                isActive ? "player-info__tab-active" : ""
              }`}
              onClick={() => setActiveTab(i)}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Main Content */}
      {activeTab === 0 ? (
        <>
          {/* Stats */}
          {sport.name === sports.BLITZBALL ? (
            <BlitzballStats {...props} />
          ) : (
            <SoccerStats {...props} />
          )}
        </>
      ) : (
        <PlayerPicks {...props} />
      )}
    </div>
  );
}

export default PlayerInfo;
