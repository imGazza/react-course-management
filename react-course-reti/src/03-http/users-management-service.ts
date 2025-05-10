import { UserState } from "@/05-model/User";
import { subscriberService } from "./base/services/subscriber";

class UserManagementService {

	// Restituisce informazioni sull'utente riguardo le iscrizioni e lo stato 
	async getUsersState(): Promise<UserState[]>{

		const subsWithCourseAndUser = await subscriberService.getSubscribersWithCourseAndUser()

		return subsWithCourseAndUser.map(sub => ({ 
			user: sub.user, 
			isDeletable: !subsWithCourseAndUser.some(s => s.courseId === sub.courseId && sub.course.status === 'In corso'),
			subscriptionsNumber: subsWithCourseAndUser.filter(s => s.userId === sub.userId).length
		}))
	}

}
export const userManagementService = new UserManagementService();