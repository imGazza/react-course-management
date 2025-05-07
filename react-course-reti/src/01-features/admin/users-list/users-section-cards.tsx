import { Card, CardDescription, CardHeader, CardTitle } from "@/02-components/ui/card"
import { UserEntity } from "@/05-model/User"
import { Skeleton } from "@/02-components/ui/skeleton"
import { subDays } from "date-fns";

interface UsersSectionCardsProps {
	users: UserEntity[];
	loading: boolean;
}

const UsersSectionCards = ({ users, loading }: UsersSectionCardsProps) => {

	if (loading) {
		return (
			<UsersSectionCardsSkeleton />
		)
	}

	return (
		<>
			<Card className="@container/card gap-8">
				<CardHeader>
					<CardDescription className="flex items-center gap-2">
						<div className="w-2 h-2 rounded-full bg-blue-500" />
						Utenti totali
					</CardDescription>
					<CardTitle className="@[250px]/card:text-4xl text-2xl font-semibold tabular-nums line-clamp-1">
						{users.length}
					</CardTitle>
				</CardHeader>
			</Card>
			<Card className="@container/card gap-8">
				<CardHeader>
					<CardDescription className="flex items-center gap-2">
						<div className="w-2 h-2 rounded-full bg-orange-500" />
						Utenti senza corsi
					</CardDescription>
					<CardTitle className="@[250px]/card:text-4xl text-2xl font-semibold tabular-nums line-clamp-1">
						{users.filter((user) => user.subscribers.length === 0).length}
					</CardTitle>
				</CardHeader>
			</Card>
			<Card className="@container/card gap-8">
				<CardHeader>
					<CardDescription className="flex items-center gap-2">
						<div className="w-2 h-2 rounded-full bg-green-500" />
						Amministratori
					</CardDescription>
					<CardTitle className="@[250px]/card:text-4xl text-2xl font-semibold tabular-nums line-clamp-1">
						{users.filter((user) => user.isAdmin).length}
					</CardTitle>
				</CardHeader>
			</Card>
			<Card className="@container/card gap-8">
				<CardHeader>
					<CardDescription className="flex items-center gap-2">
						<div className="w-2 h-2 rounded-full bg-purple-500" />
						Registrati negli ultimi 7 giorni
					</CardDescription>
					<CardTitle className="@[250px]/card:text-4xl text-2xl font-semibold tabular-nums line-clamp-1">
						{users.filter((user) => new Date(user.joinedDate) > subDays(new Date(), 7)).length}
					</CardTitle>
				</CardHeader>
			</Card>
		</>
	)
}

const UsersSectionCardsSkeleton = () => {
	return (
		<>
			{Array.from({ length: 4 }).map((_, index) => (
				<Card key={index} className="@container/card gap-8">
					<CardHeader>
						<CardDescription className="flex items-center gap-2">
							<Skeleton className="h-7 w-28" />
						</CardDescription>
						<CardTitle className="@[250px]/card:text-4xl text-2xl font-semibold">
							<Skeleton className="h-8 w-16" />
						</CardTitle>
					</CardHeader>
				</Card>
			))}
		</>
	)
}

export default UsersSectionCards