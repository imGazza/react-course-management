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

export interface CourseSubscribers extends Course {
    subscribers: Subscriber[];
}

export interface CourseDetails extends Course {
    lessons: Lesson[];
    materials: Material[];
}