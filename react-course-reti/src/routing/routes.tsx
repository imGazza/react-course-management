import { createBrowserRouter } from "react-router";
import HomePage from "../components/homepage";
import Root from "@/components/root";
import ProtectedRoute from "@/components/utils/protected-route";
import AdminCourses from "../components/admin-dashboard";
import Login from "@/components/login";
import CourseDetail from "@/components/course-detail/course-detail";
import UsersSection from "@/components/users-list/users-section";
import UserDetail from "@/components/user-detail/user-detail";

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
                path: "login",
                children: [
                    {
                        index: true,
                        Component: Login
                    }
                ]
            },
            {
                path: "courses",
                children: [
                    {
                        index: true,
                        element: <ProtectedRoute><AdminCourses /></ProtectedRoute>
                    },
                    {
                        path: "detail/:courseId",
                        Component: CourseDetail
                    }
                ]
            },
            {
                path: "users",
                children: [
                    {
                        index: true,
                        element: <ProtectedRoute><UsersSection /></ProtectedRoute>
                    },
                    {
                        path: "detail/:userId",
                        Component: UserDetail
                    }
                ]
            }
        ]
    },
    

])