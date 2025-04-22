import AuthProvider from "@/providers/auth/auth-provider";
import SidebarWrapper from "./sidebar/sidebar-wrapper";
import { ThemeProvider } from "@/providers/theme/theme-provider";

const Root = () => {
    return (
        <>
            <AuthProvider>
                <ThemeProvider>
                    <SidebarWrapper />
                </ThemeProvider>
            </AuthProvider>
        </>
    )
}
export default Root;