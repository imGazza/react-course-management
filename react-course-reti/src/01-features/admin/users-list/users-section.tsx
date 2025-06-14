import useBreadcrumbs from "@/04-hooks/use-breadcrums";
import { Card } from "@/02-components/ui/card"
import UsersTableWrapper from "./users-data-table/users-table-wrapper"
import { AreUsersDifferent, User, UserState } from "@/05-model/base/User";
import UsersSectionCards from "./users-section-cards";
import { toaster } from "@/02-components/utils/toaster";
import { WarningMessage } from "@/02-components/utils/error-messages";
import useBaseComponent from "@/04-hooks/use-base-component";
import { userSectionService } from "@/03-http/expanded/user-section-service";

const UsersSection = () => {

	useBreadcrumbs([{ label: "Utenti", url: "#" }]);

	const {
		query: { data: usersState = [] },
		onAdd,
		onEdit,
		onDelete,
		isLoading
	} = useBaseComponent<UserState, UserState[]>({
		queryKey: ["usersState"],
		fetch: () => userSectionService.getUsersState(),
		add: userSectionService.addUserSection,
		edit: userSectionService.editUsersSection,
		del: userSectionService.deleteUsersSection,
		equals: userSectionService.sameItem
	});

	const onAddUser = async (user: User) => {
		const userState = usersState.find(u => u.user.email === user.email)
		if(userState){
			toaster.warnToast(WarningMessage.USER_ALREADY_EXISTS)
			return;
		}
		onAdd({ user: user, subscriptionsNumber: 0, isDeletable: true });
	}

	const onEditUser = async (editedUser: User) => {
		const old = usersState.find(u => u.user.id === editedUser.id);
		if (!old || !AreUsersDifferent(editedUser, old.user))
			return;

		onEdit({ user: editedUser, subscriptionsNumber: old.subscriptionsNumber, isDeletable: old.isDeletable });
	}

	const onDeleteUser = async (deletedUser: User) => {
		const deletedUserState = usersState.find(u => u.user.id === deletedUser.id);
		if (!deletedUserState)
			return;
		onDelete(deletedUserState);
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