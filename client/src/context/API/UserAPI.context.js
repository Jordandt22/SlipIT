import React, { createContext, useContext } from "react";
import axios from "axios";

// User API Context
const UserAPIContext = createContext();
export const useUserAPI = () => useContext(UserAPIContext);
export const UserAPIContextProvider = (props) => {
  const { REACT_APP_API_URI } = process.env;
  const getURIPath = (path, query) =>
    REACT_APP_API_URI + "/users" + path + query;

  // ---- Users ----

  // Create User
  const createUser = async (data) =>
    await axios.post(getURIPath(`/signup`, ""), data);

  return (
    <UserAPIContext.Provider value={{ createUser }}>
      {props.children}
    </UserAPIContext.Provider>
  );
};
