import React from "react";

// Utils
import { statNameFormatter } from "../../../utils/formatter.util";

// Components
import Arrow from "../../SVG/Arrow";

function PlayerStats(props) {
  const { title, playerID, stats, updateStat, status, category } = props;

  return (
    <div className="player-info__box">
      <p className="player-info__title">{title}</p>
      <div className="player-info__stats">
        {Object.keys(stats).map((key) => {
          const stat = stats[key];
          const statName = statNameFormatter(key);
          const minVal = 1;
          const maxVal = 20;

          return (
            <div key={playerID + key} className="player-info__stat between-row">
              <p>
                {statName}: <span>{stat}</span>
              </p>

              {status === 1 && (
                <div className="row">
                  <button
                    type="button"
                    className={`player-info__dec ${
                      stat < minVal ? "player-info__dec-disabled" : ""
                    }`}
                    onClick={async () => {
                      if (stat >= minVal)
                        await updateStat(key, stat, true, category);
                    }}
                    disabled={stat < minVal}
                  >
                    <Arrow />
                  </button>

                  <button
                    type="button"
                    className={`player-info__inc ${
                      stat >= maxVal ? "player-info__inc-disabled" : ""
                    }`}
                    onClick={async () => {
                      if (stat < maxVal)
                        await updateStat(key, stat, false, category);
                    }}
                    disabled={stat >= maxVal}
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
