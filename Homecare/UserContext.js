import React, { createContext, useState } from 'react';

export const UserContext = createContext({
  userEmail: '',
  setUserEmail: () => {},
});

export const UserProvider = ({ children }) => {
  const [userEmail, setUserEmail] = useState('');

  return (
    <UserContext.Provider value={{ userEmail, setUserEmail }}>
      {children}
    </UserContext.Provider>
  );
};
