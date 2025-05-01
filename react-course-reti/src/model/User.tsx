import { Course } from "./Course";
import { Subscriber } from "./Subscribers";

export interface User{
    id: string;
    firstName: string;
    lastName: string;
    avatar: string;
    email: string;
    isAdmin: boolean;
    joinedDate: string;
}

export interface UserEntity extends User{
    subscribers: Subscriber[];
    courses: Course[];
}