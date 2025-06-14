import { BaseEntity } from "./BaseEntity";
import { Course } from "./Course";
import { User } from "./User";

export interface Subscription extends BaseEntity {
  userId: string;
  courseId: string;
  subscriptionDate: string;
  grade: number | null;
}

export interface SubscriptionsEmbedsUser extends Subscription{
  user: User;
}

export interface SubscriptionsEmbedsCourse extends Subscription{
  course: Course;
}

export interface SubscriptionsEmbedsCourseAndUser extends SubscriptionsEmbedsUser, SubscriptionsEmbedsCourse{
}

export interface SubscriptionsWithUser {
  user: User;
  subscription: Subscription;
}

export interface SubscriptionsWithCourse {
  subscription: Subscription;
  course: Course;  
}