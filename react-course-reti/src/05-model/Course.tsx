import { BaseEntity } from "./BaseEntity";
import { Lesson } from "./Lesson";
import { Material } from "./Material";
import { Subscriber } from "./Subscribers";

export interface Course extends BaseEntity {
    name: string;
    description: string;
    image: string;
    status: "Pianificato" | "In corso" | "Chiuso";
    year: number;
    closeDate: string;
}

export interface CourseEmbedsSubscriptions extends Course  {
    subscribers: Subscriber[];
}

export interface CourseEnrollmentInfoForUser{
    courseWithSubscriptions: CourseWithSubscriptions;
    userSubscription: Subscriber | null;
}

export interface CourseWithSubscriptions{
    course: Course;
    subscriptions: Subscriber[];
}

export interface CourseWithLessonsAndMaterialsByUserId{
    course: Course;
    lessons: Lesson[];
    materials: Material[]; 
}