import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";

// Contexts
import { useAPI } from "../../../context/API/API.context";
import { GET_PICKS_KEY } from "../../../context/API/QueryKeys";

// Components
import Loading from "../../standalone/status/Loading";
import ErrorMessage from "../../standalone/status/ErrorMessage";
import PlayerInfo from "./Player/PlayerInfo";

function GamePicks(props) {
  const {
    gameID,
    game: {
      picksData: { isGenerated },
      players,
    },
    refetch,
  } = props;
  const { getPicks } = useAPI();
  const [page, setPage] = useState(1);
  const filter = "game";
  const limit = 10;
  const recent = false;
  const { isPending, isError, error, data } = useQuery({
    queryKey: [GET_PICKS_KEY(filter, gameID, limit, page, recent)],
    queryFn: async () => await getPicks(filter, gameID, limit, page, recent),
    retry: 3,
    enabled: isGenerated,
  });

  if (isGenerated) {
    if (isPending) {
      return <Loading message="Loading Game Picks..." />;
    } else if (isError) {
      return <ErrorMessage message={error.message} />;
    }
  }

  return (
    <>
      <Swiper
        pagination={{
          dynamicBullets: true,
          clickable: true,
        }}
        modules={[Pagination]}
        className="players-swiper"
      >
        {players.map((player) => {
          return (
            <SwiperSlide key={player.playerID}>
              <PlayerInfo
                player={player}
                refetch={refetch}
                game={props.game}
                picksAPIData={isGenerated ? data.data.data : { picks: [] }}
              />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </>
  );
}

export default GamePicks;
