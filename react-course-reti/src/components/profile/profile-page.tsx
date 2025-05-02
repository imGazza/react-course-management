import { AuthContext } from "@/providers/auth/auth-context";
import UserDetailInfo from "../user-detail/user-detail-info"
import { useContext } from "react";
import { Card } from "../ui/card";

const ProfilePage = () => {

    const { user } = useContext(AuthContext);

    if (!user) {
        return <div>Loading...</div>
    }

    return (
        <>
            <div className="px-6">
                <UserDetailInfo user={user} />
                <Card className="px-6 mt-6">
                    <div className="flex gap-8 items-center">
                        <div className="rounded-md bg-muted h-30 border-dashed border-3 flex items-center justify-center text-foreground/50 cursor-pointer">
                            Scegli l'immagine per l'avatar
                        </div>
                        <div className="flex-1 rounded-md bg-muted h-30 border-dashed border-3 flex items-center justify-center text-foreground/50 cursor-pointer">
                            Scegli l'immagine per l'avatar
                        </div>
                    </div>
                </Card>
            </div>
        </>
    )
}
export default ProfilePage