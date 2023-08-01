import { createContext, useState } from 'react';

// Create the UserContext
const UserContext = createContext();

// Create a Provider component to wrap the components that need access to the user data
const UserProvider = ({ children }) => {
  const [username, setUsername] = useState('');

  return (
    <UserContext.Provider value={{ username, setUsername }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
