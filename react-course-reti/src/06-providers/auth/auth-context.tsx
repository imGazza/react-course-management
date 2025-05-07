import { User } from "@/05-model/User";
import { createContext } from "react";

export const AuthContext = createContext<{
    user: User | null,
    setSessionUser: (user: User) => void,
    removeSessionUser: () => void
}>({
    user: null,
    setSessionUser: () => {},
    removeSessionUser: () => {}
})
