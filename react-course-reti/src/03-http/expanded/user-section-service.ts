import { ExpandedService } from "./expanded-service";
import { UserState } from "@/05-model/base/User";
import { userService } from "../base/services/user";
import { subscriptionService } from "../base/services/subscription";

class UserSectionService extends ExpandedService<UserState>{

	sameItem(item1: UserState, item2: UserState): boolean {
		return item1.user.id === item2.user.id;
	}

	// Restituisce informazioni sull'utente riguardo le iscrizioni e lo stato 
	async getUsersState(): Promise<UserState[]>{

		const [ allUsers, subsWithCourse ] = await Promise.all([
			userService.getAll(),
			subscriptionService.getSubscriptionsEmbedsCourse()
		]);

		return allUsers.map(user => ({ 
			user: user, 
			isDeletable: !subsWithCourse.some(s => s.userId === user.id && s.course.status === 'In corso'),
			subscriptionsNumber: subsWithCourse.filter(s => s.userId === user.id).length
		}))
	}

	async addUserSection(newUser: UserState): Promise<UserState> {
		newUser.user = await userService.add(newUser.user);
		return newUser
	}

	async editUsersSection(editedUser: UserState): Promise<UserState> {
		editedUser.user = await userService.edit(editedUser.user);
		return editedUser;
	}

	async deleteUsersSection(deletedUser: UserState): Promise<void> {
		await userService.deleteUser(deletedUser.user);		
	}
}
export const userSectionService = new UserSectionService();