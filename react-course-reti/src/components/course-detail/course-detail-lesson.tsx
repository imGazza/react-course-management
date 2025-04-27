import { Plus, Presentation, BookOpenText } from "lucide-react"
import { Button } from "../ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../ui/card"
import { useEffect, useState } from "react"
import { AreLessonsDifferent, FetchInitialData } from "../utils/course/course-utils"
import { useParams } from "react-router"
import { Lesson } from "@/model/Lesson"
import { addNewLesson, editLesson, getCourseLessons } from "@/http/lesson"
import GazzaDialog from "../utils/gazza-dialog"
import LessonDialog from "../utils/dialogs/lesson-dialog"
import { Skeleton } from "../ui/skeleton"
import { ScrollArea } from "../ui/scroll-area"

const CourseDetailLesson = () => {

    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [loading, setLoading] = useState(true);
    const { courseId } = useParams();

    useEffect(() => {
        const fetchLessons = async () => {
            await FetchInitialData<Lesson[], string>(setLoading, setLessons, getCourseLessons, courseId!);
        }
        fetchLessons();
    }, [])

    const onAddNewLesson = async (lesson: Lesson) => {
        try {
            setLoading(true);
            const addedLesson = await addNewLesson(lesson);
            setLessons([...lessons, addedLesson]);
        } catch (e) {
            //TODO: Toast
        }
        finally {
            setLoading(false);
        }
    }

    const onEditLesson = async (lesson: Lesson) => {
        if (!AreLessonsDifferent(lessons.find(c => c.id === lesson.id)!, lesson))
            return;

        try {
            setLoading(true);
            const editedLesson = await editLesson(lesson);
            setLessons(lessons.map(c => c.id === lesson.id ? editedLesson : c));
        } catch (e) {
        }
        finally {
            setLoading(false);
        }
    }

    if (loading)
        return <CourseDetailLessonSkeleton />

    return (
        <Card className="col-span-1 lg:col-span-2 min-h-[405px] flex flex-col">
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
                                    <GazzaDialog dialogComponent={(props) => <LessonDialog submit={onEditLesson} lesson={lesson} courseId={courseId!} {...props} />}>
                                        <Button variant="ghost" size="sm">
                                            Modifica
                                        </Button>
                                    </GazzaDialog>
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
        <Card className="col-span-1 lg:col-span-2 min-h-[405px] flex flex-col">
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