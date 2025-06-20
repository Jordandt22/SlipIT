import React from "react";
import { useQuery } from "@tanstack/react-query";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";

// Contexts
import { GET_PLAYERS_KEY } from "../../../../context/API/QueryKeys";
import { useAPI } from "../../../../context/API/API.context";

// Components
import PlayerCard from "./PlayerCard";
import ErrorMessage from "../../../standalone/status/ErrorMessage";
import Loading from "../../../standalone/status/Loading";

function PlayersSection() {
  const page = 1;
  const limit = 15;
  const recent = false;
  const { getPlayers } = useAPI();
  const { isPending, isError, error, data } = useQuery({
    queryKey: [GET_PLAYERS_KEY(limit, page, recent)],
    queryFn: async () => await getPlayers(limit, page, recent),
    retry: 3,
  });

  if (isPending) {
    return <Loading message="Loading Players..." />;
  } else if (isError) {
    return <ErrorMessage message={error.message} />;
  }

  const { players } = data.data.data;
  return (
    <div className="players-section">
      <Swiper
        pagination={{
          dynamicBullets: true,
          clickable: false,
        }}
        modules={[Pagination]}
        className="player-cards-swiper"
      >
        {players.map((player) => {
          return (
            <SwiperSlide key={player.playerID}>
              <PlayerCard player={player} />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}

export default PlayersSection;
