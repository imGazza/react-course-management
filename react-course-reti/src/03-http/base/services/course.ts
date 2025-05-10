import { Course, CourseWithSubscribers } from "@/05-model/Course";
import { BaseService } from "../base-service";
import { get } from "../client";

class CourseService extends BaseService<Course> {
    constructor() {
        super("courses");
    }

    async getCoursesWithSubscribers(): Promise<CourseWithSubscribers[]> {
        return await get<CourseWithSubscribers[]>(this.baseUrl + '?_embed=subscribers')
    }
}

export const courseService = new CourseService();