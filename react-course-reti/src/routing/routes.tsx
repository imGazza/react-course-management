import { createBrowserRouter } from "react-router";
import HomePage from "../components/homepage";
import Root from "@/components/root";
import ProtectedRoute from "@/components/utils/protected-route";
import AdminCourses from "../components/admin-dashboard";
import Login from "@/components/login";
import CourseDetail from "@/components/course-detail/course-detail";
import UsersSection from "@/components/users-list/users-section";
import UserDetail from "@/components/user-detail/user-detail";
import ProfilePage from "@/components/profile/profile-page";
import PersonalCoursesList from "@/components/personal-courses/personal-courses-list";
import Statistics from "@/components/statistics/statistics";

export const routes = createBrowserRouter([
    {
        path: "/",
        Component: Root,
        children: [
            {
                index: true,
                Component: ProfilePage,
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
            },
            {
                path: "profile",
                Component: ProfilePage
            },
            {
                path: "my-courses",
                Component: PersonalCoursesList
            },
            {
                path: "stats",
                Component: Statistics
            }
        ]
    },
    

])