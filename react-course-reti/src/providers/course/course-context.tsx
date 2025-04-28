import { createContext } from "react";
import { Course } from "@/model/Course";

export const CourseContext = createContext<{
    course: Course | null,
    setCourseData(course: Course): void,
}>({
    course: null,
    setCourseData: () => {},
});
