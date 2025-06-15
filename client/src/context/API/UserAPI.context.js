import React, { createContext, useContext } from "react";
import axios from "axios";

// Contexts
import { useAuth } from "../Auth/Auth.context";

// User API Context
const UserAPIContext = createContext();
export const useUserAPI = () => useContext(UserAPIContext);
export const UserAPIContextProvider = (props) => {
  const { REACT_APP_API_URI } = process.env;
  const getURIPath = (path, query) =>
    REACT_APP_API_URI + "/users" + path + query;
  const { getAuthHeader } = useAuth();

  // ---- Users ----

  // Create User
  const createUser = async (data) =>
    await axios.post(getURIPath(`/`, ""), data);

  // Get User
  const getUser = async (uid) =>
    await axios.get(getURIPath(`/${uid}`, ""), getAuthHeader());

  return (
    <UserAPIContext.Provider value={{ createUser, getUser }}>
      {props.children}
    </UserAPIContext.Provider>
  );
};
