import React, { createContext, useContext } from "react";
import axios from "axios";

// API Context
const APIContext = createContext();
export const useAPI = () => useContext(APIContext);
export const APIContextProvider = (props) => {
  const { REACT_APP_API_URI } = process.env;
  const getURIPath = (path, query) => REACT_APP_API_URI + path + query;

  // Get Games
  const getGames = async (limit, page, recent) =>
    await axios.get(
      getURIPath("/games", `?limit=${limit}&page=${page}&recent=${recent}`)
    );

  return (
    <APIContext.Provider value={{ getGames }}>
      {props.children}
    </APIContext.Provider>
  );
};
