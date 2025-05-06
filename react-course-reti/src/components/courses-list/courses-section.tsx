import { useEffect, useState } from "react"
import { addCourse, deleteCourse, editCourse, getCourses } from "@/http/course"
import { Course, CourseSubscribers } from "@/model/Course"
import CourseCard, { CourseCardSkeleton } from "./course-card"
import YearSelect from "./year-select"
import { Plus } from "lucide-react"
import CourseDialog from "@/components/utils/dialogs/course-dialog"
import GazzaDialog from "@/components/ui/gazza-dialog"
import { Button } from "../ui/button"
import { AreCoursesDifferent } from "../utils/course/course-utils"
import useBreadcrumbs from "@/hooks/use-breadcrums"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

const CoursesSection = () => {

  useBreadcrumbs([{ label: "Corsi", url: "#" }]);

  const [year, setYear] = useState<string>(new Date().getFullYear().toString());
  const queryClient = useQueryClient();

  const [loading, setLoading] = useState(false);
  
  const { data: courses = [], isLoading } = useQuery<CourseSubscribers[]>({
    queryKey: ['courses'],
    queryFn: () => getCourses(),
  })

  const addCourseMutation = useMutation({
    mutationFn: addCourse,
    onSuccess: (addedCourse) => {
      queryClient.setQueryData(['courses'], (prev: CourseSubscribers[]) => {
        return [...prev, { addedCourse, subscribers: [] }];
      });
    }
  });

  const editCourseMutation = useMutation({
    mutationFn: editCourse,
    onSuccess: (editedCourse) => {
      queryClient.setQueryData(['courses'], (prev: CourseSubscribers[]) => {
        return prev
          .map(course => course.id === editedCourse.id ? 
            { ...editedCourse, subscribers: course.subscribers ?? [] } : course);
      });
    }
  });
  
  const deleteCourseMutation = useMutation({
    mutationFn: (id: string) => deleteCourse(id),
    onSuccess: (_, id) => {
      queryClient.setQueryData(['courses'], (prev: CourseSubscribers[]) => {
        return prev.filter(course => course.id !== id);
      });
    }
  });

  const filteredCourses =
    year !== "All" ?
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
        <GazzaDialog dialogComponent={(props) => <CourseDialog submit={addCourseMutation.mutateAsync} {...props} />}>
          <Button variant="outline" className="flex items-center gap-1 cursor-pointer">
            <Plus className="h-4 w-4" />
            Aggiungi
          </Button>
        </GazzaDialog>
      </div>
      <div className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card lg:px-6">
        {!loading ?
          filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} onEdit={editCourseMutation.mutateAsync} onDelete={deleteCourseMutation.mutateAsync} />
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
