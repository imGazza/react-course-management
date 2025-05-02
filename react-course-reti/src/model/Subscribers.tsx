import { Course } from "./Course";
import { User } from "./User";

export interface Subscriber {
  id: string,
  userId: string;
  courseId: string;
  subscriptionDate: string;
  grade: number | null;
}

export interface SubscriberEntity extends Subscriber{
  user: User;
  course?: Course;
}