import { PersonalCoursesInfo } from "@/05-model/PersonalCourses";
import { courseService } from "./base/services/course";
import { subscriberService } from "./base/services/subscriber";

class PersonalCoursesService  {

	// Restituisce informazioni sull'utente riguardo le iscrizioni e lo stato 
	async getPersonalCoursesWithInfo(userId: string): Promise<PersonalCoursesInfo[]>{

		const personalCourses = await courseService.getCoursesWithLessonsAndMaterialsByUserId(userId);
        const personalSubs = await subscriberService.getSubscriptionsByUserId(userId);

		return personalCourses.map(pc => ({ 
            course: pc.course, 
            lessons: pc.lessons, 
            materials: pc.materials,
            progress: { 
                lessonsCompleted: pc.lessons.filter(l => new Date(l.lessonDate) < new Date()).length, 
                percentageCompleted: pc.lessons.filter(l => new Date(l.lessonDate) < new Date()).length / pc.lessons.length * 100},
            grade: personalSubs.find(sub => sub.courseId === pc.course.id)?.grade ?? null }))

	}

}
export const personalCoursesService = new PersonalCoursesService();