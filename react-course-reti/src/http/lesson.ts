import { Lesson } from "@/model/Lesson";
import { httpClient } from "./client";

const BASE_URL = "lessons"

export const getCourseLessons = async (courseId: string): Promise<Lesson[]> => {
    await new Promise(resolve => setTimeout(resolve, 750));
    const params = "?courseId=" + courseId;

    const lessons = await httpClient.get(BASE_URL + params);

    return lessons.data;
}

export const addNewLesson = async (lesson: Lesson): Promise<Lesson> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const addedLesson = await httpClient.post(BASE_URL, lesson);

    return addedLesson.data;
}

export const editLesson = async (lesson: Lesson): Promise<Lesson> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const editedLesson = await httpClient.put(BASE_URL + "/" + lesson.id, lesson); 

    return editedLesson.data;
}
