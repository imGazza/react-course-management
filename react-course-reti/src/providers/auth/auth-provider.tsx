import { useMemo, useState } from "react";
import { AuthContext, User } from "./auth-context";

interface AuthProviderProps {
    children: React.ReactNode;
}

function AuthProvider({children}: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(
    () => {
        const loggedUser = localStorage.getItem('user');
        return loggedUser ? JSON.parse(loggedUser) : null;
    }
  );

  const setSessionUser = (user: User) => {
    setUser(user);
    localStorage.setItem('user', JSON.stringify(user));
  }

  const removeSessionUser = () => {
    setUser(null);
    localStorage.removeItem('user');
  }

  const userValue = useMemo(
    () => {
        return {
            user,
            setSessionUser,
            removeSessionUser 
        }
    }, [user]
  ) 

  return (
    <AuthContext.Provider value={userValue}>{children}</AuthContext.Provider>
  )
}
export default AuthProvider;