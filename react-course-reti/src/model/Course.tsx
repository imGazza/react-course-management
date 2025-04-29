import { Subscriber } from "./Subscribers";

export interface Course {
    id: string;
    name: string;
    description: string;
    image: string;
    status: "Pianificato" | "In corso" | "Chiuso";
    year: number;
    closeDate: string;
}

export interface CourseEntity extends Course {
    subscribers: Subscriber[];
}