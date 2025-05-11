import { Course, CourseEmbedsSubscriptions, CourseWithLessonsAndMaterialsByUserId } from "@/05-model/Course";
import { BaseService } from "../base-service";
import client from "../client";

class CourseService extends BaseService<Course> {
    constructor() {
        super("courses");
    }

    deleteCourse = async (id: string): Promise<Course> => {
        return await client.delete<Course>(`${this.baseUrl}/${id}?_dependent=subscribers`);
    }

    getCoursesEmbedsSubscribers = async (delay?: number): Promise<CourseEmbedsSubscriptions[]> => {
        return await client.get<CourseEmbedsSubscriptions[]>(`${this.baseUrl}?_embed=subscribers`, delay);
    }

    getCoursesWithLessonsAndMaterialsByUserId = async (userId: string): Promise<CourseWithLessonsAndMaterialsByUserId[]> => {
        return await client.get<CourseWithLessonsAndMaterialsByUserId[]>(`${this.baseUrl}?userId=${userId}&_embed=lessons&_embed=materials`);
    }
}

export const courseService = new CourseService();