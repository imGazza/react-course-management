import { courseSubscriptionService } from "./embeds/course-subscription-service";
import { ExpandedService } from "./expanded-service";
import { SubscriptionsWithCourse } from "@/05-model/base/Subscription";

class ProfilePageService extends ExpandedService<SubscriptionsWithCourse> {

	sameItem(item1: SubscriptionsWithCourse, item2: SubscriptionsWithCourse): boolean {
		return item1.course.id === item2.course.id;
	}

	getSubscriptionsWithCourse(userId: string): Promise<SubscriptionsWithCourse[]> {
		return courseSubscriptionService.getSubscriptionsWithCourseByUserId(userId);
	}
}
export const profilePageService = new ProfilePageService();