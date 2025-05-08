import { TabsContent } from "@radix-ui/react-tabs";
import { Card } from "@/02-components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/02-components/ui/tabs"
import CourseDetailSubscriber from "./course-detail-subscriber";
import { GraduationCap, Users } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { Badge } from "@/02-components/ui/badge";
import { useParams } from "react-router";
import { Subscriber, SubscriberUser } from "@/05-model/Subscribers";
import { addCourseSubscriber, deleteSubscriber, getSubscribersUsers } from "@/03-http/subscriber";
import CourseDetailGrades from "./course-detail-grades";
import { Skeleton } from "@/02-components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/02-components/ui/tooltip";
import { subDays } from "date-fns";
import { CourseContext } from "@/06-providers/course/course-context";
import { GenerateId } from "@/05-model/BaseEntity";
import useBaseComponent from "@/04-hooks/use-base-component";

const CourseDetailTabs = () => {

	const { courseId } = useParams();
	const { course, setSubscribersNumber } = useContext(CourseContext);
	const [activeTab, setActiveTab] = useState("subscribers");

	const { query: { data: subscribers = [] }, onAdd, onDelete, isLoading, refetch } = useBaseComponent<Subscriber, SubscriberUser, SubscriberUser[]>({
		queryKey: ["subscribers"],
		fetch: () => getSubscribersUsers(courseId!),
		add: addCourseSubscriber,
		del: deleteSubscriber,
	});

	useEffect(() => {
		if (!course)
			return;

		if (!isGradesEnabled) setActiveTab("subscribers");

	}, [course])

	useEffect(() => {
		setSubscribersNumber(subscribers.length);
	}, [subscribers])

	const onAddSubscriber = async (userIds: string[]) => {
		for (const userId of userIds) {
			onAdd({
				id: GenerateId(),
				userId: userId,
				courseId: courseId!,
				subscriptionDate: new Date().toISOString(),
				grade: null
			});
		}
		refetch(); // refetch perchè aggiungendo un iscritto senza relation di User, perdo le info dell'utente
	}

	const onDeleteSubscriber = async (id: string) => {
		onDelete(id);
	}

	const GradesTabContent = (
		<>
			<GraduationCap className="h-4 w-4 mr-1" />
			Valutazioni
			<Badge
				variant="secondary"
				className="flex h-5 w-5 items-center justify-center rounded-full bg-muted-foreground/30"
			>
				{subscribers.filter(subscriber => subscriber.grade !== null).length}
			</Badge>
		</>
	)

	const isGradesEnabled = course?.status === "Chiuso" && course.closeDate && new Date(course.closeDate) > subDays(new Date(), 30);

	if (isLoading || !course || subscribers.some(s => !s.user))
		return <CourseDetailTabsSkeleton />;

	return (
		<Card className="col-span-1 sm:col-span-4 flex flex-col px-6 h-[560px]">
			<Tabs defaultValue="subscribers" className="h-full" value={activeTab} onValueChange={setActiveTab}>
				<TabsList className="grid grid-cols-2 w-full md:w-fit">
					<TabsTrigger value="subscribers" className="cursor-pointer">
						<Users className="h-4 w-4 mr-1" />
						Iscrizioni
						<Badge
							variant="secondary"
							className="flex h-5 w-5 items-center justify-center rounded-full bg-muted-foreground/30"
						>
							{subscribers.length}
						</Badge>
					</TabsTrigger>
					{isGradesEnabled ?
						<TabsTrigger value="grades" className="cursor-pointer">
							{GradesTabContent}
						</TabsTrigger>
						:
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<div>
										<TabsTrigger value="grades" className="cursor-pointer" disabled>
											{GradesTabContent}
										</TabsTrigger>
									</div>
								</TooltipTrigger>
								<TooltipContent>
									<p>Disponibile solo nei 30 giorni successivi alla chiusura del corso</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					}
				</TabsList>
				<TabsContent value="subscribers" className="flex flex-col justify-between">
					<CourseDetailSubscriber subscribers={subscribers} onAddSubscriber={onAddSubscriber} onDeleteSubscriber={onDeleteSubscriber} />
				</TabsContent>
				<TabsContent value="grades" className="flex flex-col justify-between">
					<CourseDetailGrades initialSubscribers={subscribers} />
				</TabsContent>
			</Tabs>
		</Card >
	)
}
export default CourseDetailTabs;

const CourseDetailTabsSkeleton = () => {
	return (
		<Card className="col-span-1 sm:col-span-4 flex flex-col px-6 h-[560px]">
			<div className="border-b flex space-x-1 py-1">
				<div className="flex items-center justify-center gap-2 py-2 px-3">
					<Skeleton className="h-4 w-4" />
					<Skeleton className="h-4 w-20" />
					<Skeleton className="h-5 w-5 rounded-full" />
				</div>
				<div className="flex items-center justify-center gap-2 py-2 px-3">
					<Skeleton className="h-4 w-4" />
					<Skeleton className="h-4 w-20" />
					<Skeleton className="h-5 w-5 rounded-full" />
				</div>
			</div>
			<div className="flex-1 py-6">
				<div className="flex justify-end mb-6">
					<Skeleton className="h-9 w-[200px]" />
				</div>
				<div className="space-y-3">
					<div className="flex space-x-4 border-b pb-2">
						<Skeleton className="h-4 w-20" />
						<Skeleton className="h-4 w-20" />
						<Skeleton className="h-4 flex-1" />
						<Skeleton className="h-4 w-32" />
						<Skeleton className="h-4 w-24" />
					</div>
					{[...Array(5)].map(() => (
						<div key={`skeleton-row-${crypto.randomUUID()}`} className="flex items-center space-x-4 py-2">
							<Skeleton className="h-4 w-20" />
							<Skeleton className="h-4 w-20" />
							<Skeleton className="flex-1 h-4" />
							<Skeleton className="h-4 w-24" />
							<Skeleton className="h-8 w-8" />
						</div>
					))}
				</div>
			</div>
		</Card>
	)
}
export { CourseDetailTabsSkeleton };