import { Course } from "@/model/Course";
import { Material } from "@/model/Material";
import { ChangeEvent } from "react";
import { GenerateId } from "../misc";

const MAX_MATERIAL_FILE_SIZE = 10 * 1024 * 1024;
const TO_MB_DIVIDER = 1024 * 1024;

export const AreThereDifferences = (course: Course, editedCourse: Course) => {
    return course.name !== editedCourse.name || course.description !== editedCourse.description || course.year !== editedCourse.year || course.status !== editedCourse.status;
}

export const SaveFileAndGetMaterial = async (event: ChangeEvent<HTMLInputElement>, courseId: string) => {
    const file = event.target.files?.[0];
    //TODO: Aggiungi controllo estensione accettata
    if (!file || !IsFileSizeValid(file)) return;

    const formData = new FormData();
    formData.append("material", file);

    try{
        const response = await fetch('http://localhost:3001/api/upload', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Failed to upload file');
        }

        const { filePath } = await response.json();

        const material: Material = {
            id: GenerateId(),
            fileName: file.name,
            courseId: courseId,
            uploadDate: new Date().toISOString(),
            size: file.size,
            filePath: filePath
        };

        return material;
    } catch(e){
        //TODO: Error toast
        throw e; 
    }
}

const IsFileSizeValid = (file: File) => {
    return file.size <= MAX_MATERIAL_FILE_SIZE;
}

export const GetFileSizeInMB = (fileSize: number) => {
    return (fileSize / TO_MB_DIVIDER).toFixed(1);
}