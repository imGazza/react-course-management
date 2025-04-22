import AuthProvider from "@/providers/auth/auth-provider";
import { ThemeProvider } from "@/providers/theme/theme-provider";
import MainWrapper from "./main-wrapper";

const Root = () => {
    return (
        <>
            <AuthProvider>
                <ThemeProvider>
                    <MainWrapper />
                </ThemeProvider>
            </AuthProvider>
        </>
    )
}
export default Root;