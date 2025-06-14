import { courseService } from "@/03-http/base/services/course";
import { CourseEmbedsSubscriptions } from "@/05-model/base/Course";
import { eachYearOfInterval, subYears } from "date-fns";

export interface BarChartUnit {
	year: number,
	[key: string]: number
}

export const createBarChartData = async ({ uniqueCourses, allCoursesEmbedsSubscriptions } : { uniqueCourses: Set<string>, allCoursesEmbedsSubscriptions: CourseEmbedsSubscriptions[]}): Promise<BarChartUnit[]> => {
	const start = subYears(new Date(), 5);
	const end = new Date();

	const yearRange = eachYearOfInterval({ start, end });

	// Per ogni anno, mappa ogni corso a una chiave valore con NomeCorso: NumeroIscritti]
	const result = yearRange.map(year => ({
		year: year.getFullYear(),
		...Object.fromEntries([...uniqueCourses].map(course => [
			course,
			allCoursesEmbedsSubscriptions.find(c => c.name === course && c.year === year.getFullYear())?.subscriptions?.length ?? 0
		]))
	}))

	return result;
}

export const getBaseData = async () => {
	const allCoursesEmbedsSubscriptions = await courseService.getCoursesEmbedsSubscriptions(0);
	const uniqueCourses = new Set(allCoursesEmbedsSubscriptions.map(course => course.name));

	return {
		uniqueCourses,
		allCoursesEmbedsSubscriptions
	}
}