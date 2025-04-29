import { createContext } from "react";
import { Course } from "@/model/Course";

export const CourseContext = createContext<{
    course: Course | null,
    lessonsNumber: number,
    subscribersNumber: number,
    setCourseData(course: Course): void,
    setLessonsNumber(lessonsNumber: number): void,
    setSubscribersNumber(subscribersNumber: number): void
}>({
    course: null,
    lessonsNumber: 0,
    subscribersNumber: 0,
    setCourseData: () => {},
    setLessonsNumber: () => {},
    setSubscribersNumber: () => {}
});
