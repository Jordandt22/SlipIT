import React, { createContext, useContext, useState } from "react";

// User Context
const UserContext = createContext();
export const useUser = () => useContext(UserContext);
export const UserContextProvider = ({ children }) => {
  const [userState, setUserState] = useState(null);

  // Update User
  const updateUserState = (newUserState) =>
    setUserState((curUserState) => ({ ...curUserState, ...newUserState }));

  return (
    <UserContext.Provider value={{ userState, updateUserState }}>
      {children}
    </UserContext.Provider>
  );
};
