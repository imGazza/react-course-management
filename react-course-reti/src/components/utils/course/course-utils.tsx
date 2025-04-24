import { Course } from "@/model/Course";

export const areThereDifferences = (course: Course, editedCourse: Course) => {
    return course.name !== editedCourse.name || course.description !== editedCourse.description || course.year !== editedCourse.year || course.status !== editedCourse.status;
}