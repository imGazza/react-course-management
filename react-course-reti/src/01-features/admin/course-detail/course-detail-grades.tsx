import { Card } from "@/02-components/ui/card"
import { SubscriptionsWithUser } from "@/05-model/Subscribers";
import { Avatar, AvatarFallback, AvatarImage } from "@/02-components/ui/avatar";
import { Badge } from "@/02-components/ui/badge";
import { Button } from "@/02-components/ui/button";
import { Input } from "@/02-components/ui/input";
import { useEffect, useState } from "react";
import { subscriberService } from "@/03-http/base/services/subscriber";
import { ScrollArea } from "@/02-components/ui/scroll-area";
import { avatarFallback } from "@/02-components/utils/misc";
import { toaster } from "@/02-components/utils/toaster";

interface CourseDetailSubscriberProps {
	initialSubscriptionsWithUser: SubscriptionsWithUser[];
}

const CourseDetailGrades = ({ initialSubscriptionsWithUser }: CourseDetailSubscriberProps) => {

	const [gradedSubs, setGradedSubs] = useState<SubscriptionsWithUser[]>([]);
	const [notGradedSubs, setNotGradedSubs] = useState<SubscriptionsWithUser[]>([]);
	const [subscriptionsWithUser, setSubscriptionsWithUser] = useState<SubscriptionsWithUser[]>(initialSubscriptionsWithUser);
	const [editingId, setEditingId] = useState<string | null>(null);

	useEffect(() => {
		setGradedSubs(subscriptionsWithUser.filter(s => s.subscription.grade !== null));
		setNotGradedSubs(subscriptionsWithUser.filter(s => s.subscription.grade === null));
	}, [subscriptionsWithUser]);

	// Triggerato con l'input del numero
	const handleGradeChange = (value: string, subscriber: SubscriptionsWithUser) => {
		const grade = parseInt(value);
		if (isNaN(grade))
			return;

		setSubscriptionsWithUser(subscriptionsWithUser.map(s => 
			s.subscription.id === subscriber.subscription.id ? { ...s, subscription: { ...s.subscription, grade: grade } } : s));
	};

	// Triggerato al blur (chiamata API)
	const handleGradeSubmit = async (subscribptionWithUser: SubscriptionsWithUser) => {
		setEditingId(null);
		if (subscribptionWithUser.subscription.grade === null)
			return;

		try {
			// Unica chiamata del componente, non uso l'hook di react-query per semplicità
			// Replico l'oggetto altrimenti viene aggiunto il campo "user" a db.json
			await subscriberService.edit({
				id: subscribptionWithUser.subscription.id,
				userId: subscribptionWithUser.subscription.userId,
				courseId: subscribptionWithUser.subscription.courseId,
				subscriptionDate: subscribptionWithUser.subscription.subscriptionDate,
				grade: subscribptionWithUser.subscription.grade
			});
		} catch {
			toaster.errorToast("Si è verificato un errore durante la modifica della valutazione");
		}
	};

	return (
		<div className="space-y-6">
			<div className="grid grid-cols-3 gap-4">
				<Card className="p-4 justify-between">
					<div className="text-sm text-muted-foreground">Media</div>
					<div className="text-2xl font-bold">
						{gradedSubs.length ? (gradedSubs.reduce((acc, gradedSubs) => acc + gradedSubs.subscription.grade!, 0) / gradedSubs.length).toFixed(1) : '-'}
					</div>
				</Card>
				<Card className="p-4 justify-between">
					<div className="text-sm text-muted-foreground">Valutazioni Assegnate</div>
					<div className="text-2xl font-bold">{gradedSubs.length}/{subscriptionsWithUser.length}</div>
				</Card>
				<Card className="p-4 justify-between">
					<div className="text-sm text-muted-foreground">Da Assegnare</div>
					<div className="text-2xl font-bold">{notGradedSubs.length}</div>
				</Card>
			</div>
			<div className="h-[310px]">
				<ScrollArea className="h-full">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{subscriptionsWithUser.map((subscriptionWithUser) => (
							<Card key={subscriptionWithUser.subscription.id} className="p-4">
								<div className="flex items-center space-x-4">
									<Avatar>
										<AvatarImage src={`/avatars/${subscriptionWithUser.user.avatar}`} className="object-cover" />
										<AvatarFallback className="text-xs">{avatarFallback(subscriptionWithUser.user.firstName, subscriptionWithUser.user.lastName)}</AvatarFallback>
									</Avatar>
									<div className="flex-1">
										<div className="font-medium">{`${subscriptionWithUser.user.firstName} ${subscriptionWithUser.user.lastName}`}</div>
										<div className="text-sm text-muted-foreground">
											{subscriptionWithUser.user.email}
										</div>
									</div>
								</div>
								<div className="mt-2">
									{subscriptionWithUser.subscription.grade || editingId === subscriptionWithUser.subscription.id ? (
										<div className="flex items-center gap-2">
											{editingId === subscriptionWithUser.subscription.id ?
												<>
													<Input
														type="number"
														min="1"
														max="30"
														defaultValue={subscriptionWithUser.subscription.grade ?? ""}
														className="w-20"
														autoFocus
														onBlur={() => handleGradeSubmit(subscriptionWithUser)}
														onChange={(e) => handleGradeChange(e.target.value, subscriptionWithUser)}
													/>
													<span className="text-sm text-muted-foreground">/30</span>
												</>
												:
												<Badge
													className="text-sm cursor-pointer hover:bg-primary/90"
													onClick={() => setEditingId(subscriptionWithUser.subscription.id)}
												>
													{subscriptionWithUser.subscription.grade}/30
												</Badge>
											}
										</div>
									) : (
										<Button
											variant="outline"
											className="text-xs p-2"
											onClick={() => setEditingId(subscriptionWithUser.subscription.id)}
										>
											Assegna
										</Button>
									)}
								</div>
							</Card>
						))}
					</div>
				</ScrollArea>
			</div>
		</div>
	)
}
export default CourseDetailGrades;