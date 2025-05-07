import { Plus, Presentation, BookOpenText, Edit, Trash2 } from "lucide-react"
import { Button } from "@/02-components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/02-components/ui/card"
import { useContext, useEffect, useState } from "react"
import { AreLessonsDifferent, FetchInitialData } from "@/02-components/utils/course/course-utils"
import { useParams } from "react-router"
import { Lesson } from "@/05-model/Lesson"
import { addNewLesson, deleteLesson, editLesson, getCourseLessons } from "@/03-http/lesson"
import GazzaDialog from "@/02-components/ui/gazza-dialog"
import LessonDialog from "@/02-components/utils/dialogs/lesson-dialog"
import { Skeleton } from "@/02-components/ui/skeleton"
import { ScrollArea } from "@/02-components/ui/scroll-area"
import { CourseContext } from "@/06-providers/course/course-context"
import useBaseComponent from "@/04-hooks/use-base-component"

const CourseDetailLesson = () => {

	const { courseId } = useParams();
	const { setLessonsNumber } = useContext(CourseContext);
	const { query: {data : lessons = []}, onAdd, onEdit, onDelete, isLoading} = useBaseComponent<Lesson, Lesson, Lesson[]>({
		queryKey: ["lessons", courseId!],
		fetchFunction: () => getCourseLessons(courseId!),
		addFunction: addNewLesson,
		editFunction: editLesson,
		deleteFunction: deleteLesson
	})

	useEffect(() => {
		setLessonsNumber(lessons.length);
	}, [lessons])

	const onAddNewLesson = async (lesson: Lesson) => {
		onAdd(lesson);
	}

	const onEditLesson = async (lesson: Lesson) => {
		if (!AreLessonsDifferent(lessons.find(c => c.id === lesson.id)!, lesson))
			return;

		onEdit(lesson);
	}

	const onDeleteLesson = async (lessonId: string) => {
		onDelete(lessonId);
	}

	if (isLoading)
		return <CourseDetailLessonSkeleton />

	return (
		<Card className="col-span-1 sm:col-span-2 min-h-[405px] flex flex-col">
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<BookOpenText className="h-5 w-5" />
					Lezioni
				</CardTitle>
			</CardHeader>
			<CardContent className="flex-1">
				<ScrollArea className="h-[245px]">
					<div className="space-y-4">
						{
							lessons.length !== 0 ?

								lessons.map((lesson) => (
									<div key={lesson.id} className="flex items-center justify-between p-3 border rounded-md">
										<div className="flex items-center gap-3">
											<Presentation className="h-5 w-5 text-muted-foreground" />
											<div>
												<p className="font-medium">{lesson.name}</p>
												<p className="text-sm text-muted-foreground">
													{
														new Date() <= new Date(lesson.lessonDate) ?
															`La lezione si terrà in data ${new Date(lesson.lessonDate).toLocaleDateString('it-IT')}` :
															`La lezione si è tenuta in data ${new Date(lesson.lessonDate).toLocaleDateString('it-IT')}`
													}
												</p>
											</div>
										</div>
										<div>
											<GazzaDialog dialogComponent={(props) => <LessonDialog submit={onEditLesson} lesson={lesson} courseId={courseId!} {...props} />}>
												<Button variant="ghost" size="icon">
													<Edit />
												</Button>
											</GazzaDialog>
											<Button variant="ghost" size="sm" onClick={() => onDeleteLesson(lesson.id)}>
												<Trash2 />
											</Button>
										</div>
									</div>
								))

								:

								<div className="space-y-4 text-center">
									Non ci sono lezioni per questo corso.
								</div>
						}
					</div>
				</ScrollArea>
			</CardContent>
			<CardFooter>
				<GazzaDialog dialogComponent={(props) => <LessonDialog submit={onAddNewLesson} courseId={courseId!} {...props} />}>
					<Button variant="outline" className="w-full" onClick={() => { }}>
						<Plus className="h-4 w-4 mr-2" />
						Crea una nuova lezione
					</Button>
				</GazzaDialog>
			</CardFooter>
		</Card>
	)
}
export default CourseDetailLesson;

const CourseDetailLessonSkeleton = () => {
	return (
		<Card className="col-span-1 sm:col-span-2 min-h-[405px] flex flex-col">
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Skeleton className="h-5 w-5" />
					<Skeleton className="h-6 w-24" />
				</CardTitle>
			</CardHeader>
			<CardContent className="flex-1">
				<div className="space-y-4">
					{Array.from({ length: 3 }).map((_, index) => (
						<div key={index} className="flex items-center justify-between p-3 border rounded-md">
							<div className="flex items-center gap-3">
								<Skeleton className="h-5 w-5" />
								<div>
									<Skeleton className="h-5 w-48 mb-2" />
									<Skeleton className="h-4 w-36" />
								</div>
							</div>
							<Skeleton className="h-8 w-20" />
						</div>
					))}
				</div>
			</CardContent>
			<CardFooter>
				<Skeleton className="h-8 w-full" />
			</CardFooter>
		</Card>
	)
}
export { CourseDetailLessonSkeleton }