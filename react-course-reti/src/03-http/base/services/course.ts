import { Course, CourseEmbedsLessonsAndMaterials, CourseEmbedsSubscriptions } from "@/05-model/base/Course";
import { BaseService } from "../base-service";
import client from "../client";

class CourseService extends BaseService<Course> {
    constructor() {
        super("courses");
    }   

    getCoursesEmbedsSubscriptions = async (delay?: number): Promise<CourseEmbedsSubscriptions[]> => {
        return await client.get<CourseEmbedsSubscriptions[]>(`${this.baseUrl}?_embed=subscriptions`, delay);
    }

    getCoursesEmbedsLessonsAndMaterials = async (): Promise<CourseEmbedsLessonsAndMaterials[]> => {
        return await client.get<CourseEmbedsLessonsAndMaterials[]>(`${this.baseUrl}?_embed=lessons&_embed=materials`);
    }

    deleteCourseDependentSubscriptions = async (course: Course): Promise<void> => {
        await client.delete<Course>(`${this.baseUrl}/${course.id}?_dependent=subscriptions`);
    }
}

export const courseService = new CourseService();