import { courseSubscriptionService } from "./embeds/course-subscription-service";
import { ExpandedService } from "./expanded-service";
import { SubscriptionsWithUser } from "@/05-model/base/Subscription";
import { subscriptionService } from "../base/services/subscription";

class CourseTabsService extends ExpandedService<SubscriptionsWithUser>{

	sameItem(item1: SubscriptionsWithUser, item2: SubscriptionsWithUser): boolean {
		return item1.subscription.id === item2.subscription.id;
	}

	async getCourseTabsSubscriptions(courseId: string): Promise<SubscriptionsWithUser[]> {
		return await courseSubscriptionService.getSubscriptionsWithUserByCourseId(courseId)
	}

	async addCourseTabsSubscription(newSubscription: SubscriptionsWithUser): Promise<SubscriptionsWithUser> {
		newSubscription.subscription = await subscriptionService.add(newSubscription.subscription);
		return newSubscription
	}

	async deleteTabsSectionSubscription(deletedSubscription: SubscriptionsWithUser): Promise<void> {
		await subscriptionService.deleteSubscription(deletedSubscription.subscription);
	}
}
export const courseTabsService = new CourseTabsService();