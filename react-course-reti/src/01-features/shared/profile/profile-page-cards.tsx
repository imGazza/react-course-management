import { useEffect, useState } from "react"
import { Card, CardDescription, CardHeader, CardTitle } from "@/02-components/ui/card"
import { getSubscribersCoursesByUser } from "@/03-http/base/services/subscriber";
import { SubscriberCourse } from "@/05-model/Subscribers";
import { User } from "@/05-model/User";
import { Skeleton } from "@/02-components/ui/skeleton";

interface ProfilePageCardsProps {
	user: User;
}

const ProfilePageCards = ({ user }: ProfilePageCardsProps) => {

	const [loading, setLoading] = useState(false);
	const [subscriptions, setSubscriptions] = useState<SubscriberCourse[]>([]);

	useEffect(() => {
		setLoading(true);
		async function fetchData() {
			try{
				const subscriptions = await getSubscribersCoursesByUser(user.id);
				setSubscriptions(subscriptions);
			}	catch(e){
				// Toast
			} finally {
				setLoading(false);	
			}
		}
		fetchData();	
	}, [])

	if(loading)
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
						{subscriptions.filter(s => s.grade).length}
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
			{[...Array(4)].map((_, i) => (
				<Card key={i} className="flex-1">
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