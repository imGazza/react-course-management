import { useState } from "react"
import { AreCoursesDifferent, Course, CourseWithSubscriptions } from "@/05-model/base/Course"
import CourseCard, { CourseCardSkeleton } from "./course-card"
import YearSelect from "./year-select"
import { Plus } from "lucide-react"
import CourseDialog from "@/02-components/ui/dialogs/course-dialog"
import GazzaDialog from "@/02-components/ui/dialogs/gazza-dialog"
import { Button } from "@/02-components/ui/button"
import useBreadcrumbs from "@/04-hooks/use-breadcrums"
import { createSkeletonArray, skeletonUniqueId } from "@/02-components/utils/misc"
import { courseSectionService } from "@/03-http/expanded/course-section-service"
import useBaseComponent from "@/04-hooks/use-base-component"

const CoursesSection = () => {

  const CURRENT_YEAR = new Date().getFullYear().toString();

  useBreadcrumbs([{ label: "Corsi", url: "#" }]);
  const {
    query: { data: courseWithSubscriptions = [] },
    onAdd,
    onEdit,
    onDelete,
    isLoading
  } = useBaseComponent<CourseWithSubscriptions, CourseWithSubscriptions[]>(
    {
      queryKey: ["courses"],
      fetch: courseSectionService.getCoursesSection,
      add: courseSectionService.addCourseSection,
      edit: courseSectionService.editCoursesSection,
      del: courseSectionService.deleteCourseSection,
      equals: courseSectionService.sameItem,
    }
  )

  const [year, setYear] = useState<string>(CURRENT_YEAR);

  const onAddCourse = async (course: Course) => {
    onAdd({ course: course, subscriptions: []  });
  }

  const onEditCourse = async (editedCourse: Course) => {
    const old = courseWithSubscriptions.find(c => c.course.id === editedCourse.id);
    if (!old || !AreCoursesDifferent(editedCourse, old.course))
      return;

    onEdit({ course: editedCourse, subscriptions: old.subscriptions });
  }

  const onDeleteCourse = async (deletedCourse: Course) => {
    const toDelete = courseWithSubscriptions.find(c => c.course.id === deletedCourse.id);
    if (!toDelete)
      return;
    onDelete(toDelete);
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
      <div className="flex items-center justify-between px-4 md:px-6">
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
          createSkeletonArray(12).map(() => (
            <CourseCardSkeleton key={skeletonUniqueId()} />
          ))
        }
      </div>
    </>
  )
}
export default CoursesSection
