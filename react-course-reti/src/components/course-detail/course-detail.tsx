import CourseDetailCards from "./course-detail-cards";
import CourseDetailMaterial from "./course-detail-material";
import CourseDetailLesson from "./course-detail-lesson";
import CourseDetailTabs from "./course-detail-tabs";
import CourseProvider from "@/providers/course/course-provider";
import { BreadcrumbContext } from "@/providers/breadcrumb/breadcrumb-context";
import { use, useContext, useEffect } from "react";

const CourseDetail = () => { 

  const { setBreadcrumbs } = useContext(BreadcrumbContext);

  useEffect(() => {
    setBreadcrumbs([
      {
        label: "Corsi",
        url: "/courses"
      },
      {
        label: "Dettaglio",
        url: "courses/detail" 
      }
    ])
    
  }, [])
  const classNames = "grid grid-cols-1 @xl/main:grid-cols-4 gap-4 px-4 *:data-[slot=card]:shadow-xs *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card lg:px-6";

  return (
    <CourseProvider>   
      <div className={classNames}>
        <CourseDetailCards />
      </div>      
      <div className={classNames}>
        <CourseDetailMaterial  />
        <CourseDetailLesson  />
      </div>
      <div className={classNames}>
        <CourseDetailTabs />
      </div> 
    </CourseProvider>
  )
}
export default CourseDetail;