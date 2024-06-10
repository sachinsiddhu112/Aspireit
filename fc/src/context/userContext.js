// src/UserContext.js
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

// Create the UserContext
const UserContext = createContext();

// Create a provider component
export const UserProvider = ({ children }) => {
  //getting the user details from browser memeory.
  const memUser=sessionStorage.getItem("user")?JSON.parse(sessionStorage.getItem("user")):"";
  const [user,setUser] = useState(memUser||{});

  //on changing the value of user ,updating the user as well as updating the value stored in browser memory.
  useEffect(()=>{
    sessionStorage.setItem("user",JSON.stringify(user));
  },[user])
  // Context value
  
const value={user,setUser};
  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

// Create a custom hook to use the UserContext
export const useUser = () => {
  return useContext(UserContext);
};
