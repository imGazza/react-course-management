import { courseService } from "@/03-http/base/services/course";
import { CourseEmbedsSubscriptions } from "@/05-model/Course";
import { eachYearOfInterval, subYears } from "date-fns";

export interface BarChartUnit {
	year: number,
	[key: string]: number
}

export const createBarChartData = async ({ uniqueCourses, allCoursesWithSubscriptions } : { uniqueCourses: Set<string>, allCoursesWithSubscriptions: CourseEmbedsSubscriptions[]}): Promise<BarChartUnit[]> => {
	const start = subYears(new Date(), 5);
	const end = new Date();

	const yearRange = eachYearOfInterval({ start, end });

	const result = yearRange.map(year => ({
		year: year.getFullYear(),
		...Object.fromEntries([...uniqueCourses].map(course => [
			course,
			allCoursesWithSubscriptions.find(c => c.name === course && c.year === year.getFullYear())?.subscribers?.length ?? 0
		]))
	}))

	return result;
}

export const getBaseData = async () => {
	const allCoursesWithSubscriptions = await courseService.getCoursesEmbedsSubscribers(0);
	const uniqueCourses = new Set(allCoursesWithSubscriptions.map(course => course.name));

	return {
		uniqueCourses,
		allCoursesWithSubscriptions
	}
}