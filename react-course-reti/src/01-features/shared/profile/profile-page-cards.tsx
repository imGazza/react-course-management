import { Card, CardDescription, CardHeader, CardTitle } from "@/02-components/ui/card"
import { SubscriptionsWithCourse } from "@/05-model/base/Subscription";
import { User } from "@/05-model/base/User";
import { Skeleton } from "@/02-components/ui/skeleton";
import useBaseComponent from "@/04-hooks/use-base-component";
import { createSkeletonArray, skeletonUniqueId } from "@/02-components/utils/misc";
import { profilePageService } from "@/03-http/expanded/profile-page-service";

interface ProfilePageCardsProps {
	user: User;
}

const ProfilePageCards = ({ user }: ProfilePageCardsProps) => {

	const { query: { data: subscriptions = [] }, isLoading } = useBaseComponent<SubscriptionsWithCourse, SubscriptionsWithCourse[]>({
		queryKey: ["subscriptions", user.id],
		fetch: () => profilePageService.getSubscriptionsWithCourse(user.id),
		equals: (s1, s2) => s1.subscription.id === s2.subscription.id
	});

	if(isLoading)
		return <ProfilePageCardsSkeleton />

	return (
		<div className="flex flex-col gap-6 col-span-1 h-[540px]">
			<Card className="flex-1">
				<CardHeader>
					<CardDescription className="flex items-center gap-2">
						<div className="w-2 h-2 rounded-full bg-blue-500" />
						Iscrizioni totali
					</CardDescription>
					<CardTitle className="@[250px]/card:text-4xl text-2xl font-semibold tabular-nums line-clamp-1">
						{subscriptions.length}
					</CardTitle>
				</CardHeader>
			</Card>

			<Card className="flex-1">
				<CardHeader>
					<CardDescription className="flex items-center gap-2">
						<div className="w-2 h-2 rounded-full bg-orange-500" />
						Corsi terminati
					</CardDescription>
					<CardTitle className="@[250px]/card:text-4xl text-2xl font-semibold tabular-nums line-clamp-1">
						{subscriptions.filter(s => s.course.status === "Chiuso").length}
					</CardTitle>
				</CardHeader>
			</Card>

			<Card className="flex-1">
				<CardHeader>
					<CardDescription className="flex items-center gap-2">
						<div className="w-2 h-2 rounded-full bg-green-500" />
						Corsi in corso
					</CardDescription>
					<CardTitle className="@[250px]/card:text-4xl text-2xl font-semibold tabular-nums line-clamp-1">
						{subscriptions.filter(s => s.course.status !== "Chiuso").length}
					</CardTitle>
				</CardHeader>
			</Card>

			<Card className="flex-1">
				<CardHeader>
					<CardDescription className="flex items-center gap-2">
						<div className="w-2 h-2 rounded-full bg-purple-500" />
						Valutazioni ricevute
					</CardDescription>
					<CardTitle className="@[250px]/card:text-4xl text-2xl font-semibold tabular-nums line-clamp-1">
						{subscriptions.filter(s => s.subscription.grade).length}
					</CardTitle>
				</CardHeader>
			</Card>
		</div>
	)
}
export default ProfilePageCards

const ProfilePageCardsSkeleton = () => {
	return (
		<div className="flex flex-col gap-6 col-span-1 h-[540px]">
			{createSkeletonArray(4).map(() => (
				<Card key={skeletonUniqueId()} className="flex-1">
					<CardHeader>
						<CardDescription className="flex items-center gap-2">
							<Skeleton className="w-2 h-2 rounded-full" />
							<Skeleton className="h-4 w-24" />
						</CardDescription>
						<Skeleton className="h-8 w-16 mt-1" />
					</CardHeader>
				</Card>
			))}
		</div>
	)	
}