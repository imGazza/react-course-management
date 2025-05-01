import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { DialogDescription, } from "@radix-ui/react-dialog";
import { BaseDialogProps } from "@/components/utils/interfaces/dialog-base-props";
import { GenerateId } from "../misc";
import { User } from "@/model/User";
import { Switch } from "@/components/ui/switch";

//TODO: Sistema il warning che appare all'apertura del popover

interface LessonDialogProps extends BaseDialogProps {
    user?: User;
    submit: (user: User) => void;
}

const UserDialog = ({ user, submit, setOpen, open }: LessonDialogProps) => {

    const defaultValues = {
        id: user ? user.id : GenerateId(),
        firstName: user ? user.firstName : "",
        lastName: user ? user.lastName : "",
        email: user ? user.email : "",
        isAdmin: user ? user.isAdmin : false,
        avatar: user ? user.avatar : "",
        joinedDate: user? user.joinedDate : new Date().toISOString()
    }

    const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<User>({
        defaultValues: defaultValues
    });

    useEffect(() => {
        reset(defaultValues);
    }, [open]);

    const onSubmit = (data: User) => {
        submit(data);
        setOpen(false);
    }

    return (
        <DialogContent className="sm:max-w-[450px]">
            <DialogHeader>
                <DialogTitle>{user ? "Modifica" : "Aggiungi"} Utente</DialogTitle>
            </DialogHeader>
            <DialogDescription>
                Compila i campi per {user ? "modificare" : "aggiungere"} l'utente.
            </DialogDescription>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-6 pt-4">
                    <div className="grid gap-3">
                        <Label htmlFor="name" className="text-right">
                            Nome
                        </Label>
                        <Input {...register("firstName", { required: true })} aria-invalid={errors.firstName ? "true" : "false"} id="name" className="col-span-3" />
                        {errors.firstName && errors.firstName.type === "required" && <span className="text-xs text-red-400" role="alert">Campo obbligatorio</span>}
                    </div>
                    <div className="grid gap-3">
                        <Label htmlFor="lastName" className="text-right">
                            Cognome
                        </Label>
                        <Input {...register("lastName", { required: true })} aria-invalid={errors.lastName ? "true" : "false"} id="name" className="col-span-3" />
                        {errors.lastName && errors.lastName.type === "required" && <span className="text-xs text-red-400" role="alert">Campo obbligatorio</span>}
                    </div>
                    <div className="grid gap-3">
                        <Label htmlFor="email" className="text-right">
                            Email
                        </Label>
                        <Input type="email" {...register("email", { required: true })} aria-invalid={errors.email ? "true" : "false"} id="name" className="col-span-3" />
                        {errors.email && errors.email.type === "required" && <span className="text-xs text-red-400" role="alert">Campo obbligatorio</span>}
                    </div>
                    <div className="grid gap-3">
                        <div className="flex items-center space-x-2">
                            <Switch 
                                id="administrator" 
                                checked={watch("isAdmin")}
                                onCheckedChange={(checked) => {
                                    register("isAdmin").onChange({
                                        target: { value: checked, name: "isAdmin" }
                                    });
                                }}
                            />
                            <Label htmlFor="administrator">Amministratore</Label>
                        </div>
                    </div>
                    <div className="grid gap-3">
                        <DialogFooter className="flex flex-col gap-3">
                            <Button type="submit">Conferma</Button>
                        </DialogFooter>
                    </div>
                </div>
            </form>
        </DialogContent>
    )

}
export default UserDialog;