import { useContext } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/02-components/ui/card"
import { AuthContext } from "@/06-providers/auth/auth-context";
import { BookOpen, ExternalLink, FileText, GraduationCap, Star } from "lucide-react";
import { Badge } from "@/02-components/ui/badge";
import { Material } from "@/05-model/Material";
import { Lesson } from "@/05-model/Lesson";
import { Course } from "@/05-model/Course";
import { Progress } from "@/02-components/ui/progress";
import { Separator } from "@/02-components/ui/separator";
import { Button } from "@/02-components/ui/button";
import GazzaDialog from "@/02-components/ui/gazza-dialog";
import MaterialsDialog from "@/02-components/ui/dialogs/materials-dialog";
import LessonsDialog from "@/02-components/ui/dialogs/lessons-dialog";
import { Skeleton } from "@/02-components/ui/skeleton";
import useBreadcrumbs from "@/04-hooks/use-breadcrums";
import { PersonalCoursesInfo } from "@/05-model/PersonalCourses";
import useBaseComponentCustom from "@/04-hooks/use-base-component-custom";
import { personalCoursesService } from "@/03-http/personal-courses-service";
import { createSkeletonArray, skeletonUniqueId } from "@/02-components/utils/misc";

const PersonalCoursesList = () => {

	useBreadcrumbs([{ label: "I miei corsi", url: "#"}]);	
	const { user } = useContext(AuthContext);
	const { query: { data: personalCourses = [] }, isLoading } = useBaseComponentCustom<Course, PersonalCoursesInfo, 'course', PersonalCoursesInfo[]>({
		queryKey: ['personalCourses'],
		fetch: () => personalCoursesService.getPersonalCoursesWithInfo(user!.id),
		entityKey: 'course',
	})

	if (isLoading)
		return <PersonalCoursesListSkeleton />

	return (
		<div className="px-6">
			<Card>
				<CardHeader>
					<CardTitle>I Miei Corsi</CardTitle>
					<CardDescription>Visualizza i corsi a cui sei iscritto e il tuo progresso</CardDescription>
				</CardHeader>
				<CardContent>
					{personalCourses.length === 0 ?
						<div className="flex flex-col items-center justify-center py-8 space-y-4">
						<BookOpen className="h-12 w-12 text-muted-foreground" />
						<div className="text-xl font-medium text-muted-foreground text-center">
								Non hai iscrizioni a nessun corso
						</div>
				</div>
						:
						<div className="space-y-6">
							{personalCourses.map((personalCourse, index) => (
								<div key={personalCourse.course.id} className="space-y-4">
									<div className="flex flex-col md:flex-row gap-6">
										<div className="relative w-full md:w-1/4 h-48 rounded-lg overflow-hidden">
											<img
												src={personalCourse.course.image}
												alt={personalCourse.course.name}
												className="object-cover w-full h-full"
											/>
										</div>

										<div className="flex-1 space-y-4">
											<div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
												<div className="flex items-center gap-2">
													<BookOpen className="h-5 w-5 text-muted-foreground" />
													<h3 className="text-lg font-semibold">{personalCourse.course.name}</h3>
												</div>
												<div className="flex gap-2">
													{personalCourse.course.status && (
														<Badge variant="outline">{personalCourse.course.status}</Badge>
													)}
													<Badge variant="secondary">{personalCourse.progress.percentageCompleted}% Completato</Badge>
												</div>
											</div>

											<Progress value={personalCourse.progress.percentageCompleted} className="h-2" />

											<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
												<GazzaDialog dialogComponent={(props) => <LessonsDialog {...props} lessons={personalCourse.lessons} courseName={personalCourse.course.name} />}>
													<Button variant="ghost" className="flex items-center gap-2 justify-start cursor-pointer">
														<GraduationCap className="h-5 w-5 text-muted-foreground" />
														<span className="text-sm">
															{personalCourse.progress.lessonsCompleted} di {personalCourse.lessons.length} lezioni completate
														</span>
														<ExternalLink />
													</Button>
												</GazzaDialog>
												<GazzaDialog dialogComponent={(props) => <MaterialsDialog {...props} materials={personalCourse.materials} courseName={personalCourse.course.name} />}>
													<Button variant="ghost" className="flex items-center gap-2 justify-start cursor-pointer">
														<FileText className="h-5 w-5 text-muted-foreground" />
														<span className="text-sm">{personalCourse.materials.length} materiali disponibili</span>
														<ExternalLink />
													</Button>
												</GazzaDialog>
												{personalCourse.grade !== null &&
													<div className="flex items-center gap-2 py-2 px-3">
														<Star className="h-5 w-5 text-muted-foreground" />
														<span className="text-sm">{personalCourse.grade}/30 punti</span>
													</div>
												}
											</div>

											<div className="text-muted-foreground text-clamp-2 mt-8 text-sm">
												{personalCourse.course.description}
											</div>
										</div>
									</div>
									{index !== personalCourses.length - 1 &&
										<Separator />
									}
								</div>
							))}
						</div>
					}
				</CardContent>
			</Card>
		</div >
	)
}
export default PersonalCoursesList

const PersonalCoursesListSkeleton = () => {
	return (
		<div className="px-6">
			<Card>
				<CardHeader>
					<CardTitle>I Miei Corsi</CardTitle>
					<CardDescription>Visualizza i corsi a cui sei iscritto e il tuo progresso</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-6">
						{createSkeletonArray(3).map((_, index) => (
							<div key={skeletonUniqueId()} className="space-y-4">
								<div className="flex flex-col md:flex-row gap-6">
									<div className="relative w-full md:w-1/4 h-48 rounded-lg overflow-hidden">
										<Skeleton className="w-full h-full" />
									</div>

									<div className="flex-1 space-y-4">
										<div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
											<div className="flex items-center gap-2">
												<Skeleton className="h-5 w-5" />
												<Skeleton className="h-7 w-48" />
											</div>
											<Skeleton className="h-6 w-32" />
										</div>

										<Skeleton className="h-2 w-full" />

										<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
											<Skeleton className="h-9 w-full" />
											<Skeleton className="h-9 w-full" />
											<Skeleton className="h-9 w-full" />
										</div>

										<div className="mt-8 flex flex-col gap-1">
											<Skeleton className="h-4 w-full" />
											<Skeleton className="h-4 w-full" />
										</div>
									</div>
								</div>
								{index !== 2 && <Separator />}
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
export { PersonalCoursesListSkeleton }