import { Course, CourseDetails, CourseSubscribers } from "@/05-model/Course";
import { get, post, put, del } from "./client";

const BASE_URL = "courses"

export const getCourses = async (delay? : number): Promise<CourseSubscribers[]> => {
    return await get(BASE_URL + "?_embed=subscribers", delay);
}

export const addCourse = async (course: Course): Promise<Course> => {
    return await post(BASE_URL, course);
}

export const editCourse = async (course: Course): Promise<Course> => {
    return await put(`${BASE_URL}/${course.id}`, course);
}

export const deleteCourse = async (id: string): Promise<void> => {
    return await del(`${BASE_URL}/${id}`);
}

export const getCourse = async (id: string): Promise<Course> => {
    return await get(`${BASE_URL}/${id}`);
}

export const getCoursesDetailsById = async (ids: string[]): Promise<CourseDetails[]> => {
    const courses = await get(`${BASE_URL}?_embed=lessons&_embed=materials`);
    return courses
        .filter((c: CourseDetails) => ids.includes(c.id))
        .sort((a: CourseDetails, b: CourseDetails) => a.year - b.year);
}