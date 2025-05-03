import { AuthContext } from "@/providers/auth/auth-context";
import UserDetailInfo from "../user-detail/user-detail-info"
import { ChangeEvent, useContext, useEffect, useRef, useState } from "react";
import { Card } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { User } from "@/model/User";
import { editUser } from "@/http/user";
import { Skeleton } from "../ui/skeleton";

const ProfilePage = () => {

    const { user, setSessionUser } = useContext(AuthContext);
    const fileInput = useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const defaultValues = {
        id: user!.id,
        firstName: user!.firstName,
        lastName: user!.lastName,
        email: user!.email,
        avatar: user!.avatar,
        isAdmin: user!.isAdmin,
        joinedDate: user!.joinedDate,
    }

    const { register, handleSubmit, formState: { errors }, reset } = useForm<User>({
        defaultValues: defaultValues
    });

    useEffect(() => {
        reset(defaultValues);
    }, [open])

    function handleFileUpload(event: ChangeEvent<HTMLInputElement>): void {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    }

    if (loading || !user) {
        return <ProfilePageSkeleton />;
    }

    const onSubmit = async (editedUser: User) => {
        //TODO: Image saving

        setLoading(true);
        try {
            const updatedUser = await editUser(editedUser);
            setSessionUser(updatedUser);
        } catch (error) {
            // Toast 
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <div className="px-6">
                <UserDetailInfo userId={user.id} />
                <div className="flex">
                    <Card className="px-6 mt-6 w-full md:h-[540px]">
                        <div className="flex gap-8 items-center">
                            <Avatar className="w-24 h-24 border-muted">
                                <AvatarImage src={previewUrl || user.avatar} alt={`${user.firstName} ${user.lastName}`} className="object-cover" />
                                <AvatarFallback className="text-3xl">{`${user.firstName.charAt(0)}${user.lastName.charAt(0)}`}</AvatarFallback>
                            </Avatar>
                            <div onClick={() => fileInput.current?.click()} className="flex-1 rounded-md bg-muted h-30 border-dashed border-3 flex items-center justify-center text-foreground/50 cursor-pointer">
                                <input
                                    type="file"
                                    ref={fileInput}
                                    onChange={handleFileUpload}
                                    className="hidden"
                                    accept="image/*"
                                />
                                {previewUrl ? 'Cambia immagine avatar' : 'Scegli l\'immagine per l\'avatar'}
                            </div>
                        </div>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="flex flex-col gap-6 pt-4 justify-between">
                                <div className="flex flex-col gap-6 pt-4">
                                    <div className="grid gap-3">
                                        <Label htmlFor="firstName" className="text-right">
                                            Nome
                                        </Label>
                                        <Input {...register("firstName", { required: true })} aria-invalid={errors.firstName ? "true" : "false"} id="firstName" className="col-span-3" />
                                        {errors.firstName && errors.firstName.type === "required" && <span className="text-xs text-red-400" role="alert">Campo obbligatorio</span>}
                                    </div>
                                    <div className="grid gap-3">
                                        <Label htmlFor="lastName" className="text-right">
                                            Cognome
                                        </Label>
                                        <Input {...register("lastName", { required: true })} aria-invalid={errors.lastName ? "true" : "false"} id="lastName" className="col-span-3" />
                                        {errors.lastName && errors.lastName.type === "required" && <span className="text-xs text-red-400" role="alert">Campo obbligatorio</span>}
                                    </div>
                                    <div className="grid gap-3">
                                        <Label htmlFor="email" className="text-right">
                                            Email
                                        </Label>
                                        <Input {...register("email", { required: true })} aria-invalid={errors.email ? "true" : "false"} id="email" className="col-span-3" />
                                        {errors.email && errors.email.type === "required" && <span className="text-xs text-red-400" role="alert">Campo obbligatorio</span>}
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <Button type="submit">Salva modifiche</Button>
                                </div>
                            </div>
                        </form>
                    </Card>
                </div>
            </div>
        </>
    )
}
export default ProfilePage

const ProfilePageSkeleton = () => {
    return (
        <div className="px-6">
            <div className="flex">
                <Card className="px-6 mt-6 w-full md:h-[540px]">
                    <div className="flex gap-8 items-center">
                        <Skeleton className="w-24 h-24 rounded-full" />
                        <Skeleton className="flex-1 h-30" />
                    </div>
                    <div className="flex flex-col gap-6 pt-4 justify-between">
                        <div className="flex flex-col gap-6 pt-4">
                            <div className="grid gap-3">
                                <Skeleton className="h-4 w-16" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                            <div className="grid gap-3">
                                <Skeleton className="h-4 w-16" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                            <div className="grid gap-3">
                                <Skeleton className="h-4 w-16" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <Skeleton className="h-10 w-32" />
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    )
}
export { ProfilePageSkeleton }