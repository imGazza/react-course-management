import { Subscriber, SubscriberEntity } from "@/model/Subscribers";
import { httpClient } from "./client";

const BASE_URL = "subscribers"

export const getCourseSubscribers = async (courseId: string): Promise<SubscriberEntity[]> => {
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

export const getSubscribersCourseAndUser = async (userId: string): Promise<SubscriberEntity[]> => {
    const params = "?userId=" + userId + "&_embed=user";
    const subscribers = await httpClient.get(BASE_URL + params);
    return subscribers.data;
}