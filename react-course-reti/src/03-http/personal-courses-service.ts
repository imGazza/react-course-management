import { PersonalCoursesInfo } from "@/05-model/PersonalCourses";
import { courseService } from "./base/services/course";
import { subscriberService } from "./base/services/subscriber";
import { Course } from "@/05-model/Course";

class PersonalCoursesService  {

	// Restituisce informazioni sull'utente riguardo le iscrizioni e lo stato 
	async getPersonalCoursesWithInfo(userId: string): Promise<PersonalCoursesInfo[]>{

        const [allCoursesEmbedsLessonsAndMaterials, personalSubs] = await Promise.all([
            courseService.getCoursesEmbedsLessonsAndMaterials(),
            subscriberService.getSubscriptionsByUserId(userId)
        ]);
        const personalCourses = allCoursesEmbedsLessonsAndMaterials.filter(course => personalSubs.find(sub => sub.courseId === course.id));

		return personalCourses.map(pc => ({
            course: pc as Course,
            lessons: pc.lessons, 
            materials: pc.materials,
            progress: { 
                lessonsCompleted: pc.lessons.filter(l => new Date(l.lessonDate) < new Date()).length, 
                percentageCompleted: pc.lessons.filter(l => new Date(l.lessonDate) < new Date()).length / pc.lessons.length * 100},
            grade: personalSubs.find(sub => sub.courseId === pc.id)?.grade ?? null }))
	}

}
export const personalCoursesService = new PersonalCoursesService();