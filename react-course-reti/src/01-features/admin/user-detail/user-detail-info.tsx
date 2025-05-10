import { ShieldCheck, UserIcon, MailIcon, CalendarIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/02-components/ui/avatar";
import { Card } from "@/02-components/ui/card";
import { Badge } from "@/02-components/ui/badge";
import { Skeleton } from "@/02-components/ui/skeleton";
import useBaseComponent from "@/04-hooks/use-base-component";
import { User } from "@/05-model/User";
import { userService } from "@/03-http/base/services/user";

const UserDetailInfo = ({ userId }: { userId: string }) => {

	const { query: { data: user }, isLoading } = useBaseComponent<User>({
			queryKey: ["user", userId],
			fetch: () => userService.get(userId),
		}
	)

	if (isLoading || !user)
		return <UserDetailInfoSkeleton />;

	return (
		<div className="space-y-8">
			<Card className="overflow-hidden">
				<div className="p-8 md:p-10">
					<div className="flex flex-col md:flex-row md:items-center gap-6">
						<div>
							<Avatar className="w-24 h-24 border-muted">
								<AvatarImage src={`/avatars/${user.avatar}`} alt={`${user.firstName} ${user.lastName}`} className="object-cover" />
								<AvatarFallback className="text-3xl">{`${user.firstName.charAt(0)}${user.lastName.charAt(0)}`}</AvatarFallback>
							</Avatar>
						</div>

						<div className="flex-1">
							<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
								<div>
									<h2 className="text-3xl font-bold">{`${user.firstName} ${user.lastName}`}</h2>
									<Badge
										variant="outline"
										className="mt-2 text-md font-medium px-3 py-1"
									>
										{user.isAdmin ? (
											<ShieldCheck className="text-green-500 dark:text-green-400 h-12 w-12" />
										) : (
											<UserIcon />
										)}
										{user.isAdmin ? "Amministratore" : "Studente"}
									</Badge>
								</div>

								<div className="flex flex-col sm:items-end gap-2 text-muted-foreground">
									<div className="flex items-center gap-2">
										<MailIcon className="w-4 h-4" />
										<span>{user.email}</span>
									</div>
									<div className="flex items-center gap-2">
										<CalendarIcon className="w-4 h-4" />
										<span>Registrato in data {new Date(user.joinedDate).toLocaleDateString('it-IT')}</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</Card>
		</div>
	)
}
export default UserDetailInfo;

const UserDetailInfoSkeleton = () => {
	return (
		<div className="space-y-8">
			<Card className="overflow-hidden">
				<div className="p-8 md:p-10">
					<div className="flex flex-col md:flex-row md:items-center gap-6">
						<div>
							<Skeleton className="w-24 h-24 rounded-full" />
						</div>

						<div className="flex-1">
							<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
								<div>
									<Skeleton className="h-9 w-48 mb-2" />
									<Skeleton className="h-6 w-32" />
								</div>

								<div className="flex flex-col sm:items-end gap-2">
									<div className="flex items-center gap-2">
										<Skeleton className="w-4 h-4" />
										<Skeleton className="h-4 w-32" />
									</div>
									<div className="flex items-center gap-2">
										<Skeleton className="w-4 h-4" />
										<Skeleton className="h-4 w-48" />
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</Card>
		</div>
	)
}