import { TabsContent } from "@radix-ui/react-tabs";
import { Card } from "@/02-components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/02-components/ui/tabs"
import CourseDetailSubscription from "./course-detail-subscription";
import { GraduationCap, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/02-components/ui/badge";
import { useParams } from "react-router";
import { Subscription, SubscriptionsWithUser } from "@/05-model/base/Subscription";
import CourseDetailGrades from "./course-detail-grades";
import { Skeleton } from "@/02-components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/02-components/ui/tooltip";
import { subDays } from "date-fns";
import { GenerateId } from "@/05-model/base/BaseEntity";
import { User } from "@/05-model/base/User";
import { createSkeletonArray, skeletonUniqueId } from "@/02-components/utils/misc";
import { useCourseBasicInfo } from "@/04-hooks/use-course-basic-info";
import useBaseComponent from "@/04-hooks/use-base-component";
import { courseTabsService } from "@/03-http/expanded/course-tabs-service";
import { toaster } from "@/02-components/utils/toaster";

const CourseDetailTabs = () => {

	const { courseId } = useParams();
	const { course, setSubscriptionsNumber } = useCourseBasicInfo();
	const [activeTab, setActiveTab] = useState("subscriptions");

	const {
		query: { data: subscriptionsWithUser = [] },
		onAdd,
		onDelete,
		isLoading,
		remove
	} = useBaseComponent<SubscriptionsWithUser, SubscriptionsWithUser[]>({
		queryKey: ['subscriptions', courseId!],
		fetch: () => courseTabsService.getCourseTabsSubscriptions(courseId!),
		add: courseTabsService.addCourseTabsSubscription,
		del: courseTabsService.deleteTabsSectionSubscription,
		equals: courseTabsService.sameItem
	});

	useEffect(() => {
		if (!course)
			return;

		if (!isGradesEnabled) setActiveTab("subscriptions");

	}, [course])

	useEffect(() => {
		setSubscriptionsNumber(subscriptionsWithUser.length);
	}, [subscriptionsWithUser])

	// Vincolo dei 30 giorni entro la data di chiusura per assegnazione valutazioni
	const isGradesEnabled = course?.status === "Chiuso" && course.closeDate && new Date(course.closeDate) > subDays(new Date(), 30);

	const onAddSubscription = async (users: User[]) => {
		for (const user of users) {
			const existentUser = subscriptionsWithUser.find(subscriptionWithUser => subscriptionWithUser.user.id === user.id)?.user;
			if (existentUser){
				toaster.warnToast(`L'utente ${existentUser.firstName} ${existentUser.lastName} è già iscritto al corso`);				
				continue;
			}				

			onAdd({
				user: user,
				subscription: {
					id: GenerateId(),
					userId: user.id,
					courseId: courseId!,
					subscriptionDate: new Date().toISOString(),
					grade: null
				}
			});
			remove(['subscriptions', courseId!]);
		}
	};

	const onDeleteSubscription = async (subscription: Subscription) => {
		const subscriptionWithUser = subscriptionsWithUser.find(subscriptionWithUser => subscriptionWithUser.subscription.id === subscription.id);
		if (!subscriptionWithUser)
			return;
		onDelete(subscriptionWithUser);
	};

	const GradesTabContent = (
		<>
			<GraduationCap className="h-4 w-4 mr-1" />
			Valutazioni
			<Badge
				variant="secondary"
				className="flex h-5 w-5 items-center justify-center rounded-full bg-muted-foreground/30"
			>
				{subscriptionsWithUser.filter(subscriptionWithUser => subscriptionWithUser.subscription.grade !== null).length}
			</Badge>
		</>
	);

	if (isLoading || !course)
		return <CourseDetailTabsSkeleton />;

	return (
		<Card className="col-span-1 sm:col-span-4 flex flex-col px-6 h-[560px]">
			<Tabs defaultValue="subscriptions" className="h-full" value={activeTab} onValueChange={setActiveTab}>
				<TabsList className="grid grid-cols-2 w-full md:w-fit">
					<TabsTrigger value="subscriptions" className="cursor-pointer">
						<Users className="h-4 w-4 mr-1" />
						Iscrizioni
						<Badge
							variant="secondary"
							className="flex h-5 w-5 items-center justify-center rounded-full bg-muted-foreground/30"
						>
							{subscriptionsWithUser.length}
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
				<TabsContent value="subscriptions" className="flex flex-col justify-between">
					<CourseDetailSubscription subscriptionsWithUser={subscriptionsWithUser} onAddSubscription={onAddSubscription} onDeleteSubscription={onDeleteSubscription} />
				</TabsContent>
				<TabsContent value="grades" className="flex flex-col justify-between">
					<CourseDetailGrades initialSubscriptionsWithUser={subscriptionsWithUser} />
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
					{createSkeletonArray(5).map(() => (
						<div key={skeletonUniqueId()} className="flex items-center space-x-4 py-2">
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