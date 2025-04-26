import { User } from "./User";

export interface Subscriber {
    id: string,
    userId: string;
    courseId: string;
    subscriptionDate: string;
    user: User;
  }