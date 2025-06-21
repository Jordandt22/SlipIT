import React, { useState } from "react";
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
import CreatePlayerPopup from "./CreatePlayerPopup";

function PlayersSection(props) {
  const page = 1;
  const limit = 15;
  const recent = false;
  const { getPlayers } = useAPI();
  const [createPlayerPopup, setCreatePlayerPopup] = useState({ show: false });
  const { isPending, isError, error, data, refetch } = useQuery({
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
      <button
        type="button"
        className="home-section__create"
        onClick={() => setCreatePlayerPopup({ show: true })}
      >
        Create a Player
      </button>
      {players.length > 0 ? (
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
                <PlayerCard player={player} {...props} refetch={refetch} />
              </SwiperSlide>
            );
          })}
        </Swiper>
      ) : (
        <p style={{ marginTop: 0 }} className="games-section__none">
          No Current Players
        </p>
      )}

      {/* Create Game Popup */}
      {createPlayerPopup.show && (
        <CreatePlayerPopup
          setCreatePlayerPopup={setCreatePlayerPopup}
          refetch={refetch}
        />
      )}
    </div>
  );
}

export default PlayersSection;
