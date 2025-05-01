import GazzaDialog from "@/components/utils/gazza-dialog";
import { columns } from "./columns"
import { DataTable, DataTableSkeleton } from "./data-table"
import { User, UserEntity } from "@/model/User";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import UserDialog from "@/components/utils/dialogs/user-dialog";

interface UsersTableWrapperProps {
    users: UserEntity[];
    onAddUser: (user: User) => void;
    onEditUser: (user: User) => void;
    onDeleteUser: (id: string) => void;
    loading: boolean
}

export default function UsersTableWrapper({ users, onAddUser, onEditUser, onDeleteUser, loading }: UsersTableWrapperProps) {

    if (loading)
        return (
            <div className="container mx-auto">
                <DataTableSkeleton />
            </div>
        )

    return (
        <div className="container mx-auto">
            <DataTable columns={columns({ onEditUser, onDeleteUser })} data={users}>
                <GazzaDialog dialogComponent={(props) => <UserDialog submit={(onAddUser)} {...props} />}>
                    <Button variant="outline" className="flex items-center gap-1 cursor-pointer">
                        <Plus className="h-4 w-4" />
                        Aggiungi utente
                    </Button>
                </GazzaDialog>
            </DataTable>
        </div>
    )
}
