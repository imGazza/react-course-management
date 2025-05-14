import { UserState, UserWithSubscriptions } from "@/05-model/base/User";
import { subscriptionService } from "../base/services/subscription";
import { userService } from "../base/services/user";

class UserManagementService {

	

	async getUsersWithSubscriptions(delay?: number): Promise<UserWithSubscriptions[]>{

		const [allUsers, allSubscriptions] = await Promise.all([
			userService.getAll(delay),
			subscriptionService.getAll(delay)
		]);

		return allUsers.map(user => ({
			user: user,
			subscriptions: allSubscriptions.filter(s => s.userId === user.id)
		}))
	}
}
export const userManagementService = new UserManagementService();