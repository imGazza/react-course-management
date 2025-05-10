import { Course, CourseEmbedsSubscriptions, CourseWithLessonsAndMaterialsByUserId } from "@/05-model/Course";
import { BaseService } from "../base-service";
import client from "../client";

class CourseService extends BaseService<Course> {
    constructor() {
        super("courses");
    }

    async getCoursesEmbedsSubscribers(delay?: number): Promise<CourseEmbedsSubscriptions[]> {
        return await client.get<CourseEmbedsSubscriptions[]>(`${this.baseUrl}?_embed=subscribers`, delay);
    }

    async getCoursesWithLessonsAndMaterialsByUserId(userId: string): Promise<CourseWithLessonsAndMaterialsByUserId[]> {
        return await client.get<CourseWithLessonsAndMaterialsByUserId[]>(`${this.baseUrl}?userId=${userId}&_embed=lessons&_embed=materials`);
    }

    async getCourseWithSubscriptions(): Promise<CourseEmbedsSubscriptions[]> {
        return await client.get<CourseEmbedsSubscriptions[]>(`${this.baseUrl}?_embed=subscribers`);        
    }
}

export const courseService = new CourseService();