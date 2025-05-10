import useBreadcrumbs from "@/04-hooks/use-breadcrums";
import { Card } from "@/02-components/ui/card"
import UsersTableWrapper from "./users-data-table/users-table-wrapper"
import { User, UserState } from "@/05-model/User";
import UsersSectionCards from "./users-section-cards";
import useBaseComponentCustom from "@/04-hooks/use-base-component-custom";
import { userService } from "@/03-http/base/services/user";
import { AreUsersDifferent } from "@/02-components/utils/course/course-utils";
import { userManagementService } from "@/03-http/users-management-service";

const UsersSection = () => {

    useBreadcrumbs([{ label: "Utenti", url: "#" }]);

    const {
        query: { data: users = [] },
        onAdd,
        onEdit,
        onDelete,
        isLoading
    } = useBaseComponentCustom<User, UserState, "user", UserState[]>({
        queryKey: ["users"],
        fetch: () => userManagementService.getUsersState(),
        add: userService.add,
        edit: userService.edit,
        del: userService.delete,
        entityKey: 'user'
    });

    const onAddUser = async (user: User) => {
        onAdd(user);
    }

    const onEditUser = async (editedUser: User) => {
        if (!AreUsersDifferent(editedUser, users.find(u => u.user.id === editedUser.id)!.user))
            return;

        onEdit(editedUser);
    }

    const onDeleteUser = async (id: string) => {
        onDelete(id);
    }

    return (
        <div className="grid grid-cols-1 @xl/main:grid-cols-4 gap-4 px-4 *:data-[slot=card]:shadow-xs *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card lg:px-6">
            <UsersSectionCards usersState={users} loading={isLoading} />

            <Card className="col-span-1 sm:col-span-4 flex flex-col px-4 py-4">
                <UsersTableWrapper users={users} onAddUser={onAddUser} onEditUser={onEditUser} onDeleteUser={onDeleteUser} loading={isLoading} />
            </Card>
        </div>
    )
}
export default UsersSection