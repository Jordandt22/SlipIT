import React, { createContext, useContext } from "react";
import axios from "axios";

// API Context
const APIContext = createContext();
export const useAPI = () => useContext(APIContext);
export const APIContextProvider = (props) => {
  const { REACT_APP_API_URI } = process.env;
  const getURIPath = (path, query) => REACT_APP_API_URI + path + query;

  // ---- Games ----

  // Get Games
  const getGames = async (limit, page, recent) =>
    await axios.get(
      getURIPath("/games", `?limit=${limit}&page=${page}&recent=${recent}`)
    );

  // Get Game
  const getGame = async (gameID) =>
    await axios.get(getURIPath(`/games/${gameID}`, ""));

  // Update Game Players
  const updateGameStats = async (gameID, playerID, data) =>
    await axios.patch(
      getURIPath(`/games/${gameID}/players/${playerID}/stats`, ""),
      data
    );

  // ---- Players ----

  // Get Player
  const getPlayer = async (playerID) =>
    await axios.get(getURIPath(`/players/${playerID}`, ""));

  return (
    <APIContext.Provider
      value={{ getGames, getGame, getPlayer, updateGameStats }}
    >
      {props.children}
    </APIContext.Provider>
  );
};
