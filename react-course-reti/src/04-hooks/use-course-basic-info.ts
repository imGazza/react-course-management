import { CourseBasicInfoContext } from "@/06-providers/course/course-basic-info-context"
import { useContext } from "react"

export const useCourseBasicInfo = () => {
	const context = useContext(CourseBasicInfoContext)

	if (context === undefined)
		throw new Error("useTheme deve essere usato all'interno di un ThemeProvider")

	return context
}