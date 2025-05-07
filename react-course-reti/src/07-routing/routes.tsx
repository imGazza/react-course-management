import { createBrowserRouter } from "react-router";
import Root from "@/01-features/shared/layout/root";
import ProtectedRoute from "@/01-features/shared/auth/protected-route";
import AdminCourses from "@/01-features/shared/layout/admin-dashboard";
import Login from "@/01-features/shared/auth/login";
import UserDetail from "@/01-features/admin/user-detail/user-detail";
import ProfilePage from "@/01-features/shared/profile/profile-page";
import CourseDetail from "@/01-features/admin/course-detail/course-detail";
import UsersSection from "@/01-features/admin/users-list/users-section";
import PersonalCoursesList from "@/01-features/shared/personal-courses/personal-courses-list";
import Statistics from "@/01-features/admin/statistics/statistics";

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