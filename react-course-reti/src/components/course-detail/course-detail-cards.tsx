import { BookOpenText, ChevronsRight, Pencil, Trash2, Users } from "lucide-react";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Course } from "@/model/Course";
import { Button } from "../ui/button";
import GazzaDialog from "../ui/gazza-dialog";
import CourseDialog from "../utils/dialogs/course-dialog";
import GazzaConfirmDialog from "../ui/gazza-confirm-dialog";
import { Skeleton } from "../ui/skeleton";
import { useContext, useEffect, useState } from "react";
import { deleteCourse, editCourse, getCourse } from "@/http/course";
import { useNavigate, useParams } from "react-router";
import { AreCoursesDifferent, FetchInitialData } from "../utils/course/course-utils";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { CourseContext } from "@/providers/course/course-context";

const CourseDetailCards = () => {

  const { courseId } = useParams();
  const [loading, setLoading] = useState<boolean>(true);
  const { course, setCourseData, lessonsNumber, subscribersNumber } = useContext(CourseContext);
  const [nextStatus, setNextStatus] = useState<"Pianificato" | "In corso" | "Chiuso">("Pianificato");
  const [closeDate, setCloseDate] = useState<Date>();

  useEffect(() => {
    setLoading(true);
    async function fetchCourse() {
      try{
        const courseEntity = await getCourse(courseId!);
        getNextStatus(courseEntity);
        setCloseDate(new Date(courseEntity.closeDate));
        setCourseData(courseEntity);
      } catch (e) {
        // TODO: Toast 
      } finally {
        setLoading(false);
      }
    }
    fetchCourse();
  }, [])

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

    try {
      setLoading(true);
      const course = await editCourse(editedCourse);
      setCourseData(course);
    } catch (e) {

    }
    finally {
      setLoading(false);
    }
  }

  const onDeleteCourse = async (id: string) => {
    try {
      setLoading(true);
      await deleteCourse(id);
      navigate("/courses");
    } catch (e) {
      // Toast
    } finally {
      setLoading(false);
    }
  }

  const onAdvanceStatus = async () => {
    try {
      setLoading(true);
      const updatedCourse = {
        ...course!, 
        status: nextStatus, 
        closeDate: nextStatus === "Chiuso" ? new Date().toISOString() : course!.closeDate 
      };
      
      const editedCourse = await editCourse(updatedCourse!);
      setCourseData(editedCourse);
      getNextStatus(editedCourse);
    } catch (e) {
      // TODO: Toast
    } finally {
      setLoading(false);
    }
  }

  const onCloseDateChange = async (date: Date | undefined) => {
    if (!date)
      return;

    try {
      setLoading(true);
      const updatedCourse = { ...course!, closeDate: date.toISOString() };
      const editedCourse = await editCourse(updatedCourse);
      setCourseData(editedCourse);
      setCloseDate(date);
    } catch (e) {
      // Handle error
    } finally {
      setLoading(false);
    }
  }

  if (loading || !course || !lessonsNumber || !subscribersNumber)
    return (
      <CourseDetailCardsSkeleton />
    )

  return (
    <>
      <Card className="@container/card p-0 overflow-hidden">
        <div className="relative h-48 md:h-auto">
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
          <CardTitle className="@[250px]/card:text-4xl text-2xl font-semibold tabular-nums line-clamp-1">
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
        <Skeleton className="w-full h-[215px]" />
      </Card>

      <Card className="py-6 flex flex-col gap-8">
        <CardHeader className="relative">
          <div className="absolute right-6 flex gap-2">
            <Skeleton className="h-9 w-9 rounded-md" />
            <Skeleton className="h-9 w-9 rounded-md" />
          </div>
          <Skeleton className="h-4 w-20 mb-2" />
          <Skeleton className="h-8 w-3/4" />
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
          <Skeleton className="h-10 w-full" />
        </CardFooter>
      </Card>
    </>
  )
}