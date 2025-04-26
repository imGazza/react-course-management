import CourseDetailCards from "./course-detail-cards";
import CourseDetailMaterial from "./course-detail-material";
import CourseDetailLesson from "./course-detail-lesson";
import CourseDetailSubscriber from "./course-detail-subscriber";

const CourseDetail = () => { 

  //TODO: Aggiungi controllo sul valore null del courseId

  return (
    <>      
      <CourseDetailCards />
      <div className="grid grid-cols-1 @xl/main:grid-cols-3 gap-4 px-4 *:data-[slot=card]:shadow-xs *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card lg:px-6">
        <CourseDetailMaterial  />
        <CourseDetailLesson  />        
        <CourseDetailSubscriber  />
      </div>
    </>
  )
}
export default CourseDetail;