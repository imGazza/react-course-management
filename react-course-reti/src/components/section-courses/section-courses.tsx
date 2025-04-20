import { useEffect, useState } from "react"
import { getCourses } from "@/http/course"
import { Course } from "@/model/Course"
import CourseCard, { CourseCardSkeleton } from "./course-card"
import YearSelect from "../utils/year-select"
import AddNewButton from "../utils/add-new-button"

const SectionCourses = () => {

  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [year, setYear] = useState<string>("All");


  useEffect(() => {
    setLoading(true);
    async function fetchCourses(){      
      const courses = await getCourses();
      setAllCourses(courses);
      setLoading(false);
    }
    fetchCourses();

  }, [])

  const filteredCourses = 
    year !== "All" ? 
    allCourses.filter(course => course.year.toString() === year) :
    allCourses;
  

  return (
    <>
      <YearSelect year={year} onSelectedYear={setYear} />
      <AddNewButton addComponent={(<div>Ciao</div>)} />
      <div className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card lg:px-6">
        {!loading ?
          filteredCourses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))
          :
          Array.from({ length: 12 }).map((_, index) => (
            <CourseCardSkeleton key={index} />
          ))
        }
      </div>
    </>
  )
}
export default SectionCourses
