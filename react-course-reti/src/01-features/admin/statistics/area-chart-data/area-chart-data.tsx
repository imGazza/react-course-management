import { subscriberService } from "@/03-http/base/services/subscriber";
import { userService } from "@/03-http/base/services/user";
import { Subscriber } from "@/05-model/Subscribers";
import { User } from "@/05-model/User";
import { eachMonthOfInterval, subMonths } from "date-fns";

const months = [
	"Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
	"Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"
]

export interface AreaChartUnit {
	monthPeriod: string,
	Utenti: number,
	Iscritti: number
}

// Area Chart

export const createAreaChartData = async (months: string) => {
	const monthsNumber = parseInt(months);

	const { allUsers, allSubscribers } = await getBaseData();

	const today = new Date();
	const start = subMonths(new Date(), monthsNumber);
	const end = new Date(today.getFullYear(), today.getMonth());

	const signedUpUsers = getSignedUpUsersPerMonth(allUsers, start, end);
	const subscribedUsers = getSubscribedPerMonth(allSubscribers, start, end);

	return rearrangeData(signedUpUsers, subscribedUsers, start, end);
}

const getBaseData = async () => {

	const [allUsers, allSubscribers] = await Promise.all([
		userService.getAll(0),
		subscriberService.getAll(0)
	]);

	return {
		allUsers,
		allSubscribers
	}
}

const getSignedUpUsersPerMonth = (allUsers: User[], start: Date, end: Date) => {
	return allUsers.filter(
		user =>
			new Date(user.joinedDate) >= start &&
			new Date(user.joinedDate) < end
	);
}

const getSubscribedPerMonth = (allSubscribers: Subscriber[], start: Date, end: Date) => {
	return allSubscribers.filter(
		subscriber =>
			new Date(subscriber.subscriptionDate) >= start &&
			new Date(subscriber.subscriptionDate) < end
	);
}

const rearrangeData = (users: User[], subscribers: Subscriber[], start: Date, end: Date): AreaChartUnit[] => {
	const monthPeriods = eachMonthOfInterval({ start, end });

	const result = monthPeriods.map(monthPeriod => ({
		monthPeriod: `${months[monthPeriod.getMonth()].slice(0,3)}`,
		Utenti: users.filter(u => 
			new Date(u.joinedDate).getMonth() === monthPeriod.getMonth() && 
			new Date(u.joinedDate).getFullYear() === monthPeriod.getFullYear())
			.length,
		Iscritti: subscribers.filter(u => 
			new Date(u.subscriptionDate).getMonth() === monthPeriod.getMonth() && 
			new Date(u.subscriptionDate).getFullYear() === monthPeriod.getFullYear())
			.length
	}))

	return result;
}