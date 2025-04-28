import { httpClient } from "./client";
import { Grade } from "@/model/Grades";

const BASE_URL = "grades"

export const getCourseGrades = async (courseId: string): Promise<Grade[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const params = "?courseId=" + courseId;

    const subscribers = await httpClient.get(BASE_URL + params);
    return subscribers.data;
}