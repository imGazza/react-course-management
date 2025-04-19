import { Outlet } from "react-router"
import AuthProvider from "@/providers/auth/auth-provider";
import SidebarWrapper from "./sidebar/sidebar-wrapper";

const Root = () => {
    return (
        <>
            <AuthProvider>
                <SidebarWrapper>
                    <Outlet />
                </SidebarWrapper>
            </AuthProvider>
        </>
    )
}
export default Root;