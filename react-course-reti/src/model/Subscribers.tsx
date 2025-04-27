import { User } from "./User";

export interface Subscriber {
  id: string,
  userId: string;
  courseId: string;
  subscriptionDate: string;
}

export interface SubscriberEntity extends Subscriber{
  user: User;
}