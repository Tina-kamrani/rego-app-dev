import React, { createContext, useState } from 'react';

// Create the Auth Context
export const AuthContext = createContext();

// Create a Provider component
export const AuthProvider = ({ children }) => {
  const [userdata, setUserdata] = useState(null);

  return (
    <AuthContext.Provider value={{ userdata, setUserdata }}>
      {children}
    </AuthContext.Provider>
  );
};