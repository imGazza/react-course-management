import CourseDetailCards, { CourseDetailCardsSkeleton } from "./course-detail-cards";
import CourseDetailMaterial, { CourseDetailMaterialSkeleton } from "./course-detail-material";
import CourseDetailLesson, { CourseDetailLessonSkeleton } from "./course-detail-lesson";
import CourseDetailTabs, { CourseDetailTabsSkeleton } from "./course-detail-tabs";
import useBreadcrumbs from "@/04-hooks/use-breadcrums";
import CourseBasicInfoProvider from "@/06-providers/course/course-basic-info-provider";
import { Suspense } from "react";

const CourseDetail = () => {

  useBreadcrumbs(
    [
      {
        label: "Corsi",
        url: "/courses"
      },
      {
        label: "Dettaglio",
        url: "#"
      }
    ]
  );

  const classNames = "grid grid-cols-1 @xl/main:grid-cols-4 gap-4 px-4 *:data-[slot=card]:shadow-xs *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card lg:px-6";

  return (
    <CourseBasicInfoProvider>
      <div className={classNames}>
        <Suspense fallback={<CourseDetailCardsSkeleton />}>
          <CourseDetailCards />
        </Suspense>

      </div>
      <div className={classNames}>
        <Suspense fallback={<CourseDetailMaterialSkeleton />}>
          <CourseDetailMaterial />
        </Suspense>
        <Suspense fallback={<CourseDetailLessonSkeleton />}>
          <CourseDetailLesson />
        </Suspense>
      </div>
      <div className={classNames}>
        <Suspense fallback={<CourseDetailTabsSkeleton />}>
          <CourseDetailTabs />
        </Suspense>
      </div>
    </CourseBasicInfoProvider>
  )
}
export default CourseDetail;