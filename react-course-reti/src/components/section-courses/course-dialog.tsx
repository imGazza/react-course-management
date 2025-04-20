import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Course } from "@/model/Course";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { set, useForm } from "react-hook-form";
import { Textarea } from "../ui/textarea";
import { useEffect } from "react";

interface CourseDialogProps {
    course?: Course;
    setOpen: (open: boolean) => void;
    submit: (course: Course) => void;
}

const CourseDialog = ({ course, setOpen, submit }: CourseDialogProps) => {

    const defaultValues = {
        name: course ? course.name : "",
        description: course? course.description : "",
        image: course? course.image : "",
        status: course? course.status : "Pianificato",
        subscribers: course? course.subscribers : 0,
        year: course? course.year : new Date().getFullYear()
    }

    const { register, handleSubmit, formState: { errors, isSubmitSuccessful }, reset } = useForm<Course>({
        defaultValues: defaultValues
    });

    useEffect(() => {
        if(isSubmitSuccessful){
            reset(defaultValues);
        }
    })

    const onSubmit = (data: Course) => {        
        submit(data);
        setOpen(false);
    }

    return (
        <DialogContent className="sm:max-w-[450px]">
            <DialogHeader>
                <DialogTitle>{course ? "Modifica" : "Aggiungi"} Corso</DialogTitle>
            </DialogHeader>
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
                    <div className="flex gap-4">
                        <div className="grid gap-3 flex-1">
                            <Label htmlFor="status" className="text-right">
                                Stato
                            </Label>
                            <Select {...register("status", { required: true })} value={"Pianificato"} onValueChange={() => { }}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Anno" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="Pianificato">Pianificato</SelectItem>
                                        <SelectItem value="In corso">In corso</SelectItem>
                                        <SelectItem value="Chiuso">Chiuso</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-3 flex-1">
                            <Label htmlFor="subscribers" className="text-right">
                                Numero iscrizioni
                            </Label>
                            <Input {...register("subscribers", { required: true })} type="number" min={0} id="subscribers" placeholder="0" className="col-span-3" />
                        </div>
                    </div>
                    
                    <div className="grid gap-3">
                        <Label htmlFor="year" className="text-right">
                            Anno
                        </Label>
                        <Input {...register("year", { required: true })} aria-invalid={errors.year ? "true" : "false"} type="number" min={2020} id="year" placeholder="2025" className="col-span-3" />
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