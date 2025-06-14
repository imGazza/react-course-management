import { Avatar, AvatarFallback, AvatarImage } from "@/02-components/ui/avatar"
import { Badge } from "@/02-components/ui/badge"
import { Button } from "@/02-components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/02-components/ui/tooltip"
import UserDialog from "@/02-components/ui/dialogs/user-dialog"
import GazzaConfirmDialog from "@/02-components/ui/dialogs/gazza-confirm-dialog"
import GazzaDialog from "@/02-components/ui/dialogs/gazza-dialog"
import { User, UserState } from "@/05-model/base/User"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Pencil, ShieldCheck, SquareArrowOutUpRight, Trash2, User as UserIcon } from "lucide-react"
import { Link } from "react-router"
import { avatarFallback } from "@/02-components/utils/misc"

interface ColumnsProps {
	onEditUser: (user: User) => void;
	onDeleteUser: (user: User) => void;
}

export const columns = ({ onEditUser, onDeleteUser }: ColumnsProps): ColumnDef<UserState>[] => [
	
	// Avatar e Nome
	{
		accessorKey: "name",
		accessorFn: (row) => {
			return `${row.user.firstName} ${row.user.lastName}`
		},
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Name
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			)
		},
		cell: ({ row }) => {
			const state = row.original;
			return (
				<div className="flex gap-3 items-center w-[200px]">
					<Avatar className="h-10 w-10 rounded-lg">
						<AvatarImage src={`/avatars/${state.user.avatar}`} alt={`${state.user.firstName} ${state.user.lastName}`} className="object-cover" />
						<AvatarFallback className="rounded-lg">{avatarFallback(state.user.firstName, state.user.lastName)}</AvatarFallback>
					</Avatar>
					{`${state.user.firstName} ${state.user.lastName}`}
				</div>
			)
		}
	},

	// Email
	{
		accessorKey: "email",
		header: "Email",
		cell: ({ row }) => {
			const state = row.original;
			return <div className="w-[200px]">{state.user.email}</div>
		}
	},

	// Amministratore o Studente
	{
		accessorKey: "type",
		header: "Tipo",
		cell: ({ row }) => {
			const state = row.original;
			return (
				<div className="w-[200px]">
					<Badge
						variant="outline"
						className="flex gap-1 px-1.5 text-muted-foreground [&_svg]:size-3"
					>
						{state.user.isAdmin ? (
							<ShieldCheck className="text-green-500 dark:text-green-400" />
						) : (
							<UserIcon />
						)}
						{state.user.isAdmin ? "Amministratore" : "Studente"}
					</Badge>
				</div>
			)
		}
	},

	// Data di registrazione
	{
		accessorKey: "joinedDate",
		header: "Data registrazione",
		cell: ({ row }) => {
			const state = row.original;
			return <div className="w-[200px]">{new Date(state.user.joinedDate).toLocaleDateString('it-IT')}</div>
		}
	},
	{
		accessorKey: "subscriptionsNumber",
		header: "Iscrizioni corsi",
		cell: ({ row }) => {
			const state = row.original;
			return (
				<div className="w-[100px]">
					<Badge variant="outline">
						{state.subscriptionsNumber}
					</Badge>
				</div>
			)
		}
	},

	// Azioni
	{
		id: "actions",
		cell: ({ row }) => {
			const state = row.original;

			const DeleteButton = (
				<Button variant="ghost" size="icon" className="h-8 w-8 p-0" disabled={!state.isDeletable}>
					<Trash2 className="h-4 w-4" />
				</Button>
			)

			return (
				<div className="flex gap-2 w-max">
					<GazzaDialog dialogComponent={(props) => <UserDialog {...props} user={state.user} submit={onEditUser} />}>
						<Button variant="ghost" size="icon" className="h-8 w-8 p-0">
							<Pencil className="h-4 w-4" />
						</Button>
					</GazzaDialog>
					<GazzaConfirmDialog dialogTitle="Elimina utente" dialogMessage={`Sei sicuro di voler eliminare ${state.user.firstName} ${state.user.lastName}?`} onConfirm={() => onDeleteUser(state.user)}>
						{state.isDeletable ?
							DeleteButton :
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<div>
											{DeleteButton}
										</div>
									</TooltipTrigger>
									<TooltipContent>
										<p>L'utente ha corsi in stato In corso</p>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						}
					</GazzaConfirmDialog>
					<Link to={`/users/detail/${state.user.id}`}>
						<Button variant="ghost" size="icon" className="h-8 w-8 p-0">
							<SquareArrowOutUpRight className="h-4 w-4" />
						</Button>
					</Link>
				</div>
			)
		}
	}
]
