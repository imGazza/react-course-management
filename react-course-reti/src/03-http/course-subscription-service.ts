
import { Subscriber, SubscriptionsWithUser } from "@/05-model/Subscribers";
import { subscriberService } from "./base/services/subscriber";
import { courseService } from "./base/services/course";
import { Course, CourseWithSubscriptions } from "@/05-model/Course";

class CourseSubscriptionService {
     

    async getSubscriptionsWithUserByCourseId(id: string): Promise<SubscriptionsWithUser[]> {
        const subscriptionsEmbedsUser = await subscriberService.getSubscriptionsEmbedsUserByCourseId(id);
        return subscriptionsEmbedsUser.map(subscriber => ({ subscription: subscriber as Subscriber, user: subscriber.user }));
    }

    async getCourseWithSubscriptions(): Promise<CourseWithSubscriptions[]>{
        const courseEmbedsSubscriptions = await courseService.getCoursesEmbedsSubscribers();
        return courseEmbedsSubscriptions.map(course => ({ course: course as Course, subscriptions: course.subscribers }));
    }
}

export const courseSubscriptionService = new CourseSubscriptionService();