import { BaseEntity } from "./BaseEntity";

export interface Lesson extends BaseEntity {
	name: string;
	courseId: string;
	lessonDate: string;
}

// Utils

export const AreLessonsDifferent = (lesson: Lesson, editedLesson: Lesson) => {
	return lesson.name !== editedLesson.name || lesson.lessonDate !== editedLesson.lessonDate;
}