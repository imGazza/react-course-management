
import { Subscription, SubscriptionsWithCourse, SubscriptionsWithUser } from "@/05-model/base/Subscription";
import { subscriptionService } from "../../base/services/subscription";
import { courseService } from "../../base/services/course";
import { Course, CourseWithSubscriptions } from "@/05-model/base/Course";

class CourseSubscriptionService {    

    async getSubscriptionsWithUserByCourseId(id: string): Promise<SubscriptionsWithUser[]> {
        const subscriptionsEmbedsUser = await subscriptionService.getSubscriptionsEmbedsUserByCourseId(id);
        return subscriptionsEmbedsUser.map(subscription => ({ subscription: subscription as Subscription, user: subscription.user }));
    }

    async getCourseWithSubscriptions(delay?: number): Promise<CourseWithSubscriptions[]>{
        const courseEmbedsSubscriptions = await courseService.getCoursesEmbedsSubscriptions(delay);
        return courseEmbedsSubscriptions.map(course => ({ course: course as Course, subscriptions: course.subscriptions }));
    }

    async getSubscriptionsWithCourseByUserId(userId: string): Promise<SubscriptionsWithCourse[]> {
		const subcriptionsEmbedsCourse = await subscriptionService.getSubscriptionsEmbedsCourseByUserId(userId);
		return subcriptionsEmbedsCourse.map(subs => ({ subscription: subs as Subscription, course: subs.course }))
	}
}

export const courseSubscriptionService = new CourseSubscriptionService();