import { Course } from "@/model/Course";
import CourseDetailCards, { CourseDetailCardsSkeleton } from "./course-detail-cards";
import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { deleteCourse, editCourse, getCourse } from "@/http/course";
import { areThereDifferences } from "../utils/course/course-utils";
import CourseDetailMaterial from "./course-detail-material";

const CourseDetail = () => {

  const { id } = useParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [course, setCourse] = useState<Course | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    async function fetchCourses() {
      const course = await getCourse(id!);
      setCourse(course);
      setLoading(false);
    }
    fetchCourses();
  }, [])

  const onEditCourse = async (editedCourse: Course) => {
    if (!areThereDifferences(course!, editedCourse))
      return;

    try {
      setLoading(true);
      const course = await editCourse(editedCourse);
      setCourse(course);
    } catch (e) {

    }
    finally {
      setLoading(false);
    }
  }

  const onDeleteCourse = async (id: string) => {
    try {
      setLoading(true);
      await deleteCourse(id);
      navigate("/admin");
    } catch(e) {
      setLoading(false);
    }
  }

  return (
    <>
      {course && !loading ?
        <CourseDetailCards course={course} onEdit={onEditCourse} onDelete={onDeleteCourse}/>
        :
        <CourseDetailCardsSkeleton />
      }
      <CourseDetailMaterial courseId={id!} />
    </>
  )
}
export default CourseDetail;