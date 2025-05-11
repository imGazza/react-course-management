import { UserState, UserWithSubscriptions } from "@/05-model/User";
import { subscriberService } from "./base/services/subscriber";
import { userService } from "./base/services/user";

class UserManagementService {

	// Restituisce informazioni sull'utente riguardo le iscrizioni e lo stato 
	async getUsersState(): Promise<UserState[]>{

		const [ allUsers, subsWithCourse ] = await Promise.all([
			userService.getAll(),
			subscriberService.getSubscriptionsWithCourse()
		]);

		return allUsers.map(user => ({ 
			user: user, 
			isDeletable: !subsWithCourse.some(s => s.userId === user.id && s.course.status === 'In corso'),
			subscriptionsNumber: subsWithCourse.filter(s => s.userId === user.id).length
		}))
	}

	async getUsersWithSubscriptions(delay?: number): Promise<UserWithSubscriptions[]>{

		const [allUsers, allSubscriptions] = await Promise.all([
			userService.getAll(delay),
			subscriberService.getAll(delay)
		]);

		return allUsers.map(user => ({
			user: user,
			subscriptions: allSubscriptions.filter(s => s.userId === user.id)
		}))
	}

}
export const userManagementService = new UserManagementService();