import { Course } from "./base/Course";
import { Lesson } from "./base/Lesson";
import { Material } from "./base/Material";

export interface PersonalCoursesInfo{
	course: Course
	lessons: Lesson[];
	materials: Material[];
	progress:  {lessonsCompleted: number, percentageCompleted: number};
	grade: number | null;
}