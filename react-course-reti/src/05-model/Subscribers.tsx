import { BaseEntity } from "./BaseEntity";
import { Course } from "./Course";
import { User } from "./User";

export interface Subscriber extends BaseEntity {
  userId: string;
  courseId: string;
  subscriptionDate: string;
  grade: number | null;
}

export interface SubscriptionsEmbedsUser extends Subscriber{
  user: User;
}

export interface SubscriptionsEmbedsCourse extends Subscriber{
  course: Course;
}

export interface SubscriptionsEmbedsCourseAndUser extends SubscriptionsEmbedsUser, SubscriptionsEmbedsCourse{
}

export interface SubscriptionsWithUser {
  user: User;
  subscription: Subscriber;
}