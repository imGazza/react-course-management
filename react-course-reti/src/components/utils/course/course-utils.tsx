import { Course } from "@/model/Course";
import { Material } from "@/model/Material";
import { ChangeEvent } from "react";
import { GenerateId } from "../misc";
import { Lesson } from "@/model/Lesson";

const MAX_MATERIAL_FILE_SIZE = 10 * 1024 * 1024;
const TO_MB_DIVIDER = 1024 * 1024;
const ACCEPTED_FILE_EXTENSIONS = ['pdf', 'ppt', 'pptx', 'txt'];

export const AreCoursesDifferent = (course: Course, editedCourse: Course) => {
    return course.name !== editedCourse.name || course.description !== editedCourse.description || course.year !== editedCourse.year || course.status !== editedCourse.status || course.closeDate !== editedCourse.closeDate;
}

export const AreLessonsDifferent = (lesson: Lesson, editedLesson: Lesson) => {
    return lesson.name !== editedLesson.name || lesson.lessonDate !== editedLesson.lessonDate;
}

export const SaveFileAndGetMaterial = async (event: ChangeEvent<HTMLInputElement>, courseId: string) => {
    const file = event.target.files?.[0];
    if (!file) throw new Error('Non è stato selezionato nessun file');
    if (!IsFileSizeValid(file)) throw new Error('Dimensione file superiore a 10MB');

    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!ACCEPTED_FILE_EXTENSIONS.includes(fileExtension!)) throw new Error('Estensione file non supportata');

    const formData = new FormData();
    formData.append("material", file);

    try {
        const response = await fetch('http://localhost:3001/api/upload', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Upload del file fallito');
        }

        const { fileName } = await response.json();

        const material: Material = {
            id: GenerateId(),
            name: file.name,
            courseId: courseId,
            uploadDate: new Date().toISOString(),
            size: file.size,
            fileName: fileName
        };

        return material;
    } catch (e) {
        throw new Error('Upload del file fallito');
    }
}

export const DownloadMaterial = async (material: Material) => {
    try {
        const response = await fetch(`http://localhost:3001/api/download/${material.fileName}`);

        if (!response.ok) {
            throw new Error('Download del file fallito');
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = material.name;
        document.body.appendChild(link);

        link.click();

        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
    } catch (e) {
        throw new Error('Download del file fallito');
    }
}

export const GetFileSizeInMB = (fileSize: number) => {
    return (fileSize / TO_MB_DIVIDER).toFixed(1);
}

export const FetchInitialData = async <T, U>(
    setLoading: (value: React.SetStateAction<boolean>) => void,
    setData: ((value: React.SetStateAction<T> ) => void) | ((value: T) => void),
    fetchFunc: (key: U) => Promise<T>,
    key: U
) => {
    try {
        setLoading(true);
        const materials = await fetchFunc(key);
        setData(materials);
      } catch (e) {

      } finally {
        setLoading(false);
      }
}

const IsFileSizeValid = (file: File) => {
    return file.size <= MAX_MATERIAL_FILE_SIZE;
}