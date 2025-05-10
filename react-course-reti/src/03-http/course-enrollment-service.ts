import { CourseEnrollmentInfoForUser } from "@/05-model/Course";
import { subscriberService } from "./base/services/subscriber";
import { courseSubscriptionService } from "./course-subscription-service";

class CourseEnrollmentService {

    // Restituisce tutti i corsi, se l'utente è iscritto a un corso, restituisce anche l'oggetto subscriber
    async getCourseEnrollmentInfo(userId: string): Promise<CourseEnrollmentInfoForUser[]> {

        const [ allCourses, userSubscriptions ] = await Promise.all([
            courseSubscriptionService.getCourseWithSubscriptions(),
            subscriberService.getSubscriptionsByUserId(userId)
        ]);
        
        return allCourses.map(
            courseWithSubscribptions => ({ courseWithSubscriptions: courseWithSubscribptions, userSubscription: userSubscriptions.find(sub => sub.courseId === courseWithSubscribptions.course.id) ?? null }));
    }
}
export const courseEnrollmentService = new CourseEnrollmentService();