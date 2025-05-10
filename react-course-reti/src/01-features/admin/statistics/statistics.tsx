import { useMemo } from "react";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/02-components/ui/card";
import { courseService } from "@/03-http/base/services/course";
import { subscriberService } from "@/03-http/base/services/subscriber";
import { Users, BookOpenText, GraduationCap, Presentation } from "lucide-react";
import { CourseSubscribers } from "@/05-model/Course";
import { SubscriberCourse } from "@/05-model/Subscribers";
import { Lesson } from "@/05-model/Lesson";
import AreaChartSubscriptions from "./area-chart-data/area-chart-subscriptions";
import BarChartCourses from "./bar-chart-data/bar-chart-courses";
import useBreadcrumbs from "@/04-hooks/use-breadcrums";
import { useQueries, useQueryClient } from "@tanstack/react-query";
import { lessonService } from "@/03-http/base/services/lesson";

const Statistics = () => {

	const queryClient = useQueryClient();

	useBreadcrumbs([{ label: "Statistiche", url: "#" }])

	//TODO: separa in un altro componente le cards
	//TODO: aggiungi loader con spinner ai due grafici durante caricamento dati

	const queries = useQueries({
		queries: [
			{
				queryKey: ["courses"],
				queryFn: courseService.getAll
			},
			{
				queryKey: ["subscribers"],
				queryFn: subscriberService.getSubscribersWithCourse
			},
			{
				queryKey: ["lessons"],
				queryFn: lessonService.getAll
			}
		]	
	})

	const [courses, subscriptions, lessons] = queries.map(query => query.data ?? []) as [CourseSubscribers[], SubscriberCourse[], Lesson[]];

	useMemo(() => {
			console.log(queryClient.getQueryState(["courses"]))		
	}, [courses])

	const countUniqueSubscribedUsers = (subscriptions: SubscriberCourse[]) => {
		const uniqueUsers = new Set(subscriptions.map(sub => sub.userId));
		return uniqueUsers.size;
	}

	const countAverageCoursesPerUser = (subscriptions: SubscriberCourse[]) => {
		const coursesGroupedByUser = subscriptions.reduce((groups, subscription) => {
			const key = subscription.userId;
			if (!groups[key]) {
				groups[key] = [];
			}
			groups[key].push(subscription);
			return groups;
		}, {} as Record<string, SubscriberCourse[]>);

		const averageCoursesPerUser = Object.values(coursesGroupedByUser).length > 0
			? Number((Object.values(coursesGroupedByUser).reduce((sum, courses) => sum + courses.length, 0) / Object.values(coursesGroupedByUser).length).toFixed(1))
			: 0;

		return averageCoursesPerUser;
	}

	const countAverageLessonsPerCourse = (lessons: Lesson[]) => {
		const lessonsGroupedByCourse = lessons.reduce((groups, lesson) => {
			const key = lesson.courseId;

			if (!groups[key]) {
				groups[key] = [];
			}
			groups[key].push(lesson);
			return groups;
		}, {} as Record<string, Lesson[]>);

		const averageLessonsPerCourse = Object.values(lessonsGroupedByCourse).length > 0
			? Number((Object.values(lessonsGroupedByCourse).reduce((sum, lessons) => sum + lessons.length, 0) / Object.values(lessonsGroupedByCourse).length).toFixed(1))
			: 0;

		return averageLessonsPerCourse;
	}

	const countMostPopularCourseTotalSubscribers = (courses: CourseSubscribers[]) => {
		return Math.max(...courses.map(course => course.subscribers?.length || 0));
	}

	const statistics = useMemo(() => ({
		averageLessonsPerCourse: countAverageLessonsPerCourse(lessons),
		averageCoursesPerUser: countAverageCoursesPerUser(subscriptions),
		mostPopularCourseTotalSubscribers: countMostPopularCourseTotalSubscribers(courses),
		uniqueSubscribedUsers: countUniqueSubscribedUsers(subscriptions)
	}), [courses, subscriptions, lessons]);

	return (
		<>
			<div className="grid grid-cols-1 @xl/main:grid-cols-4 gap-4 px-4 *:data-[slot=card]:shadow-xs *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card lg:px-6">
				<Card className="@container/card gap-8">
					<CardHeader className="relative">
						<CardDescription className="flex gap-2 items-center">
							<Presentation className="size-4" />
							Corsi
						</CardDescription>
						<CardTitle className="@[250px]/card:text-4xl text-2xl font-semibold tabular-nums line-clamp-1">
							{courses.length}
						</CardTitle>
					</CardHeader>
					<CardFooter className="flex-col items-start gap-1 text-sm">
						<div className="line-clamp-1 flex gap-2 font-medium items-center">
							Corsi totali
						</div>
						<div className="text-muted-foreground">
							{`Di cui ${courses.filter(c => c.status === "Chiuso").length} chiusi`}
						</div>
					</CardFooter>
				</Card>

				<Card className="@container/card gap-8">
					<CardHeader className="relative">
						<CardDescription className="flex gap-2 items-center">
							<Users className="size-4" />
							Utenti totali
						</CardDescription>
						<CardTitle className="@[250px]/card:text-4xl text-2xl font-semibold tabular-nums line-clamp-1">
							{subscriptions.length}
						</CardTitle>
					</CardHeader>
					<CardFooter className="flex-col items-start gap-1 text-sm">
						<div className="line-clamp-1 flex gap-2 font-medium">
							Popolarità
						</div>
						<div className="text-muted-foreground">
							{`Il corso più popolare conta ${statistics.mostPopularCourseTotalSubscribers} iscritt${statistics.mostPopularCourseTotalSubscribers === 1 ? "o" : "i"}`}
						</div>
					</CardFooter>
				</Card>

				<Card className="@container/card gap-8">
					<CardHeader className="relative">
						<CardDescription className="flex gap-2 items-center">
							<BookOpenText className="size-4" />
							Media lezioni per corso
						</CardDescription>
						<CardTitle className="@[250px]/card:text-4xl text-2xl font-semibold tabular-nums">
							{statistics.averageLessonsPerCourse}
						</CardTitle>
					</CardHeader>
					<CardFooter className="flex-col items-start gap-1 text-sm">
						<div className="line-clamp-1 flex gap-2 font-medium">
							Lezioni
						</div>
						<div className="text-muted-foreground">
							{`In tutto sono ${lessons.length}`}
						</div>
					</CardFooter>
				</Card>

				<Card className="@container/card gap-8">
					<CardHeader className="relative">
						<CardDescription className="flex gap-2 items-center">
							<GraduationCap className="size-4" />
							Media corsi per studente
						</CardDescription>
						<CardTitle className="@[250px]/card:text-4xl text-2xl font-semibold tabular-nums line-clamp-1">
							{statistics.averageCoursesPerUser}
						</CardTitle>
					</CardHeader>
					<CardFooter className="flex-col items-start gap-1 text-sm">
						<div className="line-clamp-1 flex gap-2 font-medium">
							Utenti iscritti a corsi
						</div>
						<div className="text-muted-foreground">
							{`${statistics.uniqueSubscribedUsers} utent${statistics.uniqueSubscribedUsers === 1 ? 'e ha' : 'i hanno'} almeno un'iscrizione`}
						</div>
					</CardFooter>
				</Card>

			</div>
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full px-4 lg:px-6">
				<AreaChartSubscriptions />
				<BarChartCourses />
			</div>			
		</>
	);
}
export default Statistics;