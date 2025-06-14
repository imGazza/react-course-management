import { Plus, Presentation, BookOpenText, Edit, Trash2 } from "lucide-react"
import { Button } from "@/02-components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/02-components/ui/card"
import { useEffect } from "react"
import { useParams } from "react-router"
import { AreLessonsDifferent, Lesson } from "@/05-model/base/Lesson"
import GazzaDialog from "@/02-components/ui/dialogs/gazza-dialog"
import LessonDialog from "@/02-components/ui/dialogs/lesson-dialog"
import { Skeleton } from "@/02-components/ui/skeleton"
import { ScrollArea } from "@/02-components/ui/scroll-area"
import useBaseComponent from "@/04-hooks/use-base-component"
import { lessonService } from "@/03-http/base/services/lesson"
import { createSkeletonArray, skeletonUniqueId } from "@/02-components/utils/misc"
import { useCourseBasicInfo } from "@/04-hooks/use-course-basic-info"
import { cn } from "@/98-lib/utils"

const CourseDetailLesson = () => {

	const { courseId } = useParams();
	const { setLessonsNumber } = useCourseBasicInfo();
	const { query: { data: lessons = [] }, onAdd, onEdit, onDelete, isLoading } = useBaseComponent<Lesson, Lesson[]>({
		queryKey: ["lessons", courseId!],
		fetch: () => lessonService.getLessonsByCourseId(courseId!),
		add: lessonService.add,
		edit: lessonService.edit,
		del: lessonService.deleteLesson,
		equals: (l1, l2) => l1.id === l2.id
	})

	useEffect(() => {
		// Context Usato per visualizzare il numero di lezioni nelle card a top pagina
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

	const onDeleteLesson = async (lesson: Lesson) => {
		onDelete(lesson);
	}

	const sortedLessons = lessons.sort((a, b) => new Date(a.lessonDate).getTime() - new Date(b.lessonDate).getTime());

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

								sortedLessons.map((lesson) => (
									<div key={lesson.id} className={cn(
										"flex items-center justify-between p-3 rounded-md relative border backdrop-blur-[2px] hover:backdrop-blur-[4px] transition-all",
										new Date() <= new Date(lesson.lessonDate)
											? "bg-gradient-to-r from-orange-50/30 to-transparent border-orange-100/50 before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-orange-400/50 before:rounded-l-md dark:from-orange-950/30 dark:border-orange-900/50"
											: "bg-gradient-to-r from-sky-50/30 to-transparent border-sky-100/50 before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-sky-400/50 before:rounded-l-md dark:from-sky-950/30 dark:border-sky-900/50"
									)}>
										<div className="flex items-center gap-3 relative z-10">
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
											<Button variant="ghost" size="sm" onClick={() => onDeleteLesson(lesson)}>
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
					{createSkeletonArray(3).map(() => (
						<div key={skeletonUniqueId()} className="flex items-center justify-between p-3 border rounded-md">
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