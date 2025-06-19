export const statNameFormatter = (stat) => {
  const stats = {
    // Blitzball
    atBats: "At Bats",
    hits: "Hits",
    hitterStrikeouts: "Hitter Strikeouts",
    hitterWalks: "Hitter Walks",
    homeruns: "Homeruns",
    RBI: "RBIs",
    earnedRuns: "Earned Runs",
    hitsAllowed: "Hits Allowed",
    inningsPitched: "Innings Pitched",
    pitcherStrikeouts: "Pitcher Strikeouts",
    pitcherWalks: "Pitcher Walks",

    // Soccer
    goalsScored: "Goals Scored",
    goalsBlocked: "Goals Blocked",
  };

  return stats[stat];
};
