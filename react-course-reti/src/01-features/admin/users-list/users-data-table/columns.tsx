import { Avatar, AvatarFallback, AvatarImage } from "@/02-components/ui/avatar"
import { Badge } from "@/02-components/ui/badge"
import { Button } from "@/02-components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/02-components/ui/tooltip"
import UserDialog from "@/02-components/utils/dialogs/user-dialog"
import GazzaConfirmDialog from "@/02-components/ui/gazza-confirm-dialog"
import GazzaDialog from "@/02-components/ui/gazza-dialog"
import { User, UserEntity } from "@/05-model/User"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Pencil, ShieldCheck, SquareArrowOutUpRight, Trash2, User as UserIcon } from "lucide-react"
import { Link } from "react-router"

interface ColumnsProps {
    onEditUser: (user: User) => void;
    onDeleteUser: (id: string) => void;
}

export const columns = ({ onEditUser, onDeleteUser }: ColumnsProps): ColumnDef<UserEntity>[] => [
    {
        accessorKey: "name",
        accessorFn: (row) => {
            return `${row.firstName} ${row.lastName}`
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
            const user = row.original;
            return (
                <div className="flex gap-3 items-center w-[200px]">
                    <Avatar className="h-10 w-10 rounded-lg">
                        <AvatarImage src={`/avatars/${user.avatar}`} alt={`${user.firstName} ${user.lastName}`} className="object-cover" />
                        <AvatarFallback className="rounded-lg">{`${user.firstName.charAt(0).toUpperCase()}${user.lastName.charAt(0).toUpperCase()}`}</AvatarFallback>
                    </Avatar>
                    {`${user.firstName} ${user.lastName}`}
                </div>
            )
        }
    },
    {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => {
            const user = row.original;
            return <div className="w-[200px]">{user.email}</div>
        }
    },
    {
        accessorKey: "type",
        header: "Tipo",
        cell: ({ row }) => {
            const user = row.original;
            return (
                <div className="w-[200px]">
                    <Badge
                        variant="outline"
                        className="flex gap-1 px-1.5 text-muted-foreground [&_svg]:size-3"
                    >
                        {user.isAdmin ? (
                            <ShieldCheck className="text-green-500 dark:text-green-400" />
                        ) : (
                            <UserIcon />
                        )}
                        {user.isAdmin ? "Amministratore" : "Studente"}
                    </Badge>
                </div>
            )
        }
    },
    {
        accessorKey: "joinedDate",
        header: "Data registrazione",
        cell: ({ row }) => {
            const user = row.original;
            return <div className="w-[200px]">{new Date(user.joinedDate).toLocaleDateString('it-IT')}</div>
        }
    },
    {
        accessorKey: "subscriptionNumber",
        header: "Iscrizioni corsi",
        cell: ({ row }) => {
            const user = row.original;
            return (
                <div className="w-[100px]">
                    <Badge variant="outline">
                        {user.subscribers.length}
                    </Badge>
                </div>
            )
        }
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const user = row.original;

            const isUserDeletable = !user.courses.some(c => c.status === "In corso");

            const DeleteButton = (
                <Button variant="ghost" size="icon" className="h-8 w-8 p-0" disabled={!isUserDeletable}>
                    <Trash2 className="h-4 w-4" />
                </Button>
            )

            return (
                <div className="flex gap-2 w-max">
                    <GazzaDialog dialogComponent={(props) => <UserDialog {...props} user={user} submit={onEditUser} />}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                            <Pencil className="h-4 w-4" />
                        </Button>
                    </GazzaDialog>
                    <GazzaConfirmDialog dialogTitle="Elimina utente" dialogMessage={`Sei sicuro di voler eliminare ${user.firstName} ${user.lastName}?`} onConfirm={() => onDeleteUser(user.id)}>
                        {isUserDeletable ?
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
                    <Link to={`/users/detail/${user.id}`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                            <SquareArrowOutUpRight className="h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            )
        }
    }
]
