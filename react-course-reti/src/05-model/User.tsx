import { BaseEntity } from "./BaseEntity";
import { Course } from "./Course";
import { Subscriber } from "./Subscribers";

export interface User extends BaseEntity{
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