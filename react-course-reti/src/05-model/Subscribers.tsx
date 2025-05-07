import { BaseEntity } from "./BaseEntity";
import { Course } from "./Course";
import { User } from "./User";

export interface Subscriber extends BaseEntity {
  userId: string;
  courseId: string;
  subscriptionDate: string;
  grade: number | null;
}

export interface SubscriberCourse extends Subscriber{
  course: Course;
}

export interface SubscriberUser extends Subscriber{
  user: User;
}