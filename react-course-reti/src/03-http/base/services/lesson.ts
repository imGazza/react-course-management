import { Lesson } from "@/05-model/base/Lesson";
import client from "../client";
import { BaseService } from "../base-service";

class LessonService extends BaseService<Lesson>{
    constructor() {
       super("lessons");
    }

    getLessonsByCourseId = async (courseId: string): Promise<Lesson[]> => {
        return await client.get<Lesson[]>(`${this.baseUrl}?courseId=${courseId}`);
    }

    // Necessaria perchè uso l'intero oggetto per la delete, non solo l'id
    deleteLesson = async (lesson: Lesson): Promise<void> => {
        await client.delete<Lesson>(`${this.baseUrl}/${lesson.id}`);
    }
}
export const lessonService = new LessonService();
