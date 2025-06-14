import { BaseEntity } from "./BaseEntity";
import { Lesson } from "./Lesson";
import { Material } from "./Material";
import { Subscription } from "./Subscription";

export interface Course extends BaseEntity {
	name: string;
	description: string;
	image: string;
	status: "Pianificato" | "In corso" | "Chiuso";
	year: number;
	closeDate: string;
}

export interface CourseEmbedsSubscriptions extends Course {
	subscriptions: Subscription[];
}

export interface CourseEmbedsLessonsAndMaterials extends Course {
	lessons: Lesson[];
	materials: Material[];
}

export interface CourseEnrollmentInfoForUser {
	courseWithSubscriptions: CourseWithSubscriptions;
	userSubscription: Subscription | null;
}

export interface CourseWithSubscriptions {
	course: Course;
	subscriptions: Subscription[];
}

export interface CourseWithLessonsAndMaterials {
	course: Course;
	lessons: Lesson[];
	materials: Material[];
}

// Utils

export const AreCoursesDifferent = (course: Course, editedCourse: Course) => {
	return course.id !== editedCourse.id || course.name !== editedCourse.name || course.description !== editedCourse.description || course.year !== editedCourse.year || course.status !== editedCourse.status || course.closeDate !== editedCourse.closeDate;
}