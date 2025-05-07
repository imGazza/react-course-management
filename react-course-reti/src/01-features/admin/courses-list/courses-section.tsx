import { useState } from "react"
import { addCourse, deleteCourse, editCourse, getCourses } from "@/03-http/course"
import { Course, CourseSubscribers } from "@/05-model/Course"
import CourseCard, { CourseCardSkeleton } from "./course-card"
import YearSelect from "./year-select"
import { Plus } from "lucide-react"
import CourseDialog from "@/02-components/utils/dialogs/course-dialog"
import GazzaDialog from "@/02-components/ui/gazza-dialog"
import { Button } from "@/02-components/ui/button"
import { AreCoursesDifferent } from "@/02-components/utils/course/course-utils"
import useBreadcrumbs from "@/04-hooks/use-breadcrums"
import useBaseComponent from "@/04-hooks/use-base-component"

const CoursesSection = () => {

  const CURRENT_YEAR = new Date().getFullYear().toString();

  useBreadcrumbs([{ label: "Corsi", url: "#" }]);
  const { 
    query: { data: courses = [] }, 
    onAdd, 
    onEdit, 
    onDelete,
    isLoading } = useBaseComponent<Course, CourseSubscribers, CourseSubscribers[]>(
    {
      queryKey: ["courses"],
      fetchFunction: getCourses,
      addFunction: addCourse,
      editFunction: editCourse,
      deleteFunction: deleteCourse,
      relations: { key: 'subscribers' }
    }
  )

  const [year, setYear] = useState<string>(CURRENT_YEAR);

  const onAddCourse = async (course: Course) => {
    await onAdd(course);
  }

  const onEditCourse = async (course: Course) => {
    if(!AreCoursesDifferent(course, courses.find(c => c.id === course.id)!))
      return;

    await onEdit(course);
  }

  const onDeleteCourse = async (id: string) => {
    await onDelete(id);
  };

  const filteredCourses =
    year !== CURRENT_YEAR ?
      courses.filter(course => course.year.toString() === year) :
      courses;

  const { minYear, maxYear } = courses.reduce((acc, course) => {
    const courseYear = parseInt(course.year.toString());
    return {
      minYear: Math.min(acc.minYear, courseYear),
      maxYear: Math.max(acc.maxYear, courseYear)
    };
  }, { minYear: new Date().getFullYear(), maxYear: new Date().getFullYear() });

  return (
    <>
      <div className="flex items-center justify-end px-6">
        <YearSelect year={year} minYear={minYear} maxYear={maxYear} onSelectedYear={setYear} />
        <GazzaDialog dialogComponent={(props) => <CourseDialog submit={onAddCourse} {...props} />}>
          <Button variant="outline" className="flex items-center gap-1 cursor-pointer">
            <Plus className="h-4 w-4" />
            Aggiungi
          </Button>
        </GazzaDialog>
      </div>
      <div className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card lg:px-6">
        {!isLoading ?
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
