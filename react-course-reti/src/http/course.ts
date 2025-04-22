import { Course } from "@/model/Course";
import { httpClient } from "./client";

const BASE_URL = "courses"

export const getCourses = async (): Promise<Course[]> => {
    const courses = await httpClient.get(BASE_URL);

    return courses.data;
}

export const addCourse = async (course: Course): Promise<Course> => {
   const addedCourse = await httpClient.post(BASE_URL, course);

   return addedCourse.data; 
}

export const editCourse = async (course: Course): Promise<Course> => {
    const editedCourse = await httpClient.put(BASE_URL + "/" + course.id, course);

    return editedCourse.data; 
}

export const deleteCourse = async (id: string): Promise<void> => {
    await httpClient.delete(BASE_URL + "/" + id);
}

export const getCourse = async (id: string): Promise<Course> => {
    const course = await httpClient.get(BASE_URL + "/" + id);

    return course.data;
}