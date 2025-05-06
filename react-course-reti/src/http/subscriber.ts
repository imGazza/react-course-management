import { Subscriber, SubscriberCourse, SubscriberUser } from "@/model/Subscribers";
import { get, post, put, del } from "./client";

const BASE_URL = "subscribers"

export const getCourseSubscribers = async (courseId: string): Promise<SubscriberUser[]> => {
    return await get(`${BASE_URL}?courseId=${courseId}&_embed=user`);
}

export const addCourseSubscriber = async (subscriber: Subscriber): Promise<Subscriber> => {
    return await post(BASE_URL, subscriber);
}

export const deleteSubscriber = async (id: string): Promise<void> => {
    return await del(`${BASE_URL}/${id}`);
}

export const setGrade = async (subscriber: Subscriber): Promise<Subscriber> => {
    return await put(`${BASE_URL}/${subscriber.id}`, subscriber);
}

export const getSubscribers = async (delay?: number): Promise<Subscriber[]> => {
    return await get(BASE_URL, delay);
}

export const getSubscribersByUser = async (userId: string): Promise<Subscriber[]> => {
    return await get(`${BASE_URL}?userId=${userId}`);
}

export const getSubscribersCourses = async (): Promise<SubscriberCourse[]> => {
    return await get(`${BASE_URL}?_embed=course`);
}

export const getSubscribersCoursesByUser = async (userId: string): Promise<SubscriberCourse[]> => {
    return await get(`${BASE_URL}?userId=${userId}&_embed=course`);
}