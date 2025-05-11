import useBreadcrumbs from "@/04-hooks/use-breadcrums";
import { Card } from "@/02-components/ui/card"
import UsersTableWrapper from "./users-data-table/users-table-wrapper"
import { AreUsersDifferent, User, UserState } from "@/05-model/User";
import UsersSectionCards from "./users-section-cards";
import useBaseComponentCustom from "@/04-hooks/use-base-component-custom";
import { userService } from "@/03-http/base/services/user";
import { userManagementService } from "@/03-http/users-management-service";

const UsersSection = () => {

	useBreadcrumbs([{ label: "Utenti", url: "#" }]);

	const {
		query: { data: usersState = [] },
		onAdd,
		onEdit,
		onDelete,
		isLoading
	} = useBaseComponentCustom<User, UserState, "user", UserState[]>({
		queryKey: ["usersState"],
		fetch: () => userManagementService.getUsersState(),
		add: userService.add,
		edit: userService.edit,
		del: userService.delete,
		entityKey: 'user',
		defaultEmptyItem: {
			subscriptionsNumber: 0,
			isDeletable: true
		}
	});

	const onAddUser = async (user: User) => {
		if (usersState.find(u => u.user.email === user.email)){
			// Toast che essite già un utente con questa email
			return;
		}

		onAdd(user);
	}

	const onEditUser = async (editedUser: User) => {
		if (!AreUsersDifferent(editedUser, usersState.find(u => u.user.id === editedUser.id)!.user))
			return;

		onEdit(editedUser);
	}

	const onDeleteUser = async (id: string) => {
		onDelete(id);
	}

	return (
		<div className="grid grid-cols-1 @xl/main:grid-cols-4 gap-4 px-4 *:data-[slot=card]:shadow-xs *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card lg:px-6">
			<UsersSectionCards usersState={usersState} loading={isLoading} />

			<Card className="col-span-1 sm:col-span-4 flex flex-col px-4 py-4">
				<UsersTableWrapper users={usersState} onAddUser={onAddUser} onEditUser={onEditUser} onDeleteUser={onDeleteUser} loading={isLoading} />
			</Card>
		</div>
	)
}
export default UsersSection