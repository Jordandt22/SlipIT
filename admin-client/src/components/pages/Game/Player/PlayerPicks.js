import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";

// Utils
import { statNameFormatter } from "../../../../utils/formatter.util";

// Contexts
import { useAPI } from "../../../../context/API/API.context";
import { GET_PICKS_KEY } from "../../../../context/API/QueryKeys";

// Components
import ErrorMessage from "../../../standalone/status/ErrorMessage";
import GamePlayerPicksSkeleton from "../../../standalone/status/GamePlayerPicksSkeleton";

function PlayerPicks(props) {
  const {
    player: { playerID },
    game: {
      gameID,
      picksData: { isGenerated },
      sport: { categories },
    },
  } = props;
  const { getPicksByGameAndPlayer } = useAPI();
  const [page, setPage] = useState(1);
  const limit = 20;
  const recent = false;
  const { isPending, isError, error, data } = useQuery({
    queryKey: [
      GET_PICKS_KEY("GAME-PLAYER", limit, page, recent, gameID, playerID),
    ],
    queryFn: async () =>
      await getPicksByGameAndPlayer(limit, page, recent, gameID, playerID),
    retry: 3,
    enabled: isGenerated,
  });

  if (!isGenerated) {
    return (
      <div className="player-info__picks">
        <p className="player-info__none">
          No picks have been generated for this player
        </p>
      </div>
    );
  }

  if (isGenerated) {
    if (isPending) {
      return <GamePlayerPicksSkeleton />;
    } else if (isError) {
      return <ErrorMessage message={error.message} />;
    }
  }

  const { picks, totalPicks } = data.data.data;
  return (
    <div className="player-info__picks">
      {totalPicks > 0 ? (
        <>
          {categories.map((category) => {
            const categoryPicks = picks.filter(
              (pick) => pick.line.category === category
            );

            return (
              <React.Fragment key={category + "-picks"}>
                <h2 className="player-info__picks-title">{category}</h2>
                {categoryPicks.length > 0 ? (
                  <>
                    {categoryPicks.map((pick) => {
                      const {
                        pickID,
                        line: { stat, value },
                        usersPlayed,
                      } = pick;
                      const statName = statNameFormatter(stat);

                      return (
                        <div
                          key={pickID}
                          className="player-info__pick between-row"
                        >
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
              </React.Fragment>
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
