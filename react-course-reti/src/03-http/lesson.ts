import { Lesson } from "@/05-model/Lesson";
import { get, post, put, del } from "./client";

const BASE_URL = "lessons"

export const getCourseLessons = async (courseId: string): Promise<Lesson[]> => {
    return await get(`${BASE_URL}?courseId=${courseId}`);
}

export const addNewLesson = async (lesson: Lesson): Promise<Lesson> => {
    return await post(BASE_URL, lesson);
}

export const editLesson = async (lesson: Lesson): Promise<Lesson> => {
    return await put(`${BASE_URL}/${lesson.id}`, lesson);
}

export const deleteLesson = async (lessonId: string): Promise<void> => {
    return await del(`${BASE_URL}/${lessonId}`);
}

export const getLessons = async (): Promise<Lesson[]> => {
    return await get(BASE_URL);
}
