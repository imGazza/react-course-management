import { useEffect, useState } from "react"
import { courseService } from "@/03-http/base/services/course"
import { Course, CourseWithSubscriptions } from "@/05-model/Course"
import CourseCard, { CourseCardSkeleton } from "./course-card"
import YearSelect from "./year-select"
import { Plus } from "lucide-react"
import CourseDialog from "@/02-components/utils/dialogs/course-dialog"
import GazzaDialog from "@/02-components/ui/gazza-dialog"
import { Button } from "@/02-components/ui/button"
import { AreCoursesDifferent } from "@/02-components/utils/course/course-utils"
import useBreadcrumbs from "@/04-hooks/use-breadcrums"
import useBaseComponentCustom from "@/04-hooks/use-base-component-custom"
import { courseSubscriptionService } from "@/03-http/course-subscription-service"

const CoursesSection = () => {

  const CURRENT_YEAR = new Date().getFullYear().toString();

  useBreadcrumbs([{ label: "Corsi", url: "#" }]);
  const { 
    query: { data: courseWithSubscriptions = [] },
    onAdd, 
    onEdit, 
    onDelete,
    isLoading
  } = useBaseComponentCustom<Course, CourseWithSubscriptions, 'course', CourseWithSubscriptions[]>(
    {
      queryKey: ["courses"],
      fetch: () => courseSubscriptionService.getCourseWithSubscriptions(),
      add: courseService.add,
      edit: courseService.edit,
      del: courseService.deleteCourse,
      entityKey: 'course',
      defaultEmptyItem: {  subscriptions: [] },
    }
  )

  const [year, setYear] = useState<string>(CURRENT_YEAR);

  const onAddCourse = async (course: Course) => {
    onAdd(course);
  }

  const onEditCourse = async (course: Course) => {
    if(!AreCoursesDifferent(course, courseWithSubscriptions.find(c => c.course.id === course.id)!.course))
      return;

    onEdit(course);
  }

  const onDeleteCourse = async (id: string) => {
    onDelete(id);
  };

  const filteredCoursesWithSubscriptions = courseWithSubscriptions.length > 0 ? courseWithSubscriptions.filter(c => c.course.year.toString() === year) : [];

  const { minYear, maxYear } = courseWithSubscriptions.reduce((acc, c) => {
    const courseYear = parseInt(c.course.year.toString());
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
          filteredCoursesWithSubscriptions.map((c) => (
            <CourseCard key={c.course.id} courseWithSubscriptions={c} onEdit={onEditCourse} onDelete={onDeleteCourse} />
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
