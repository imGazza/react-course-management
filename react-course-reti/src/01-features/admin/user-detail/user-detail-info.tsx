import { ShieldCheck, UserIcon, MailIcon, CalendarIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/02-components/ui/avatar";
import { Card } from "@/02-components/ui/card";
import { Badge } from "@/02-components/ui/badge";
import { User } from "@/05-model/User";
import { Skeleton } from "@/02-components/ui/skeleton";
import { useContext, useEffect, useState } from "react";
import { getUserById } from "@/03-http/user";
import { AuthContext } from "@/06-providers/auth/auth-context";

const UserDetailInfo = ({ userId }: { userId: string }) => {

	const [loading, setLoading] = useState(false);
	const [localUser, setLocalUser] = useState<User>();
	const { user } = useContext(AuthContext);

	useEffect(() => {
		setLoading(true);

		async function fetchUser() {

			// Se l'utente loggato è lo stesso che sto cercando di visualizzare inutile fare la chiamata
			if (userId === user?.id) {
				setLocalUser(user);
				setLoading(false);
				return;
			}

			try {
				const user = await getUserById(userId);
				setLocalUser(user);
			} catch (error) {
				// Toast
			} finally {
				setLoading(false);
			}
		}
		fetchUser();
	}, [user]);

	if (loading || !localUser)
		return <UserDetailInfoSkeleton />;

	return (
		<div className="space-y-8">
			<Card className="overflow-hidden">
				<div className="p-8 md:p-10">
					<div className="flex flex-col md:flex-row md:items-center gap-6">
						<div>
							<Avatar className="w-24 h-24 border-muted">
								<AvatarImage src={`/avatars/${localUser.avatar}`} alt={`${localUser.firstName} ${localUser.lastName}`} className="object-cover" />
								<AvatarFallback className="text-3xl">{`${localUser.firstName.charAt(0)}${localUser.lastName.charAt(0)}`}</AvatarFallback>
							</Avatar>
						</div>

						<div className="flex-1">
							<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
								<div>
									<h2 className="text-3xl font-bold">{`${localUser.firstName} ${localUser.lastName}`}</h2>
									<Badge
										variant="outline"
										className="mt-2 text-md font-medium px-3 py-1"
									>
										{localUser.isAdmin ? (
											<ShieldCheck className="text-green-500 dark:text-green-400 h-12 w-12" />
										) : (
											<UserIcon />
										)}
										{localUser.isAdmin ? "Amministratore" : "Studente"}
									</Badge>
								</div>

								<div className="flex flex-col sm:items-end gap-2 text-muted-foreground">
									<div className="flex items-center gap-2">
										<MailIcon className="w-4 h-4" />
										<span>{localUser.email}</span>
									</div>
									<div className="flex items-center gap-2">
										<CalendarIcon className="w-4 h-4" />
										<span>Registrato in data {new Date(localUser.joinedDate).toLocaleDateString('it-IT')}</span>
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