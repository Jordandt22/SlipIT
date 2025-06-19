import React from "react";

// Contexts
import { useAPI } from "../../../../context/API/API.context";

// Components
import PlayerStats from "../PlayerStats";

function SoccerStats(props) {
  const {
    player: { playerID, stats },
    game: { gameID, status },
    refetch,
  } = props;
  const { updateGameSoccerStats } = useAPI();

  // Update Soccer Stat
  const updateStat = async (key, val, isDec, category) => {
    const updatedStats = { ...stats };
    updatedStats.soccer[category][key] = isDec ? val - 1 : val + 1;
    await updateGameSoccerStats(gameID, playerID, {
      stats: {
        ...stats.soccer,
        ...updatedStats.soccer,
      },
    });

    refetch();
  };

  return (
    <>
      <PlayerStats
        title="Attacker"
        playerID={playerID}
        stats={stats.soccer.attacker}
        updateStat={updateStat}
        isBatting={true}
        status={status}
        category="attacker"
      />
      <PlayerStats
        title="Defender"
        playerID={playerID}
        stats={stats.soccer.defender}
        updateStat={updateStat}
        isBatting={false}
        status={status}
        category="defender"
      />
    </>
  );
}

export default SoccerStats;
