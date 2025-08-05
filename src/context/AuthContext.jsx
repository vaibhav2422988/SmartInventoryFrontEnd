import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

// check for the token present in the local storage or not 
// if token is saved in local stoarge it parse the token and find username and role from token
  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({
          username: payload.unique_name || payload.sub,
          role: payload.role || payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
        });
      } catch (error) {
        console.error('Error decoding token:', error);
        logout();
      }
    }
    setLoading(false);
  }, [token]);

  //this methode will be called in login form and token response from the backend will get stored in local storage using this methode
  const login = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  // after pressing the logout button by co-worker or the manager it will remove token from local storage
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

// it will wrap our app.jsx (react app) to provide global auth state with all child components
// here the children means the appcontent main method in app.jsx
  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}  
    </AuthContext.Provider>
  );
};

//This is a custom React hook that gives your components easy access to the authentication context.
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
