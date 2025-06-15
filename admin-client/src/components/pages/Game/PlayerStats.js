import React from "react";
import { statNameFormatter } from "../../../utils/formatter.util";

// Components
import Arrow from "../../SVG/Arrow";

function PlayerStats(props) {
  const { title, playerID, stats, updateStat, isBatting, status } = props;

  return (
    <div className="player-info__box">
      <p className="player-info__title">{title}</p>
      <div className="player-info__stats">
        {Object.keys(stats).map((key) => {
          const stat = stats[key];
          const statName = statNameFormatter(key);

          return (
            <div key={playerID + key} className="player-info__stat between-row">
              <p>
                {statName}: <span>{stat}</span>
              </p>

              {status === 1 && (
                <div className="row">
                  <button
                    type="button"
                    className="player-info__dec"
                    onClick={async () =>
                      await updateStat(key, stat, isBatting, true)
                    }
                  >
                    <Arrow />
                  </button>
                  <button
                    type="button"
                    className="player-info__inc"
                    onClick={async () =>
                      await updateStat(key, stat, isBatting, false)
                    }
                  >
                    <Arrow />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PlayerStats;
