import { Course } from "@/05-model/Course";
import { useMemo, useState } from "react";
import { CourseBasicInfoContext } from "./course-basic-info-context";

interface CourseProvidesProps {
    children: React.ReactNode;
}

function CourseBasicInfoProvider({ children }: Readonly<CourseProvidesProps>) {

    const [course, setCourse] = useState<Course | null>(null);
    const [subscriptionsNumber, setSubscriptionsNumber] = useState<number>(0);
    const [lessonsNumber, setLessonsNumber] = useState<number>(0);

    const setCourseData = (course: Course) => {
        setCourse(course);
    }

    const setLessonsNumberValue = (lessonsNumber: number) => {
        setLessonsNumber(lessonsNumber);
    }

    const setSubscriptionsNumberValue = (lessonsNumber: number) => {
        setSubscriptionsNumber(lessonsNumber);
    }

    const value = useMemo(
        () => {
            return {
                course: course,
                lessonsNumber: lessonsNumber,
                subscriptionsNumber: subscriptionsNumber,
                setCourseData: setCourseData,
                setLessonsNumber: setLessonsNumberValue,
                setSubscriptionsNumber: setSubscriptionsNumberValue                
            }
    },[course, lessonsNumber, subscriptionsNumber])

    return (
        <CourseBasicInfoContext.Provider value={value}>{children}</CourseBasicInfoContext.Provider>
    )
    
}
export default CourseBasicInfoProvider;