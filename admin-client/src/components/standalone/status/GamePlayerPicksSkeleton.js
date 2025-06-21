import React from "react";

function GamePlayerPicksSkeleton() {
  return (
    <div className="player-info__picks ">
      <h2 className="player-info__picks-title">Loading Picks Category...</h2>
      {Array.apply(null, Array(3)).map((_, i) => {
        return (
          <div
            key={"game-player-picks-skel-" + i}
            className="player-info__pick player-info__pick-skel between-row"
          >
            <p className="player-info__pick-line">
              <span>Loading Line...</span>
            </p>
          </div>
        );
      })}
    </div>
  );
}

export default GamePlayerPicksSkeleton;
