import React, { createContext, useContext } from "react";

// Firebase
import { initializeApp } from "firebase/app";
import {
  deleteUser,
  onAuthStateChanged,
  signOut,
  getAuth,
  signInWithCustomToken,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "slipit-709c0.firebaseapp.com",
  projectId: "slipit-709c0",
  storageBucket: "slipit-709c0.firebasestorage.app",
  messagingSenderId: "33127354761",
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: "G-5ZZ2603QXW",
};

// Firebase Context
const FirebaseContext = createContext();
export const useFirebase = () => useContext(FirebaseContext);
export const FirebaseContextProvider = (props) => {
  const firebaseApp = initializeApp(firebaseConfig);
  const Auth = getAuth();

  // Get Current User
  const getCurrentUser = (cb) => {
    onAuthStateChanged(Auth, (user) => cb(user));
  };

  // Sign in User with Custom Access Token
  const authUserWithCustomToken = async (customAccessToken) => {
    try {
      const userCredential = await signInWithCustomToken(
        Auth,
        customAccessToken
      );
      return userCredential;
    } catch (error) {
      console.error("Error signing in with custom token:", error);
    }
  };

  // Log Out User
  const logoutFirebaseUser = async () => {
    try {
      await signOut(Auth);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Delete Firebase User
  const deleteFirebaseUser = async () => {
    try {
      await deleteUser(Auth.currentUser);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <FirebaseContext.Provider
      value={{
        firebaseApp,
        Auth,
        functions: {
          getCurrentUser,
          authUserWithCustomToken,
          logoutFirebaseUser,
          deleteFirebaseUser,
        },
      }}
    >
      {props.children}
    </FirebaseContext.Provider>
  );
};
