import { Course } from "@/model/Course";
import CourseCard from "../courses-list/course-card";
import CourseDetailCards from "./course-detail-cards";
import CourseCards from "./course-detail-cards";
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { getCourse } from "@/http/course";

const CourseDetail = () => {

    const { id } = useParams();
    const [loading, setLoading] = useState<boolean>(true);
    const [course, setCourse] = useState<Course | null>(null);
  
    useEffect(() => {
      setLoading(true);
      async function fetchCourses() {
        const course = await getCourse(id!);
        setCourse(course);
        setLoading(false);
      }
      fetchCourses();
    })

    return (
        <>
            {course &&
                <CourseDetailCards course={course} />
            }
        </>
    )
}
export default CourseDetail;