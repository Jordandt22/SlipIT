import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";

// Contexts
import { useAPI } from "../../../../context/API/API.context";
import { GET_PLAYERS_KEY } from "../../../../context/API/QueryKeys";

// Components
import AddPlayersForm from "../../../standalone/players/AddPlayersForm";
import ErrorMessage from "../../../standalone/status/ErrorMessage";

function AddPlayersInput(props) {
  const { addedPlayers, setAddedPlayers } = props;
  const { getPlayers } = useAPI();
  const page = 1;
  const limit = 15;
  const recent = false;
  const { isPending, isError, error, data } = useQuery({
    queryKey: [GET_PLAYERS_KEY(limit, page, recent)],
    queryFn: async () => await getPlayers(limit, page, recent),
    retry: 3,
  });

  // Add Players to Temp List
  const addPlayer = (playerID) =>
    setAddedPlayers((curPlayers) => [...curPlayers, { playerID }]);

  // Remove Players to Temp List
  const removePlayer = (playerID) =>
    setAddedPlayers((curPlayers) =>
      [...curPlayers].filter((curPlayer) => curPlayer.playerID !== playerID)
    );

  if (isPending) {
    return <div>loading...</div>;
  } else if (isError) {
    return <ErrorMessage message={error.message} />;
  }

  const { players } = data.data.data;

  // Split the players in sections
  const playersSections = [];
  const numPlayersShown = 4;
  for (let i = 0; i < players.length; i += numPlayersShown) {
    playersSections.push(players.slice(i, i + numPlayersShown));
  }
  return (
    <Swiper
      pagination={{
        dynamicBullets: true,
        clickable: false,
      }}
      modules={[Pagination]}
      className="players-swiper"
    >
      {playersSections.map((playerSection, i) => {
        return (
          <SwiperSlide key={`players-section-${i}`}>
            <div className="add-players-input">
              <AddPlayersForm
                players={playerSection}
                addedPlayers={addedPlayers}
                addPlayer={addPlayer}
                removePlayer={removePlayer}
              />
            </div>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
}

export default AddPlayersInput;
