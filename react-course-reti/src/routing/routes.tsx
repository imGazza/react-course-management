import { createBrowserRouter } from "react-router";
import HomePage from "../components/homepage";
import Root from "@/components/root";
import ProtectedRoute from "@/components/utils/protected-route";
import AdminDashboard from "../components/admin-dashboard";
import Login from "@/components/login";

export const routes = createBrowserRouter([
    {
        path: "/",
        Component: Root,
        children: [
            {
                index: true,
                Component: HomePage,
            },
            {
                path: "/login",
                children: [
                    {
                        index: true,
                        Component: Login
                    }
                ]
            },
            {
                path: "/admin",
                children: [
                    {
                        index: true,
                        element: <ProtectedRoute><AdminDashboard /></ProtectedRoute>
                    },
                    {
                        path: "create",
                        Component: HomePage
                    }
                ]
            }
        ]
    },
    

])

export const navigationTitles: Record<string, string> = {
    "": "Home",
    "login": "Login",
    "admin": "Dashboard",
    "create": "Create",
}