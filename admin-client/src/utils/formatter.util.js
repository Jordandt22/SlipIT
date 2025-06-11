export const statNameFormatter = (stat) => {
  const stats = {
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
  };

  return stats[stat];
};
