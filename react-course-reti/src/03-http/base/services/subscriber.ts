import { Subscriber, SubscriptionsEmbedsCourse, SubscriptionsEmbedsCourseAndUser, SubscriptionsEmbedsUser, SubscriptionsWithUser } from "@/05-model/Subscribers";
import { BaseService } from "../base-service";
import client from "../client";

class SubscriberService extends BaseService<Subscriber> {
    constructor() {
        super("subscribers");
    }
    
    async getSubscriptionsByUserId(userId: string): Promise<Subscriber[]> {
        return client.get<Subscriber[]>(`${this.baseUrl}?userId=${userId}`);
    }

    async getSubscriptionsWithCourse(delay?: number): Promise<SubscriptionsEmbedsCourse[]> {
        return client.get<SubscriptionsEmbedsCourse[]>(`${this.baseUrl}?_embed=course`, delay); 
    }

    async getSubscribersWithCourseByUserId(userId: string): Promise<SubscriptionsEmbedsCourse[]> {
        return client.get<SubscriptionsEmbedsCourse[]>(`${this.baseUrl}?userId=${userId}&_embed=course`); 
    }

    async getSubscribersWithCourseAndUser(): Promise<SubscriptionsEmbedsCourseAndUser[]> {
        return client.get<SubscriptionsEmbedsCourseAndUser[]>(`${this.baseUrl}?_embed=course&_embed=user`);
    }    

    async getSubscriptionsEmbedsUserByCourseId(id: string): Promise<SubscriptionsEmbedsUser[]> {
        return client.get<SubscriptionsEmbedsUser[]>(`${this.baseUrl}?courseId=${id}&_embed=user`);
    }
}

export const subscriberService = new SubscriberService();