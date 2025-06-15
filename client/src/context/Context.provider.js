import React from "react";

// Contexts
import { AuthContextProvider } from "./Auth/Auth.context";
import { UserAPIContextProvider } from "./API/UserAPI.context";
import { FirebaseContextProvider } from "./Firebase/Firebase.context";
import { UserContextProvider } from "./User/User.context";
import { GlobalContextProvider } from "./Global/Global.context";
import { ErrorContextProvider } from "./Error/Error.context";

function ContextProvider(props) {
  return (
    <GlobalContextProvider>
      <ErrorContextProvider>
        <FirebaseContextProvider>
          <AuthContextProvider>
            <UserContextProvider>
              <UserAPIContextProvider>{props.children}</UserAPIContextProvider>;
            </UserContextProvider>
          </AuthContextProvider>
        </FirebaseContextProvider>
      </ErrorContextProvider>
    </GlobalContextProvider>
  );
}

export default ContextProvider;
