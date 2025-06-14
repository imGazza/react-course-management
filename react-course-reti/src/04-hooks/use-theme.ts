import { ThemeContext } from "@/06-providers/theme/theme-context"
import { useContext } from "react"

export const useTheme = () => {
	const context = useContext(ThemeContext)

	if (context === undefined)
		throw new Error("useTheme deve essere usato all'interno di un ThemeProvider")

	return context
}