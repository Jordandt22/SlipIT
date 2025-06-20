import React, { createContext, useContext } from "react";
import axios from "axios";

// API Context
const APIContext = createContext();
export const useAPI = () => useContext(APIContext);
export const APIContextProvider = (props) => {
  const { REACT_APP_API_URI } = process.env;
  const getURIPath = (path, query) => REACT_APP_API_URI + path + query;

  // ---- Games ----

  // Create Game
  const createGame = async (data) =>
    await axios.post(getURIPath(`/games`, ""), data);

  // Get Games
  const getGames = async (limit, page, recent) =>
    await axios.get(
      getURIPath("/games", `?limit=${limit}&page=${page}&recent=${recent}`)
    );

  // Get Game
  const getGame = async (gameID) =>
    await axios.get(getURIPath(`/games/${gameID}`, ""));

  // Update Game Status
  const updateGameStatus = async (gameID, data) =>
    await axios.patch(getURIPath(`/games/${gameID}/status`, ""), data);

  // Update Game Players Blitzball Stats
  const updateGameBlitzballStats = async (gameID, playerID, data) =>
    await axios.patch(
      getURIPath(`/games/${gameID}/players/${playerID}/stats/blitzball`, ""),
      data
    );

  // Update Game Players Soccer Stats
  const updateGameSoccerStats = async (gameID, playerID, data) =>
    await axios.patch(
      getURIPath(`/games/${gameID}/players/${playerID}/stats/soccer`, ""),
      data
    );

  // Add Game Player
  const addGamePlayer = async (gameID, data) =>
    await axios.patch(getURIPath(`/games/${gameID}/players`, ""), data);

  // Remove Game Player
  const removeGamePlayer = async (gameID, data) =>
    await axios.patch(getURIPath(`/games/${gameID}/players/remove`, ""), data);

  // Delete Game
  const deleteGame = async (gameID) =>
    await axios.delete(getURIPath(`/games/${gameID}`, ""));

  // ---- Players ----

  // Get Player
  const getPlayer = async (playerID) =>
    await axios.get(getURIPath(`/players/${playerID}`, ""));

  // Get Players
  const getPlayers = async (limit, page, recent) =>
    await axios.get(
      getURIPath("/players", `?limit=${limit}&page=${page}&recent=${recent}`)
    );

  // ---- Picks ----

  // Get Picks
  const getPicks = async (filter, ID, limit, page, recent) =>
    await axios.get(
      getURIPath(
        "/picks",
        `?filter=${filter}${
          filter !== "all" ? `&ID=${ID}` : ""
        }&limit=${limit}&page=${page}&recent=${recent}`
      )
    );

  return (
    <APIContext.Provider
      value={{
        // Games
        getGames,
        getGame,
        createGame,
        updateGameBlitzballStats,
        updateGameSoccerStats,
        updateGameStatus,
        addGamePlayer,
        removeGamePlayer,
        deleteGame,

        // Players
        getPlayer,
        getPlayers,

        // Picks
        getPicks,
      }}
    >
      {props.children}
    </APIContext.Provider>
  );
};
