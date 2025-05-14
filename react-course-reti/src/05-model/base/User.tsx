import { BaseEntity } from "./BaseEntity";
import { Course } from "./Course";
import { Subscription } from "./Subscription";

export interface User extends BaseEntity {
	firstName: string;
	lastName: string;
	avatar: string;
	email: string;
	isAdmin: boolean;
	joinedDate: string;
}

export interface UserEntity extends User {
	subscriptions: Subscription[];
	courses: Course[];
}

export interface UserEmbedsSubscriptions extends User {
	subscriptions: Subscription[];
}

export interface UserState {
	user: User,
	subscriptionsNumber: number,
	isDeletable: boolean
}

export interface UserWithSubscriptions {
	user: User,
	subscriptions: Subscription[]
}

//Utils

export const usersSameItem = (user1: User, user2: User) => {
	return user1.id === user2.id;
}

export const AreUsersDifferent = (user: User, editedUser: User) => {
	return user.id !== editedUser.id || user.firstName !== editedUser.firstName || user.lastName !== editedUser.lastName || user.email !== editedUser.email || user.isAdmin !== editedUser.isAdmin || user.avatar !== editedUser.avatar;
}