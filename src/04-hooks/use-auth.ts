import { AuthContext } from "@/06-providers/auth/auth-context"
import { useContext } from "react"

export const useAuth = () => {
	const context = useContext(AuthContext)

	if (context === undefined)
		throw new Error("useAuth deve essere usato all'interno di un AuthProvider")

	return context
}