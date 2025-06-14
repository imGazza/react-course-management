import { Card } from "@/02-components/ui/card";
import { Input } from "@/02-components/ui/input";
import { Button } from "@/02-components/ui/button";
import { ChangeEvent, useEffect, useRef, useState, DragEvent } from "react";
import { AreUsersDifferent, User } from "@/05-model/base/User";
import { useForm } from "react-hook-form";
import { Avatar, AvatarFallback, AvatarImage } from "@/02-components/ui/avatar";
import { Label } from "@/02-components/ui/label";
import { Skeleton } from "@/02-components/ui/skeleton";
import { uploadPreviewDisplay } from "@/02-components/utils/file-manipulation/file-manipulation";
import { userService } from "@/03-http/base/services/user";
import { useQueryClient } from "@tanstack/react-query";
import { SaveAndGetAvatarFileName } from "@/02-components/utils/profile/profile-utils";
import { avatarFallback } from "@/02-components/utils/misc";
import { toaster } from "@/02-components/utils/toaster";
import { ErrorMessage } from "@/02-components/utils/error-messages";
import { useAuth } from "@/04-hooks/use-auth";
import { FileTooBigError } from "../errors/custom-exceptions/file-too-big";
import { NoFileSelectedError } from "../errors/custom-exceptions/no-file-selected";
import { FileNotAcceptedError } from "../errors/custom-exceptions/file-not-accepted";

interface ProfilePageEditProps {
	user: User;
}

const ProfilePageEdit = ({ user }: ProfilePageEditProps) => {
	
	const fileInput = useRef<HTMLInputElement>(null);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const [avatarFile, setAvatarFile] = useState<File | null>(null);
	const { setSessionUser } = useAuth();
	const [loading, setLoading] = useState<boolean>(false);
	const queryClient = useQueryClient();

	//In questo componente faccio solo una edit, non instanzio il baseComponent perchè non mi serve la cache di react-query

	const defaultValues = {
		id: user.id,
		firstName: user.firstName,
		lastName: user.lastName,
		email: user.email,
		avatar: user.avatar,
		isAdmin: user.isAdmin,
		joinedDate: user.joinedDate,
	}

	const { register, handleSubmit, formState: { errors }, reset } = useForm<User>({
		defaultValues: defaultValues
	});

	useEffect(() => {
		reset(defaultValues);
	}, [open])

	const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
		uploadPreviewDisplay(event, setAvatarFile, setPreviewUrl);		
	}

	const handleDragOver = (event: DragEvent<HTMLButtonElement>) => {
		event.preventDefault();
		event.currentTarget.classList.add('border-primary');
	};
	
	const handleDragLeave = (event: DragEvent<HTMLButtonElement>) => {
		event.preventDefault();
		event.currentTarget.classList.remove('border-primary');
	};
	
	const handleDrop = (event: DragEvent<HTMLButtonElement>) => {
		event.preventDefault();
		event.currentTarget.classList.remove('border-primary');
		
		const files = event.dataTransfer.files;
		if (files.length > 0 && files[0].type.startsWith('image/')) {
			uploadPreviewDisplay({ target: { files } } as any, setAvatarFile, setPreviewUrl);
		}
	};

	// Unca chiamata, non importo il custom hook di react-query per comodità
	// Importo solo il QueryClient per invalidare la cache
	const onSubmit = async (editedUser: User) => {		
		if(!AreUsersDifferent(user, editedUser) && !avatarFile)
			return;
		
		setLoading(true);
		try {
			if(avatarFile){
				const avatarFileName = await SaveAndGetAvatarFileName(avatarFile);
				editedUser.avatar = avatarFileName;
			}			
			const updatedUser = await userService.edit(editedUser);
			setSessionUser(updatedUser);
			queryClient.removeQueries({ queryKey: ["user", user.id] }); // rimuovo cache per forzare refetch dell'utente
		} catch (e){
			if(e instanceof FileTooBigError)
        toaster.errorToast(ErrorMessage.FILE_TOO_BIG);
      else if(e instanceof NoFileSelectedError)
        toaster.errorToast(ErrorMessage.NO_FILE_SELECTED);
      else if(e instanceof FileNotAcceptedError)
        toaster.errorToast(ErrorMessage.FILE_NOT_ACCEPTED);
      else
        toaster.errorToast(ErrorMessage.UPLOAD_FILE)
		} finally {
			setLoading(false);
		}
	}

	if(loading)
		return <ProfilePageEditSkeleton />;

	return (
		<div className="flex col-span-1">
			<Card className="px-6 w-full h-[540px]">
				<div className="flex gap-8 items-center">
					<Avatar className="w-24 h-24 border-muted">
						<AvatarImage src={previewUrl ?? `/avatars/${user.avatar}`} alt={`${user.firstName} ${user.lastName}`} className="object-cover" />
						<AvatarFallback className="text-3xl">{avatarFallback(user.firstName, user.lastName)}</AvatarFallback>
					</Avatar>
					<button 
						onClick={() => fileInput.current?.click()} 
						onDragOver={handleDragOver}
						onDragLeave={handleDragLeave}
						onDrop={handleDrop}
						className="flex-1 rounded-md bg-muted h-30 border-dashed border-3 flex items-center justify-center text-foreground/50 cursor-pointer transition-colors duration-200"
					>
						<input
							type="file"
							ref={fileInput}
							onChange={handleFileUpload}
							className="hidden"
							accept="image/*"
						/>
						{previewUrl ? 'Cambia immagine avatar' : 'Scegli l\'immagine per l\'avatar'}
					</button>
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
	)
}
export default ProfilePageEdit;

const ProfilePageEditSkeleton = () => {
	return (
		<div className="flex">
      <Card className="px-6 w-full h-[540px]">
        <div className="flex gap-8 items-center">
          <Skeleton className="w-24 h-24 rounded-full" />
          <Skeleton className="flex-1 h-30" />
        </div>
        <div className="flex flex-col gap-6 pt-4 justify-between">
          <div className="flex flex-col gap-6 pt-4">
            <div className="grid gap-3">
              <Skeleton className="h-[14px] w-16" />
              <Skeleton className="h-9 w-full" />
            </div>
            <div className="grid gap-3">
              <Skeleton className="h-[14px] w-16" />
              <Skeleton className="h-9 w-full" />
            </div>
            <div className="grid gap-3">
              <Skeleton className="h-[14px] w-16" />
              <Skeleton className="h-9 w-full" />
            </div>
          </div>
          <div className="flex justify-end">
            <Skeleton className="h-9 w-32" />
          </div>
        </div>
      </Card>
    </div>
	)
}