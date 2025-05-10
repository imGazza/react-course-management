import { Subscriber, SubscribersWithCourse, SubscribersWithCourseAndUser } from "@/05-model/Subscribers";
import { BaseService } from "../base-service";
import { get } from "../client";

class SubscriberService extends BaseService<Subscriber> {
    constructor() {
        super("subscribers");
    }
    
    getSubscriptionsByUserId(userId: string): Promise<Subscriber[]> {
        return get<Subscriber[]>(`${this.baseUrl}?userId=${userId}`);
    }

    getSubscribersWithCourse(): Promise<SubscribersWithCourse[]> {
        return get<SubscribersWithCourse[]>(`${this.baseUrl}?_embed=course`); 
    }

    getSubscribersWithCourseAndUser(): Promise<SubscribersWithCourseAndUser[]> {
        return get<SubscribersWithCourseAndUser[]>(`${this.baseUrl}?_embed=course&_embed=user`);
    }
}

export const subscriberService = new SubscriberService();