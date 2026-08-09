import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user] = useState({
    id: 'default_user',
    username: 'default_user',
    email: 'default@example.com',
    full_name: 'Default User'
  });
  const [loading] = useState(false);

  const fetchProfile = async () => {};
  const login = async () => {
    return { user };
  };
  const register = async () => {
    return { user };
  };
  const logout = async () => {};

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, fetchProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);



