import { useEffect } from "react";
import ProfilePageEdit from "./profile-page-edit";
import ProfilePageCards from "./profile-page-cards";
import useBreadcrumbs from "@/04-hooks/use-breadcrums";
import UserDetailInfo from "@/01-features/admin/user-detail/user-detail-info";
import { useNavigate } from "react-router";
import { useAuth } from "@/04-hooks/use-auth";

const ProfilePage = () => {

	useBreadcrumbs([{ label: "Profilo", url: "#" }]);
	const navigate = useNavigate();
	const { user } = useAuth();

	useEffect(() => {
		if (!user)
			navigate('/login');
	}, [user]);

	return (
		<>
			{user &&
				<div className="px-6">
					<UserDetailInfo userId={user.id} />
					<div className="mt-6 grid grid-cols-1 @xl/main:grid-cols-2 gap-4 *:data-[slot=card]:shadow-xs *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card">
						<ProfilePageCards user={user} />
						<ProfilePageEdit user={user} />
					</div>
				</div>
			}
		</>
	)
}
export default ProfilePage