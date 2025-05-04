import { Course, CourseDetails, CourseSubscribers } from "@/model/Course";
import { httpClient } from "./client";

const BASE_URL = "courses"

export const getCourses = async (): Promise<CourseSubscribers[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const courses = await httpClient.get(BASE_URL + "?_embed=subscribers");

    return courses.data;
}

export const addCourse = async (course: Course): Promise<Course> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const addedCourse = await httpClient.post(BASE_URL, course);

    return addedCourse.data; 
}

export const editCourse = async (course: Course): Promise<Course> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const editedCourse = await httpClient.put(BASE_URL + "/" + course.id, course);

    return editedCourse.data; 
}

export const deleteCourse = async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    await httpClient.delete(BASE_URL + "/" + id);
}

export const getCourse = async (id: string): Promise<Course> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const course = await httpClient.get(BASE_URL + "/" + id);

    return course.data;
}

export const getCoursesDetailsById = async (ids: string[]): Promise<CourseDetails[]> => {
    const courses = await httpClient.get(BASE_URL + "?_embed=lessons&_embed=materials");

    return courses.data
        .filter((c: CourseDetails) => ids.includes(c.id)).sort((a: CourseDetails, b: CourseDetails) => a.year - b.year);
}