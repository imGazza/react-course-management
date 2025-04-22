import { useEffect, useState } from "react"
import { addCourse, deleteCourse, editCourse, getCourses } from "@/http/course"
import { Course } from "@/model/Course"
import CourseCard, { CourseCardSkeleton } from "./course-card"
import YearSelect from "./year-select"
import { Plus } from "lucide-react"
import CourseDialog from "@/components/utils/dialogs/course-dialog"
import GazzaDialog from "@/components/utils/gazza-dialog"
import { Button } from "../ui/button"

const areThereDifferences = (course: Course, editedCourse: Course) => {
  return course.name !== editedCourse.name || course.description !== editedCourse.description || course.year !== editedCourse.year || course.status !== editedCourse.status;
}

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

  const onAddCourse = async (course: Course) => {
    try{
      setLoading(true);
      const addedCourse = await addCourse(course);
      setAllCourses([...allCourses, addedCourse]);
    } catch(e){
      console.log(e);
      setLoading(false);
    }
  }

  const onEditCourse = async (course: Course) => {
    if(!areThereDifferences(allCourses.find(c => c.id === course.id)!, course))
      return;

    try {
      setLoading(true);
      const editedCourse = await editCourse(course);
      setAllCourses(allCourses.map(c => c.id === course.id ? c : editedCourse));
    } catch(e) {
      console.log(e);
      setLoading(false);
    }    
  }

  const onDeleteCourse = async (id: string) => {
    try {
      setLoading(true);
      await deleteCourse(id);
      setAllCourses(allCourses.filter(course => course.id !== id));
    } catch(e) {
      console.log(e);
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
          filteredCourses.map(course => (
            <CourseCard key={course.id} course={course} onEdit={onEditCourse} onDelete={onDeleteCourse}/>
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
