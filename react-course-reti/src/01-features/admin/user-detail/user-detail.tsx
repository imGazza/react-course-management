import useBreadcrumbs from "@/04-hooks/use-breadcrums"
import UserDetailInfo, { UserDetailInfoSkeleton } from "./user-detail-info"
import UserInfoCourses, { UserInfoCoursesSkeleton } from "./user-info-courses"
import { useParams } from "react-router";
import { Suspense } from "react";

export function UserProfile() {

	useBreadcrumbs([{ label: "Utenti", url: "/users" }, { label: "Dettaglio", url: "#" }])
	const { userId } = useParams();

	return (
		<div className="px-6">
			<Suspense fallback={<UserDetailInfoSkeleton />}>
				<UserDetailInfo userId={userId!}/>
			</Suspense>
			<Suspense fallback={<UserInfoCoursesSkeleton />}>
				<UserInfoCourses />
			</Suspense>
		</div>
	)
}
export default UserProfile