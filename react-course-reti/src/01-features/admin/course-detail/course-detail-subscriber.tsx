import { UserMinus, Lock } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/02-components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/02-components/ui/table"
import { SubscriptionsWithUser } from "@/05-model/Subscribers"
import { useContext } from "react"
import { Button } from "@/02-components/ui/button"
import { ScrollArea } from "@/02-components/ui/scroll-area"
import { Skeleton } from "@/02-components/ui/skeleton"
import { CourseContext } from "@/06-providers/course/course-context"
import ComboboxUsers from "./combobox-users"

const SKELETON_ROWS = 4;

interface CourseDetailSubscriberProps {
	subscriptionsWithUser: SubscriptionsWithUser[];
	onAddSubscriber: (userIds: string[]) => void;
	onDeleteSubscriber: (subscriberId: string) => void;
}

const CourseDetailSubscriber = ({ subscriptionsWithUser, onAddSubscriber, onDeleteSubscriber }: CourseDetailSubscriberProps) => {

	const { course } = useContext(CourseContext);
	
	const isReadOnly = course?.status === "Chiuso";

	return (
		<>
			<CardHeader className="px-0">
				{!isReadOnly ?
					<ComboboxUsers onAddSubscriber={onAddSubscriber}/>
					:
					<div className="flex items-center justify-center gap-2 text-muted-foreground bg-muted/50 p-4 rounded-md">
						<Lock className="h-4 w-4" />
						Non è possibile modificare le iscrizioni a corso chiuso.
					</div>
				}
			</CardHeader>
			<CardContent className="flex-1 px-0 pt-4 max-h-[405px]">
				{subscriptionsWithUser.length !== 0 ?
					<ScrollArea className="h-full">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead className="text-foreground/50 font-normal">Nome</TableHead>
									<TableHead className="text-foreground/50 font-normal">Cognome</TableHead>
									<TableHead className="text-foreground/50 font-normal max-md:hidden">Email</TableHead>
									<TableHead className="text-foreground/50 font-normal max-md:hidden">Data Iscrizione</TableHead>
									<TableHead className="text-foreground/50 text-right font-normal">Disiscrivi</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{subscriptionsWithUser.map((subscriptionWithUser) => (
									<TableRow key={subscriptionWithUser.subscription.id}>
										<TableCell className="font-medium">{`${subscriptionWithUser.user.firstName}`}</TableCell>
										<TableCell className="font-medium">{`${subscriptionWithUser.user.lastName}`}</TableCell>
										<TableCell className="font-medium max-md:hidden">{`${subscriptionWithUser.user.email}`}</TableCell>
										<TableCell className="font-medium max-md:hidden">{`${new Date(subscriptionWithUser.subscription.subscriptionDate).toLocaleDateString('it-IT')}`}</TableCell>
										<TableCell className="text-right">
											<Button variant="ghost" size="icon" onClick={() => onDeleteSubscriber(subscriptionWithUser.subscription.id)} disabled={isReadOnly}>
												<UserMinus className="h-4 w-4" />
												<span className="sr-only">Delete</span>
											</Button>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</ScrollArea>
					:
					<div className="flex flex-col items-center justify-center gap-2 text-muted-foreground p-8">
					    <UserMinus className="h-12 w-12" />
					    <p className="text-lg font-medium">Nessun iscritto</p>
					</div>
				}
			</CardContent>
		</>
	)
}
export default CourseDetailSubscriber;

const CourseDetailSubscriberSkeleton = () => {
	return (
		<Card className="col-span-1 sm:col-span-4 min-h-[405px] flex flex-col">
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Skeleton className="h-5 w-5" />
					<Skeleton className="h-6 w-24" />
				</CardTitle>
			</CardHeader>
			<CardContent className="flex-1">
				<div className="h-[245px]">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>
									<Skeleton className="h-4 w-20" />
								</TableHead>
								<TableHead className="text-right">
									<Skeleton className="h-4 w-16 ml-auto" />
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{[...Array(SKELETON_ROWS)].map(() => (
								<TableRow key={`skeleton-row-${crypto.randomUUID()}`}>
									<TableCell>
										<Skeleton className="h-5 w-40" />
									</TableCell>
									<TableCell className="text-right">
										<Skeleton className="h-8 w-8 ml-auto" />
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</CardContent>
			<CardFooter>
				<Skeleton className="h-8 w-full" />
			</CardFooter>
		</Card>
	)
}

export { CourseDetailSubscriberSkeleton }