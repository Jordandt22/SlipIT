import React from "react";

// Utils
import { statNameFormatter } from "../../../../utils/formatter.util";

function PlayerPicks(props) {
  const {
    picksAPIData: { picks },
  } = props;
  return (
    <div className="player-info__picks">
      {picks.length > 0 ? (
        <>
          {picks.map((pick) => {
            const {
              pickID,
              line: { stat, value },
              usersPlayed,
            } = pick;
            const statName = statNameFormatter(stat);

            return (
              <div key={pickID} className="player-info__pick between-row">
                <p className="player-info__pick-line">
                  <span>
                    {value} {statName}
                  </span>
                </p>

                <p className="player-info__pick-users">
                  {usersPlayed.length} Users Played
                </p>
              </div>
            );
          })}
        </>
      ) : (
        <p className="player-info__none">
          No picks have been generated for this player
        </p>
      )}
    </div>
  );
}

export default PlayerPicks;
