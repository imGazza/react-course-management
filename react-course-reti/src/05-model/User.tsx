import { BaseEntity } from "./BaseEntity";
import { Course } from "./Course";
import { Subscriber } from "./Subscribers";

export interface User extends BaseEntity {
	firstName: string;
	lastName: string;
	avatar: string;
	email: string;
	isAdmin: boolean;
	joinedDate: string;
}

export interface UserEntity extends User {
	subscribers: Subscriber[];
	courses: Course[];
}

export interface UserEmbedsSubscriptions extends User {
	subscriptions: Subscriber[];
}

export interface UserState {
	user: User,
	subscriptionsNumber: number,
	isDeletable: boolean
}

export interface UserWithSubscriptions {
	user: User,
	subscriptions: Subscriber[]
}

//Utils

export const AreUsersDifferent = (user: User, editedUser: User) => {
	return user.id !== editedUser.id || user.firstName !== editedUser.firstName || user.lastName !== editedUser.lastName || user.email !== editedUser.email || user.isAdmin !== editedUser.isAdmin || user.avatar !== editedUser.avatar;
}