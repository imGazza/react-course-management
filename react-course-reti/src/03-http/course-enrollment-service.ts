import { CourseEnrollmentInfoForUser } from "@/05-model/Course";
import { courseService } from "./base/services/course";
import { subscriberService } from "./base/services/subscriber";

class CourseEnrollmentService {

    // Restituisce tutti i corsi, se l'utente è iscritto a un corso, restituisce anche l'oggetto subscriber
    async getCourseEnrollmentInfo(userId: string): Promise<CourseEnrollmentInfoForUser[]> {

        const [ allCourses, userSubscriptions ] = await Promise.all([
            courseService.getCoursesWithSubscribers(),
            subscriberService.getSubscriptionsByUserId(userId)
        ]);
        
        return allCourses.map(
            courseWithSubscribers => ({ course: courseWithSubscribers, subscription: userSubscriptions.find(sub => sub.courseId === courseWithSubscribers.id) ?? null }));
    }
}
export const courseEnrollmentService = new CourseEnrollmentService();