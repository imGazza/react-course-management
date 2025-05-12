import { Course } from "@/05-model/Course";
import { useMemo, useState } from "react";
import { CourseBasicInfoContext } from "./course-basic-info-context";

interface CourseProvidesProps {
    children: React.ReactNode;
}

function CourseBasicInfoProvider({ children }: Readonly<CourseProvidesProps>) {

    const [course, setCourse] = useState<Course | null>(null);
    const [subscribersNumber, setSubscribersNumber] = useState<number>(0);
    const [lessonsNumber, setLessonsNumber] = useState<number>(0);

    const setCourseData = (course: Course) => {
        setCourse(course);
    }

    const setLessonsNumberValue = (lessonsNumber: number) => {
        setLessonsNumber(lessonsNumber);
    }

    const setSubscribersNumberValue = (lessonsNumber: number) => {
        setSubscribersNumber(lessonsNumber);
    }

    const value = useMemo(
        () => {
            return {
                course: course,
                lessonsNumber: lessonsNumber,
                subscribersNumber: subscribersNumber,
                setCourseData: setCourseData,
                setLessonsNumber: setLessonsNumberValue,
                setSubscribersNumber: setSubscribersNumberValue                
            }
    },[course, lessonsNumber, subscribersNumber])

    return (
        <CourseBasicInfoContext.Provider value={value}>{children}</CourseBasicInfoContext.Provider>
    )
    
}
export default CourseBasicInfoProvider;