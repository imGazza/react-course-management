import { Course } from "@/model/Course";
import { httpClient } from "./client";

const BASE_URL = "courses"

export const getCourses = async (): Promise<Course[]> => {
    const courses = await httpClient.get(BASE_URL);

    return courses.data;
}

// export const getCourse = async (email: string, password: string): Promise<Course> => {
//     const params = "?email=" + email + "&password=" + password;
//     const user = await httpClient.get(BASE_URL + params);

//     return user.data[0];
// }