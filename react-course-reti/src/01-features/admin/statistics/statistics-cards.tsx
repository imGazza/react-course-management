import { useMemo } from "react";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/02-components/ui/card";
import { Users, BookOpenText, GraduationCap, Presentation } from "lucide-react";
import { CourseWithSubscriptions } from "@/05-model/Course";
import { Lesson } from "@/05-model/Lesson";
import useBreadcrumbs from "@/04-hooks/use-breadcrums";
import { useQueries } from "@tanstack/react-query";
import { lessonService } from "@/03-http/base/services/lesson";
import { userManagementService } from "@/03-http/users-management-service";
import { UserWithSubscriptions } from "@/05-model/User";
import { courseSubscriptionService } from "@/03-http/course-subscription-service";

const StatisticsCards = () => {

	useBreadcrumbs([{ label: "Statistiche", url: "#" }])

	const countUniqueSubscribedUsers = (usersWithSubscriptions: UserWithSubscriptions[]) => {
		return usersWithSubscriptions.filter(user => user.subscriptions.length > 0).length;
	}

	const countAverageCoursesPerUser = (usersWithSubscriptions: UserWithSubscriptions[]) => {
		const averageCoursesPerUser = usersWithSubscriptions.length > 0
			? Number(usersWithSubscriptions.reduce((sum, subs) => sum + subs.subscriptions.length, 0) / usersWithSubscriptions.length).toFixed(1)
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

	const countMostPopularCourseTotalSubscribers = (coursesWithSubscriptions: CourseWithSubscriptions[]) => {
		return Math.max(...coursesWithSubscriptions.map(courseWithSubscriptions => courseWithSubscriptions.subscriptions?.length || 0));
	}

	const queries = useQueries({
		queries: [
			{
				queryKey: ["coursesWithSubscriptions"],
				queryFn: () => courseSubscriptionService.getCourseWithSubscriptions(0)
			},
			{
				queryKey: ["usersWithSubscriptions"],
				queryFn: () => userManagementService.getUsersWithSubscriptions(0)
			},
			{
				queryKey: ["lessons"],
				queryFn: () => lessonService.getAll(0)
			}
		]	
	})

	const [coursesWithSubscriptions, usersWithSubscriptions, lessons] = queries.map(query => query.data ?? []) as [CourseWithSubscriptions[], UserWithSubscriptions[], Lesson[]];	

	const statistics = useMemo(() => ({
		averageLessonsPerCourse: countAverageLessonsPerCourse(lessons),
		averageCoursesPerUser: countAverageCoursesPerUser(usersWithSubscriptions),
		mostPopularCourseTotalSubscribers: countMostPopularCourseTotalSubscribers(coursesWithSubscriptions),
		uniqueSubscribedUsers: countUniqueSubscribedUsers(usersWithSubscriptions)
	}), [coursesWithSubscriptions, usersWithSubscriptions, lessons]);

	return (
		<div className="grid grid-cols-1 @xl/main:grid-cols-4 gap-4 px-4 *:data-[slot=card]:shadow-xs *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card lg:px-6">
			<Card className="@container/card gap-8">
				<CardHeader className="relative">
					<CardDescription className="flex gap-2 items-center">
						<Presentation className="size-4" />
						Corsi
					</CardDescription>
					<CardTitle className="@[250px]/card:text-4xl text-2xl font-semibold tabular-nums line-clamp-1">
						{coursesWithSubscriptions.length}
					</CardTitle>
				</CardHeader>
				<CardFooter className="flex-col items-start gap-1 text-sm">
					<div className="line-clamp-1 flex gap-2 font-medium items-center">
						Corsi totali
					</div>
					<div className="text-muted-foreground">
						{`Di cui ${coursesWithSubscriptions.filter(courseWithSubscriptions => courseWithSubscriptions.course.status === "Chiuso").length} chiusi`}
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
						{usersWithSubscriptions.length}
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
	)
}
export default StatisticsCards