import { CourseWithSubscriptions } from "@/05-model/base/Course";
import { courseSubscriptionService } from "./embeds/course-subscription-service";
import { courseService } from "../base/services/course";
import { ExpandedService } from "./expanded-service";

class CourseSectionService extends ExpandedService<CourseWithSubscriptions>{

	sameItem(item1: CourseWithSubscriptions, item2: CourseWithSubscriptions): boolean {
		return item1.course.id === item2.course.id;
	}

	async getCoursesSection(): Promise<CourseWithSubscriptions[]> {
		return await courseSubscriptionService.getCourseWithSubscriptions();
	}

	async addCourseSection(newCourse: CourseWithSubscriptions): Promise<CourseWithSubscriptions> {
		newCourse.course = await courseService.add(newCourse.course);
		return newCourse
	}

	async editCoursesSection(editedCourse: CourseWithSubscriptions): Promise<CourseWithSubscriptions> {
		editedCourse.course = await courseService.edit(editedCourse.course);
	  return editedCourse;
	}

	async deleteCourseSection(deletedCourse: CourseWithSubscriptions): Promise<void> {
		await courseService.deleteCourseDependentSubscriptions(deletedCourse.course);
	}
}
export const courseSectionService = new CourseSectionService();