import { Card } from "@/02-components/ui/card"
import { SubscriberUser } from "@/05-model/Subscribers";
import { Avatar, AvatarFallback, AvatarImage } from "@/02-components/ui/avatar";
import { Badge } from "@/02-components/ui/badge";
import { Button } from "@/02-components/ui/button";
import { Input } from "@/02-components/ui/input";
import { useEffect, useState } from "react";
import { setGrade } from "@/03-http/base/services/subscriber";
import { ScrollArea } from "@/02-components/ui/scroll-area";

interface CourseDetailSubscriberProps {
	initialSubscribers: SubscriberUser[];
}

const CourseDetailGrades = ({ initialSubscribers }: CourseDetailSubscriberProps) => {

	const [gradedSubs, setGradedSubs] = useState<SubscriberUser[]>([]);
	const [notGradedSubs, setNotGradedSubs] = useState<SubscriberUser[]>([]);
	const [subscribers, setSubscribers] = useState<SubscriberUser[]>(initialSubscribers);
	const [editingId, setEditingId] = useState<string | null>(null);

	useEffect(() => {
		setGradedSubs(subscribers.filter(s => s.grade !== null));
		setNotGradedSubs(subscribers.filter(s => s.grade === null));
	}, [subscribers]);

	const handleGradeChange = (value: string, subscriber: SubscriberUser) => {
		const grade = parseInt(value);
		if (isNaN(grade))
			return;

		setSubscribers(subscribers.map(s => s.id === subscriber.id ? { ...s, grade: grade } : s));
	};

	const handleGradeSubmit = async (subscriber: SubscriberUser) => {
		setEditingId(null);
		if (subscriber.grade === null)
			return;

		try {
			// Unica chiamata del componente, non uso l'hook di react-query per semplicità
			// Replico l'oggetto altrimenti viene aggiunto il campo "user" a db.json
			await setGrade({
				id: subscriber.id,
				userId: subscriber.userId,
				courseId: subscriber.courseId,
				subscriptionDate: subscriber.subscriptionDate,
				grade: subscriber.grade
			});
		} catch (e) {
			// Toast che mostra come errore e.message
		}
	};

	return (
		<div className="space-y-6">
			<div className="grid grid-cols-3 gap-4">
				<Card className="p-4 justify-between">
					<div className="text-sm text-muted-foreground">Media</div>
					<div className="text-2xl font-bold">
						{gradedSubs.length ? (gradedSubs.reduce((acc, gradedSubs) => acc + gradedSubs.grade!, 0) / gradedSubs.length).toFixed(1) : '-'}
					</div>
				</Card>
				<Card className="p-4 justify-between">
					<div className="text-sm text-muted-foreground">Valutazioni Assegnate</div>
					<div className="text-2xl font-bold">{gradedSubs.length}/{subscribers.length}</div>
				</Card>
				<Card className="p-4 justify-between">
					<div className="text-sm text-muted-foreground">Da Assegnare</div>
					<div className="text-2xl font-bold">{notGradedSubs.length}</div>
				</Card>
			</div>
			<div className="h-[310px]">
				<ScrollArea className="h-full">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{subscribers.map((subscriber) => (
							<Card key={subscriber.id} className="p-4">
								<div className="flex items-center space-x-4">
									<Avatar>
										<AvatarImage src={`/avatars/${subscriber.user.avatar}`} className="object-cover" />
										<AvatarFallback className="text-xs">{subscriber.user.firstName.charAt(0) + subscriber.user.lastName.charAt(0)}</AvatarFallback>
									</Avatar>
									<div className="flex-1">
										<div className="font-medium">{`${subscriber.user.firstName} ${subscriber.user.lastName}`}</div>
										<div className="text-sm text-muted-foreground">
											{subscriber.user.email}
										</div>
									</div>
								</div>
								<div className="mt-2">
									{subscriber.grade || editingId === subscriber.id ? (
										<div className="flex items-center gap-2">
											{editingId === subscriber.id ?
												<>
													<Input
														type="number"
														min="1"
														max="30"
														defaultValue={subscriber.grade ?? ""}
														className="w-20"
														autoFocus
														onBlur={() => handleGradeSubmit(subscriber)}
														onChange={(e) => handleGradeChange(e.target.value, subscriber)}
													/>
													<span className="text-sm text-muted-foreground">/30</span>
												</>
												:
												<Badge
													className="text-sm cursor-pointer hover:bg-primary/90"
													onClick={() => setEditingId(subscriber.id)}
												>
													{subscriber.grade}/30
												</Badge>
											}
										</div>
									) : (
										<Button
											variant="outline"
											className="text-xs p-2"
											onClick={() => setEditingId(subscriber.id)}
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