import { BookOpenText, ChevronsRight, Pencil, Trash2, Users } from "lucide-react";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/02-components/ui/card"
import { AreCoursesDifferent, Course } from "@/05-model/Course";
import { Button } from "@/02-components/ui/button";
import GazzaDialog from "@/02-components/ui/dialogs/gazza-dialog";
import CourseDialog from "@/02-components/ui/dialogs/course-dialog";
import GazzaConfirmDialog from "@/02-components/ui/dialogs/gazza-confirm-dialog";
import { Skeleton } from "@/02-components/ui/skeleton";
import { useEffect, useState } from "react";
import { courseService } from "@/03-http/base/services/course";
import { useNavigate, useParams } from "react-router";
import { Popover, PopoverContent, PopoverTrigger } from "@/02-components/ui/popover";
import { Calendar } from "@/02-components/ui/calendar";
import useBaseComponent from "@/04-hooks/use-base-component";
import { useCourseBasicInfo } from "@/04-hooks/use-course-basic-info";

const CourseDetailCards = () => {

  const { courseId } = useParams();
  const { course, setCourseData, lessonsNumber, subscribersNumber } = useCourseBasicInfo();
  const [nextStatus, setNextStatus] = useState<"Pianificato" | "In corso" | "Chiuso">("Pianificato");
  const [closeDate, setCloseDate] = useState<Date>();

  const {
      query: { data: courseData = null }, 
      onEdit, 
      onDelete, 
      isLoading,
      remove
    } = useBaseComponent<Course>(
    {
      queryKey: ['course', courseId!],
      fetch: () => courseService.get(courseId!),
      edit: courseService.edit,
      del: courseService.deleteCourse,
    }
  )

  useEffect(() => {
    if (!courseData)
      return;
    setCourseData(courseData);
    getNextStatus(courseData);
    setCloseDate(new Date(courseData.closeDate))
  }, [courseData])

  const navigate = useNavigate();

  const getNextStatus = (course: Course) => {
    if (course!.status === "Pianificato")
      setNextStatus("In corso");
    else if (course!.status === "In corso")
      setNextStatus("Chiuso");
  }

  const onEditCourse = async (editedCourse: Course) => {
    if (!AreCoursesDifferent(course!, editedCourse))
      return;

    onEdit(editedCourse);
  }

  const onDeleteCourse = async (id: string) => {
    onDelete(id);

    //Rimuovo la query dei corsi per triggerare lo stato di loading dopo la navigazione sulla lista
    remove(["courses"]);
    navigate("/courses");
  }

  const onAdvanceStatus = async () => {
    const updatedCourse = {
      ...course!,
      status: nextStatus,
      closeDate: nextStatus === "Chiuso"? new Date().toISOString() : course!.closeDate
    };

    onEdit(updatedCourse);
  }

  const onCloseDateChange = async (date: Date | undefined) => {
    if (!date)
      return;

    const updatedCourse = {
      ...course!,
      closeDate: date.toISOString()
    };

    onEdit(updatedCourse);
  }

  if (isLoading || !course || isNaN(lessonsNumber) || isNaN(subscribersNumber))
    return (
      <CourseDetailCardsSkeleton />
    )

  return (
    <>
      <Card className="@container/card p-0 overflow-hidden block">
        <div className="relative h-full">
          <img src={course.image} alt={course.name} className="object-cover w-full h-full" />
        </div>
      </Card>
      <Card className="@container/card gap-8">
        <CardHeader className="relative">
          <div className="absolute right-6 flex gap-2">
            <GazzaDialog dialogComponent={(props) => <CourseDialog course={course} submit={onEditCourse} {...props} />}>
              <Button variant="outline" size="icon" className="flex items-center gap-1">
                <Pencil className="h-4 w-4" />
              </Button>
            </GazzaDialog>
            {course.status === "Pianificato" ?
              <GazzaConfirmDialog dialogTitle="Elimina corso" dialogMessage={`Sei sicuro di voler eliminare ${course.name}?`} onConfirm={() => onDeleteCourse(course.id)}>
                <Button variant="outline" size="icon" className="flex items-center hover:border-delete-red-foreground hover:bg-delete-red hover:text-delete-red-foreground">
                  <Trash2 />
                </Button>
              </GazzaConfirmDialog> : null
            }
          </div>
          <CardDescription>{course.year}</CardDescription>
          <CardTitle className="@[250px]/card:text-4xl/[3rem] text-2xl font-semibold tabular-nums line-clamp-1">
            {course.name}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Descrizione
          </div>
          <div className="text-muted-foreground">
            {course.description}
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card gap-8">
        <CardHeader className="relative">
          <CardDescription className="flex gap-2 items-center">
            <Users className="h-4 w-4" />
            Iscrizioni
          </CardDescription>
          <CardTitle className="@[250px]/card:text-4xl text-2xl font-semibold tabular-nums">
            {subscribersNumber}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium items-center">
            Lezioni <BookOpenText className="size-4" />
          </div>
          <div className="text-muted-foreground">
            {`Questo corso ha ${lessonsNumber} ${lessonsNumber === 1 ? "lezione" : "lezioni"}`}
          </div>
        </CardFooter>
      </Card>
      <Card className={`@container/card gap-8 ${course.status !== "Chiuso" && "justify-between"}`}>
        <CardHeader className="relative">
          <CardDescription>Stato</CardDescription>
          <CardTitle className="@[250px]/card:text-4xl text-2xl font-semibold tabular-nums">
            {course.status}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          {course.status !== "Chiuso" ?
            <Button variant="outline" onClick={onAdvanceStatus} className="flex items-center gap-1 cursor-pointer w-full hover:border-success-green-foreground hover:bg-success-green hover:text-success-green-foreground">
              <ChevronsRight className="mr-2 h-4 w-4" />
              Passa a {nextStatus}
            </Button>
            :
            <>
              <div className="line-clamp-1 flex gap-2 font-medium items-center">
                Chiusura
              </div>
              <div className="text-muted-foreground flex items-center gap-1">
                Chiuso in data
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" className="text-sm underline p-0 cursor-pointer hover:bg-transparent">
                      {new Date(course.closeDate).toLocaleDateString('it-IT')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={closeDate}
                      onSelect={(date) => onCloseDateChange(date)}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </>
          }
        </CardFooter>
      </Card>
    </>
  )
}
export default CourseDetailCards

const CourseDetailCardsSkeleton = () => {
  return (
    <>
      <Card className="@container/card flex flex-col md:flex-row overflow-hidden p-0">
        <Skeleton className="w-full" />
      </Card>

      <Card className="py-6 flex flex-col gap-8">
        <CardHeader className="relative">
          <div className="absolute right-6 flex gap-2">
            <Skeleton className="h-9 w-9 rounded-md" />
            <Skeleton className="h-9 w-9 rounded-md" />
          </div>
          <Skeleton className="h-4 w-20 mb-2" />
          <Skeleton className="h-9 w-3/4" />
        </CardHeader>
        <CardFooter className="flex-col items-start gap-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </CardFooter>
      </Card>

      <Card className="@container/card gap-8">
        <CardHeader>
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-8 w-16" />
        </CardHeader>
        <CardFooter className="flex-col items-start gap-3">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-full" />
        </CardFooter>
      </Card>

      <Card className="@container/card justify-between">
        <CardHeader>
          <Skeleton className="h-4 w-16 mb-2" />
          <Skeleton className="h-8 w-24" />
        </CardHeader>
        <CardFooter>
          <Skeleton className="h-9 w-full" />
        </CardFooter>
      </Card>
    </>
  )
}
export { CourseDetailCardsSkeleton }