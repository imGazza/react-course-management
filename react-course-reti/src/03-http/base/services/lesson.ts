import { Lesson } from "@/05-model/Lesson";
import client from "../client";
import { BaseService } from "../base-service";

class LessonService extends BaseService<Lesson>{
    constructor() {
       super("lessons");
    }

    getLessonsByCourseId = async (courseId: string): Promise<Lesson[]> => {
        return await client.get<Lesson[]>(`${this.baseUrl}?courseId=${courseId}`);
    }
}
export const lessonService = new LessonService();
