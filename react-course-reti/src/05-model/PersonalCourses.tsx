import { Course } from "./Course";
import { Lesson } from "./Lesson";
import { Material } from "./Material";

export interface PersonalCoursesInfo{
	course: Course
	lessons: Lesson[];
	materials: Material[];
	progress:  {lessonsCompleted: number, percentageCompleted: number};
	grade: number | null;
}