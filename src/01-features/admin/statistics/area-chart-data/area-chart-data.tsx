import { subscriptionService } from "@/03-http/base/services/subscription";
import { userService } from "@/03-http/base/services/user";
import { Subscription } from "@/05-model/base/Subscription";
import { User } from "@/05-model/base/User";
import { eachMonthOfInterval, subMonths } from "date-fns";

const months = [
	"Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
	"Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"
]

export interface AreaChartUnit {
	monthPeriod: string,
	Utenti: number,
	Iscrizioni: number
}

// Area Chart

export const createAreaChartData = async (months: string) => {
	const monthsNumber = parseInt(months);

	const { allUsers, allSubscriptions } = await getBaseData();

	const today = new Date();
	const start = subMonths(new Date(), monthsNumber);
	const end = new Date(today.getFullYear(), today.getMonth());

	const signedUpUsers = getSignedUpUsersPerMonth(allUsers, start, end);
	const subscribedUsers = getSubscribedPerMonth(allSubscriptions, start, end);

	return processRawData(signedUpUsers, subscribedUsers, start, end);
}

// Recupero i dati generali di base che servono a popolare il grafico
const getBaseData = async () => {

	const [allUsers, allSubscriptions] = await Promise.all([
		userService.getAll(0),
		subscriptionService.getAll(0)
	]);

	return {
		allUsers,
		allSubscriptions
	}
}

const getSignedUpUsersPerMonth = (allUsers: User[], start: Date, end: Date) => {
	return allUsers.filter(
		user =>
			new Date(user.joinedDate) >= start &&
			new Date(user.joinedDate) < end
	);
}

const getSubscribedPerMonth = (allSubscriptions: Subscription[], start: Date, end: Date) => {
	return allSubscriptions.filter(
		subscription =>
			new Date(subscription.subscriptionDate) >= start &&
			new Date(subscription.subscriptionDate) < end
	);
}

// Riorganizzo i dati per la giusta visualizzazione nel grafico
const processRawData = (users: User[], subscriptions: Subscription[], start: Date, end: Date): AreaChartUnit[] => {
	const monthPeriods = eachMonthOfInterval({ start, end });

	const result = monthPeriods.map(monthPeriod => ({
		monthPeriod: `${months[monthPeriod.getMonth()].slice(0,3)}`,
		Utenti: users.filter(u => 
			new Date(u.joinedDate).getMonth() === monthPeriod.getMonth() && 
			new Date(u.joinedDate).getFullYear() === monthPeriod.getFullYear())
			.length,
		Iscrizioni: subscriptions.filter(u => 
			new Date(u.subscriptionDate).getMonth() === monthPeriod.getMonth() && 
			new Date(u.subscriptionDate).getFullYear() === monthPeriod.getFullYear())
			.length
	}))

	return result;
}