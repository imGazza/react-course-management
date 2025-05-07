import { useEffect, useMemo, useState } from "react"
import { Theme, ThemeContext } from "./theme-context"

interface ThemeProviderProps {
    children: React.ReactNode
    defaultTheme?: Theme
    storageKey?: string
}

export function ThemeProvider({
    children,
    defaultTheme = "dark",
    storageKey = "course-react-theme"
}: ThemeProviderProps) {
    const [theme, setTheme] = useState<Theme>(
        () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
    )

    useEffect(() => {
        const root = window.document.documentElement

        root.classList.remove("light", "dark")

        root.classList.add(theme)
    }, [theme])

    const themeValue = useMemo(
        () => {
            return {
                theme,
                setTheme: (theme: Theme) => {
                    localStorage.setItem(storageKey, theme)
                    setTheme(theme)
                }
            }
        }, [theme])

    return (
        <ThemeContext.Provider value={themeValue}>{children}</ThemeContext.Provider>
    )
}
