import useBreadcrumbs from "@/hooks/use-breadcrums"
import UserDetailInfo from "./user-detail-info"
import UserInfoCourses from "./user-info-courses"
import { useParams } from "react-router";

export function UserProfile() {

    useBreadcrumbs([{ label: "Utenti", url: "/users" }, { label: "Dettaglio", url: "#" }])
    const { userId } = useParams();

    return (
        <div className="px-6">
            <UserDetailInfo userId={userId!}/>
            <UserInfoCourses />
        </div>
    )
}
export default UserProfile