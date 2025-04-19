import { createContext } from "react";

export interface User{
    id: number;
    username: string;
    email: string;
    isAdmin: boolean;
}

export const AuthContext = createContext<{
    user: User | null,
    setSessionUser: (user: User) => void,
    removeSessionUser: () => void
}>({
    user: null,
    setSessionUser: () => {},
    removeSessionUser: () => {}
})