import { Subscriber, SubscriberCourse, SubscriberUser } from "@/model/Subscribers";
import { httpClient, fakeDelay } from "./client";

const BASE_URL = "subscribers"

export const getCourseSubscribers = async (courseId: string): Promise<SubscriberUser[]> => {
    await new Promise(resolve => setTimeout(resolve, 750));
    const params = "?courseId=" + courseId + "&_embed=user";

    const subscribers = await httpClient.get(BASE_URL + params);
    return subscribers.data;
}

export const addCourseSubscriber = async (subscriber: Subscriber): Promise<Subscriber> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const addedSubscriber = await httpClient.post(BASE_URL, subscriber);
    return addedSubscriber.data;
}

export const deleteSubscriber = async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    await httpClient.delete(BASE_URL + "/" + id);
}

export const setGrade = async (subscriber: Subscriber): Promise<Subscriber> => {
    const updatedSubscriber = await httpClient.put(BASE_URL + "/" + subscriber.id, subscriber);
    
    return updatedSubscriber.data;
}

export const getSubscribers = async (delay?: number): Promise<Subscriber[]> => {
    await new Promise(resolve => setTimeout(resolve, delay ?? 500));
    const subscribers = await httpClient.get(BASE_URL); 

    return subscribers.data;
}

export const getSubscribersByUser = async (userId: string): Promise<Subscriber[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const params = "?userId=" + userId;
    const subscribers = await httpClient.get(BASE_URL + params);
    
    return subscribers.data;
}

export const getSubscribersCourses = async (): Promise<SubscriberCourse[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const params = "?_embed=course";
    const subscribers = await httpClient.get(BASE_URL + params);

    return subscribers.data;
}

export const getSubscribersCoursesByUser = async (userId: string): Promise<SubscriberCourse[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const params = "?userId=" + userId + "&_embed=course";
    const subscribers = await httpClient.get(BASE_URL + params);

    return subscribers.data;
}