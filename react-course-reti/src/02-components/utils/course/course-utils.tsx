import { Course } from "@/05-model/Course";
import { Material } from "@/05-model/Material";
import { ChangeEvent } from "react";
import { Lesson } from "@/05-model/Lesson";
import { User } from "@/05-model/User";
import { GenerateId } from "@/05-model/BaseEntity";

const MAX_MATERIAL_FILE_SIZE = 10 * 1024 * 1024;
const TO_MB_DIVIDER = 1024 * 1024;
const ACCEPTED_MATERIAL_FILE_EXTENSIONS = ['pdf', 'ppt', 'pptx', 'txt', 'mp4'];
const ACCEPTED_AVATAR_FILE_EXTENSIONS = ['png', 'jpg', 'jpeg'];
const MATERIALS_BASE_URL = "http://localhost:3001/api/material";
const AVATAR_BASE_URL = "http://localhost:3001/api/avatar";

export const AreCoursesDifferent = (course: Course, editedCourse: Course) => {
    return course.name !== editedCourse.name || course.description !== editedCourse.description || course.year !== editedCourse.year || course.status !== editedCourse.status || course.closeDate !== editedCourse.closeDate;
}

export const AreLessonsDifferent = (lesson: Lesson, editedLesson: Lesson) => {
    return lesson.name !== editedLesson.name || lesson.lessonDate !== editedLesson.lessonDate;
}
//TODO: Change in different utils files these methods

export const AreUsersDifferent = (user: User, editedUser: User) => {
    return user.id !== editedUser.id || user.firstName !== editedUser.firstName || user.lastName !== editedUser.lastName || user.email !== editedUser.email || user.isAdmin !== editedUser.isAdmin || user.avatar !== editedUser.avatar;
}

export const SaveAndGetMaterial = async (event: ChangeEvent<HTMLInputElement>, courseId: string) => {
    const file = event.target.files?.[0];
    if (!file) throw new Error('Non è stato selezionato nessun file');
    if (!IsFileSizeValid(file)) throw new Error('Dimensione file superiore a 10MB');

    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!ACCEPTED_MATERIAL_FILE_EXTENSIONS.includes(fileExtension!)) throw new Error('Estensione file non supportata');

    const formData = new FormData();
    formData.append("material", file);

    try {
        const response = await fetch(`${MATERIALS_BASE_URL}/upload`, {
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
    } catch {
        throw new Error('Upload del file fallito');
    }
}

export const DownloadMaterial = async (material: Material) => {
    try {
        const response = await fetch(`${MATERIALS_BASE_URL}/download/${material.fileName}`);

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
    } catch {
        throw new Error('Download del file fallito');
    }
}

export const DeleteMaterial = async (material: Material) => {
    try {
       const response = await fetch(`${MATERIALS_BASE_URL}/delete/${material.fileName}`, {
           method: 'DELETE'
       });

       if (!response.ok) {
           throw new Error('Eliminazione del file fallita');
       }

       return true;
    } catch {
        throw new Error('Eliminazione del file fallita'); 
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
        const entity = await fetchFunc(key);
        setData(entity);
        return entity;
      } catch {
        // Toast
      } finally {
        setLoading(false);
      }
}

export const SaveAndGetAvatarFileName = async (file: File) => {
    if (!file) throw new Error('Non è stato selezionato nessun file');
    if (!IsFileSizeValid(file)) throw new Error('Dimensione file superiore a 10MB');

    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!ACCEPTED_AVATAR_FILE_EXTENSIONS.includes(fileExtension!)) throw new Error('Estensione file non supportata');

    const formData = new FormData();
    formData.append("avatar", file);
    try {
        const response = await fetch(`${AVATAR_BASE_URL}/upload`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Upload del file fallito');
        }

        const { fileName } = await response.json();

        return fileName;
    } catch {
        throw new Error('Upload del file fallito');
    }
}

const IsFileSizeValid = (file: File) => {
    return file.size <= MAX_MATERIAL_FILE_SIZE;
}