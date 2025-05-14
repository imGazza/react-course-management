import { createContext } from "react";
import { Course } from "@/05-model/base/Course";

export const CourseBasicInfoContext = createContext<{
    course: Course | null,
    lessonsNumber: number,
    subscriptionsNumber: number,
    setCourseData(course: Course): void,
    setLessonsNumber(lessonsNumber: number): void,
    setSubscriptionsNumber(subscribptionsNumber: number): void
}>({
    course: null,
    lessonsNumber: 0,
    subscriptionsNumber: 0,
    setCourseData: () => {},
    setLessonsNumber: () => {},
    setSubscriptionsNumber: () => {}
});
