import { Subscription, SubscriptionsEmbedsCourse, SubscriptionsEmbedsUser } from "@/05-model/base/Subscription";
import { BaseService } from "../base-service";
import client from "../client";

class SubscriptionService extends BaseService<Subscription> {
    constructor() {
        super("subscriptions");
    }
    
    getSubscriptionsByUserId = async (userId: string): Promise<Subscription[]> => {
        return client.get<Subscription[]>(`${this.baseUrl}?userId=${userId}`);
    }

    getSubscriptionsEmbedsCourse = async (delay?: number): Promise<SubscriptionsEmbedsCourse[]> => {
        return client.get<SubscriptionsEmbedsCourse[]>(`${this.baseUrl}?_embed=course`, delay); 
    }

    getSubscriptionsEmbedsUserByCourseId = async (id: string): Promise<SubscriptionsEmbedsUser[]> => {
        return client.get<SubscriptionsEmbedsUser[]>(`${this.baseUrl}?courseId=${id}&_embed=user`);
    }

    getSubscriptionsEmbedsCourseByUserId = async (userId: string): Promise<SubscriptionsEmbedsCourse[]> => {
        return client.get<SubscriptionsEmbedsCourse[]>(`${this.baseUrl}?userId=${userId}&_embed=course`); 
    }

    deleteSubscription = async (subscription: Subscription): Promise<void> => {
        await client.delete<Subscription>(`${this.baseUrl}/${subscription.id}`);
    }
}
export const subscriptionService = new SubscriptionService();