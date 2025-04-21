import AuthProvider from "@/providers/auth/auth-provider";
import SidebarWrapper from "./sidebar/sidebar-wrapper";

const Root = () => {
    return (
        <>
            <AuthProvider>
                <SidebarWrapper />
            </AuthProvider>
        </>
    )
}
export default Root;