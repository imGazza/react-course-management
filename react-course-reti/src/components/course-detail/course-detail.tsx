import CourseDetailCards from "./course-detail-cards";
import CourseDetailMaterial from "./course-detail-material";
import CourseDetailLesson from "./course-detail-lesson";
import CourseDetailSubscriber from "./course-detail-subscriber";
import CourseDetailTabs from "./course-detail-tabs";

const CourseDetail = () => { 

  //TODO: Aggiungi controllo sul valore null del courseId
  const classNames = "grid grid-cols-1 @xl/main:grid-cols-4 gap-4 px-4 *:data-[slot=card]:shadow-xs *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card lg:px-6";

  return (
    <>   
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
    </>
  )
}
export default CourseDetail;