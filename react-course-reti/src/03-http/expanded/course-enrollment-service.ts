import { CourseEnrollmentInfoForUser } from "@/05-model/base/Course";
import { subscriptionService } from "../base/services/subscription";
import { courseSubscriptionService } from "./embeds/course-subscription-service";
import { ExpandedService } from "./expanded-service";

class CourseEnrollmentService extends ExpandedService<CourseEnrollmentInfoForUser>{

	sameItem(item1: CourseEnrollmentInfoForUser, item2: CourseEnrollmentInfoForUser): boolean {
		return item1.userSubscription?.id === item2.userSubscription?.id;
	}

	// Restituisce tutti i corsi, se l'utente è iscritto a un corso, restituisce anche l'oggetto subscription
	async getCourseEnrollmentInfo(userId: string): Promise<CourseEnrollmentInfoForUser[]> {

		const [ allCourses, userSubscriptions ] = await Promise.all([
			courseSubscriptionService.getCourseWithSubscriptions(),
			subscriptionService.getSubscriptionsByUserId(userId)
		]);

		const allCoursesCurrentYear = allCourses.filter(c => c.course.year == new Date().getFullYear());
		
		return allCoursesCurrentYear.map(
			courseWithSubscribptions => ({ courseWithSubscriptions: courseWithSubscribptions, userSubscription: userSubscriptions.find(sub => sub.courseId === courseWithSubscribptions.course.id) ?? null }));
	}

	async addCourseEnrollmentInfo(newEnrollmentInfo: CourseEnrollmentInfoForUser): Promise<CourseEnrollmentInfoForUser> {
		newEnrollmentInfo.userSubscription = await subscriptionService.add(newEnrollmentInfo.userSubscription!);
		return newEnrollmentInfo
	}

	async deleteCourseSection(deletedEnrollmentInfo: CourseEnrollmentInfoForUser): Promise<void> {
		await subscriptionService.deleteSubscription(deletedEnrollmentInfo.userSubscription!);
	}
}
export const courseEnrollmentService = new CourseEnrollmentService();