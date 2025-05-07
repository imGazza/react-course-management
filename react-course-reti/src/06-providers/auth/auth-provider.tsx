import { useMemo, useState } from "react";
import { AuthContext } from "./auth-context";
import { User } from "@/05-model/User";
import { useNavigate } from "react-router";

interface AuthProviderProps {
    children: React.ReactNode;
}

function AuthProvider({children}: Readonly<AuthProviderProps>) {
  const [user, setUser] = useState<User | null>(
    () => {
        const loggedUser = localStorage.getItem('user');
        return loggedUser ? JSON.parse(loggedUser) : null;
    }
  );
  const navigate = useNavigate();

  const setSessionUser = (user: User) => {
    setUser(user);
    localStorage.setItem('user', JSON.stringify(user));
  }

  const removeSessionUser = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/login');
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