import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Course } from "@/model/Course";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { useEffect } from "react";
import { DialogDescription, } from "@radix-ui/react-dialog";
import { DialogBaseProps } from "@/components/utils/interfaces/dialog-base-props";
import { GenerateId } from "../misc";

interface CourseDialogProps extends DialogBaseProps {
    course?: Course;
    submit: (course: Course) => void;
}

const CourseDialog = ({ course, submit, setOpen, open }: CourseDialogProps) => {

    const defaultValues = {
        id: course ? course.id : GenerateId(),
        name: course ? course.name : "",
        description: course ? course.description : "",
        image: course ? course.image : "",
        status: course ? course.status : "Pianificato",
        subscribers: course ? course.subscribers : 0,
        year: course ? course.year : new Date().getFullYear()
    }

    const { register, handleSubmit, formState: { errors }, reset } = useForm<Course>({
        defaultValues: defaultValues
    });

    useEffect(() => {
        reset(defaultValues);
    }, [open])

    const onSubmit = (data: Course) => {        
        submit(data);
        setOpen(false);
    }

    return (
        <DialogContent className="sm:max-w-[450px]">
            <DialogHeader>
                <DialogTitle>{course ? "Modifica" : "Aggiungi"} Corso</DialogTitle>
            </DialogHeader>
            <DialogDescription>
                Compila i campi per { course ? "modificare" : "aggiungere" } un corso.
            </DialogDescription>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-6 pt-4">
                    <div className="grid gap-3">
                        <Label htmlFor="name" className="text-right">
                            Nome
                        </Label>
                        <Input {...register("name", { required: true })} aria-invalid={errors.name ? "true" : "false"} id="name" className="col-span-3" />
                        {errors.name && errors.name.type === "required" && <span className="text-xs text-red-400" role="alert">Campo obbligatorio</span>}
                    </div>
                    <div className="grid gap-3">
                        <Label htmlFor="description" className="text-right">
                            Descrizione
                        </Label>
                        <Textarea {...register("description", { required: true })} aria-invalid={errors.description ? "true" : "false"} id="description" className="col-span-3 max-h-[350px]" />
                        {errors.description && errors.description.type === "required" && <span className="text-xs text-red-400" role="alert">Campo obbligatorio</span>}
                    </div>
                    <div className="grid gap-3">
                        <Label htmlFor="image" className="text-right">
                            URL Immagine
                        </Label>
                        <Input {...register("image", { required: true })} aria-invalid={errors.image ? "true" : "false"} id="image" className="col-span-3" />
                        {errors.image && errors.image.type === "required" && <span className="text-xs text-red-400" role="alert">Campo obbligatorio</span>}
                    </div>
                    
                    <div className="grid gap-3">
                        <Label htmlFor="year" className="text-right">
                            Anno
                        </Label>
                        <Input {...register("year", { required: true })} aria-invalid={errors.year ? "true" : "false"} type="number" min={2020} id="year" placeholder={new Date().getFullYear().toString()} className="col-span-3" />
                        {errors.year && errors.year.type === "required" && <span className="text-xs text-red-400" role="alert">Campo obbligatorio</span>}
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
export default CourseDialog;