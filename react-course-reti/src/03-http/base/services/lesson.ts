import { Lesson } from "@/05-model/Lesson";
import { get } from "../client";
import { BaseService } from "../base-service";

class LessonService extends BaseService<Lesson>{
    constructor() {
       super("lessons");
    }

    async getLessonsByCourseId(courseId: string): Promise<Lesson[]> {
        return await get<Lesson[]>(`${this.baseUrl}?courseId=${courseId}`);
    }
}
export const lessonService = new LessonService();
