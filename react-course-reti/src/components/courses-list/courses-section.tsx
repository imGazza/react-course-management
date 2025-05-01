import { useEffect, useState } from "react"
import { addCourse, deleteCourse, editCourse, getCourses } from "@/http/course"
import { Course, CourseEntity } from "@/model/Course"
import CourseCard, { CourseCardSkeleton } from "./course-card"
import YearSelect from "./year-select"
import { Plus } from "lucide-react"
import CourseDialog from "@/components/utils/dialogs/course-dialog"
import GazzaDialog from "@/components/utils/gazza-dialog"
import { Button } from "../ui/button"
import { AreCoursesDifferent } from "../utils/course/course-utils"
import useBreadcrumbs from "@/hooks/use-breadcrums"

const CoursesSection = () => {

  useBreadcrumbs([{ label: "Corsi", url: "#" }]);

  const [courses, setCourses] = useState<CourseEntity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [year, setYear] = useState<string>("All");

  //TODO: Usa il fetch iniziale, magari chiedi alla AI se c'è un modo migliore
  useEffect(() => {
    setLoading(true);
    async function fetchCourses() {
      const courses = await getCourses();
      setCourses(courses);
      setLoading(false);
    }
    fetchCourses();
  }, [])

  const filteredCourses =
    year !== "All" ?
      courses.filter(course => course.year.toString() === year) :
      courses;

  const onAddCourse = async (course: Course) => {
    try {
      setLoading(true);
      const addedCourse = await addCourse(course);

      const addedCourseEntity: CourseEntity = { ...addedCourse, subscribers: [] }; 
      setCourses([...courses, addedCourseEntity]);
    } catch (e) {
      
    }
    finally{
      setLoading(false);
    }
  }

  const onEditCourse = async (course: Course) => {
    if (!AreCoursesDifferent(courses.find(c => c.id === course.id)!, course))
      return;

    try {
      setLoading(true);
      const editedCourse = await editCourse(course);

      const editedCourseEntity: CourseEntity = { ...editedCourse, subscribers: courses.find(c => c.id === course.id)?.subscribers || []  };
      setCourses(courses.map(c => c.id === course.id ? editedCourseEntity : c));
    } catch (e) {
    }
    finally{
      setLoading(false);
    }
  }

  const onDeleteCourse = async (id: string) => {
    try {
      setLoading(true);
      await deleteCourse(id);
      setCourses(courses.filter(course => course.id !== id));
    } catch (e) {
    }
    finally{
      setLoading(false);
    }
  }

  return (
    <>
      <div className="flex items-center justify-end px-6">
        <YearSelect year={year} onSelectedYear={setYear} />
        <GazzaDialog dialogComponent={(props) => <CourseDialog submit={onAddCourse} {...props} />}>
          <Button variant="outline" className="flex items-center gap-1 cursor-pointer">
            <Plus className="h-4 w-4" />
            Aggiungi
          </Button>
        </GazzaDialog>
      </div>
      <div className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card lg:px-6">
        {!loading ?
          filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} onEdit={onEditCourse} onDelete={onDeleteCourse} />
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
export default CoursesSection
