import React from "react";

// Utils
import { statNameFormatter } from "../../../../utils/formatter.util";

function PlayerPicks(props) {
  const {
    picksAPIData: { picks },
  } = props;
  return (
    <div className="player-info__picks">
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
    </div>
  );
}

export default PlayerPicks;
