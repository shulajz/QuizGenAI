import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    const storedUsername = localStorage.getItem('username');
    if (storedUserId) {
      setUserId(JSON.parse(storedUserId));
    }
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const login = (id, username) => {
    setUserId(id);
    setUsername(username);
    localStorage.setItem('userId', JSON.stringify(id));
    localStorage.setItem('username', username);
  };

  const logout = () => {
    setUserId(null);
    setUsername(null);
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
  };

  return (
    <UserContext.Provider value={{ userId, username, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
