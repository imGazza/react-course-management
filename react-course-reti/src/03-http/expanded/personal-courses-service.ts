import { PersonalCoursesInfo } from "@/05-model/PersonalCourse";
import { courseService } from "../base/services/course";
import { subscriptionService } from "../base/services/subscription";
import { Course } from "@/05-model/base/Course";
import { ExpandedService } from "./expanded-service";

class PersonalCoursesService extends ExpandedService<PersonalCoursesInfo>  {

	sameItem(item1: PersonalCoursesInfo, item2: PersonalCoursesInfo): boolean {
		return item1.course.id === item2.course.id;
	}

	// Restituisce informazioni sull'utente riguardo le iscrizioni e lo stato 
	async getPersonalCoursesWithInfo(userId: string): Promise<PersonalCoursesInfo[]>{

		const [allCoursesEmbedsLessonsAndMaterials, personalSubs] = await Promise.all([
			courseService.getCoursesEmbedsLessonsAndMaterials(),
			subscriptionService.getSubscriptionsByUserId(userId)
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