import { Course } from "@/model/Course";
import { useMemo, useState } from "react";
import { CourseContext } from "./course-context";

interface CourseProvidesProps {
    children: React.ReactNode;
}

function CourseProvider({ children }: CourseProvidesProps) {

    const [course, setCourse] = useState<Course | null>(null)

    const setCourseData = (course: Course) => {
        setCourse(course);
    }

    const value = useMemo(
        () => {
            return {
                course: course,
                setCourseData: setCourseData
            }
    },[course])

    return (
        <CourseContext.Provider value={value}>{children}</CourseContext.Provider>
    )
    
}
export default CourseProvider;