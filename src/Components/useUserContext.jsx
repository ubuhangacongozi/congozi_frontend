import { createContext, useContext, useState, useEffect, useMemo } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [state, setState] = useState({
    user: null,
    userRole: null,
    loading: true
  });

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setState(prev => ({ ...prev, loading: true }));
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setState({
            user: parsedUser,
            userRole: parsedUser.role,
            loading: false
          });
        } else {
          setState(prev => ({ ...prev, loading: false }));
        }
      } catch (error) {
        console.error("Failed to load user data:", error);
        setState(prev => ({ ...prev, loading: false }));
      }
    };

    loadUserData();
  }, []);

  const value = useMemo(() => ({
    ...state,
    setUser: (user) => setState({ user, userRole: user?.role, loading: false })
  }), [state]);

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);