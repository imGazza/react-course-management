import { getUsers } from "@/http/user";

export const chartData = [
	{ month: "January", desktop: 186, mobile: 80 },
	{ month: "February", desktop: 305, mobile: 200 },
	{ month: "March", desktop: 237, mobile: 120 },
	{ month: "April", desktop: 73, mobile: 190 },
	{ month: "May", desktop: 209, mobile: 130 },
	{ month: "June", desktop: 214, mobile: 140 },
]

const months = [
	"Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
	"Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"
]

const createChartData = async (yearReference: number, yearCompare: number) => {
	const yearReferenceData = await getJoinedUserPerMonth(yearReference);
	const yearCompareData = await getJoinedUserPerMonth(yearCompare);

	let result: { month: string, referenceUserJoined: number, compareUserJoined: number }[] = [];

	months.forEach((month, index) => {
		result.push({
			month: month, 
			referenceUserJoined: yearReferenceData[index].usersJoined, 
			compareUserJoined: yearCompareData[index].usersJoined 
		})
	})
}

const getJoinedUserPerMonth = async (year: number) => {
	const allUsers = await getUsers();
	const usersPerYear = allUsers.filter(u => new Date(u.joinedDate) > new Date(year, 0, 1) && new Date(u.joinedDate) < new Date(year, 12, 31));

	const usersPerMonth = Array.from({ length: 12 }, (_, index) => {

		const usersInMonth = usersPerYear.filter(u => new Date(u.joinedDate).getMonth() === index).length;

		return {
			month: months[index],
			year: year,
			usersJoined: usersInMonth
		}
	});

	return usersPerMonth;
}






