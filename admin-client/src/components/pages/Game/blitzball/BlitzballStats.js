import React from "react";

// Contexts
import { useAPI } from "../../../../context/API/API.context";
import { useGlobal } from "../../../../context/Global/Global.context";

// Components
import PlayerStats from "../PlayerStats";

function BlitzballStats(props) {
  const {
    player: { playerID, stats },
    game: { gameID, status },
    refetch,
  } = props;
  const { updateGameBlitzballStats } = useAPI();
  const { showLoading, hideLoading } = useGlobal();

  // Update Blitzball Stat
  const updateStat = async (key, val, isDec, category) => {
    const updatedStats = { ...stats };
    updatedStats.blitzball[category][key] = isDec ? val - 1 : val + 1;
    showLoading("Updating Player Stats...");

    await updateGameBlitzballStats(gameID, playerID, {
      stats: {
        ...stats.blitzball,
        ...updatedStats.blitzball,
      },
    });
    hideLoading();
    refetch();
  };

  return (
    <>
      <PlayerStats
        title="Batting"
        playerID={playerID}
        stats={stats.blitzball.batting}
        updateStat={updateStat}
        isBatting={true}
        status={status}
        category="batting"
      />
      <PlayerStats
        title="Pitching"
        playerID={playerID}
        stats={stats.blitzball.pitching}
        updateStat={updateStat}
        isBatting={false}
        status={status}
        category="pitching"
      />
    </>
  );
}

export default BlitzballStats;
