import { Edit, Pencil, SquareArrowOutUpRight, Trash2, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Course, CourseEntity } from "@/model/Course"
import { Skeleton } from "../ui/skeleton"
import CourseDialog from "@/components/utils/dialogs/course-dialog"
import GazzaDialog from "../utils/gazza-dialog"
import GazzaConfirmDialog from "../utils/gazza-confirm-dialog"
import { Link } from "react-router"

const statusColors = {
  "Pianificato": "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  "In corso": "bg-green-100 text-green-800 hover:bg-green-100",
  "Chiuso": "bg-gray-100 text-gray-800 hover:bg-gray-100"
}

interface CourseProps {
  course: CourseEntity;
  onEdit: (data: Course) => void;
  onDelete: (id: string) => void;
}

const CourseCard = ({ course, onEdit, onDelete }: CourseProps) => {  

  const statusColor = statusColors[course.status] || statusColors["Pianificato"];  
  
  return (
    <Card className="overflow-hidden w-full max-w-sm pt-0">
      <div className="relative h-48 w-full">
        <img src={course.image} alt={course.name} className="object-cover w-full h-full"/>
      </div>
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle className="text-xl">{course.name}</CardTitle>
          <CardDescription className="mt-1">
            <div className="flex items-center text-sm text-muted-foreground">
              <Users className="mr-1 h-4 w-4" />
              {course.subscribers.length} {course.subscribers.length === 1 ? "iscritto" : "iscritti"} • {course.year}
            </div>
          </CardDescription>
        </div>
        <Badge className={statusColor}>{course.status}</Badge>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <GazzaConfirmDialog dialogTitle="Elimina corso" dialogMessage={`Sei sicuro di voler eliminare ${course.name}?`} onConfirm={() => onDelete(course.id)}>
            <Link to={`/courses/detail/${course.id}`} replace={true}>
              <Button variant="outline" size="icon" className="flex items-center">
                <SquareArrowOutUpRight />
              </Button>
            </Link>
        </GazzaConfirmDialog>
        <div className="flex justify-between gap-2">
          <GazzaDialog dialogComponent={(props) => <CourseDialog course={course} submit={onEdit} {...props} />}>
            <Button variant="outline" size="icon" className="flex items-center gap-1">
              <Pencil />
            </Button>
          </GazzaDialog>
          {course.status === "Pianificato" ?
            <GazzaConfirmDialog dialogTitle="Elimina corso" dialogMessage={`Sei sicuro di voler eliminare ${course.name}?`} onConfirm={() => onDelete(course.id)}>
              <Button variant="outline" size="icon" className="flex items-center hover:border-delete-red-foreground hover:bg-delete-red hover:text-delete-red-foreground">
                <Trash2 />
              </Button>
            </GazzaConfirmDialog> : null
          }
        </div>
      </CardFooter>
    </Card>
  )
}
export default CourseCard

const CourseCardSkeleton = () => {
  return (
    <Card className="overflow-hidden w-full max-w-sm pt-0">
    <div className="relative h-48 w-full">
      <Skeleton className="h-full w-full" />
    </div>
    <CardHeader className="flex flex-row items-start justify-between">
      <div>
        <Skeleton className="h-6 w-[150px] mb-2" />
        <Skeleton className="h-4 w-[100px]" />
      </div>
      <Skeleton className="h-6 w-[80px]" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full mt-2" />
    </CardContent>
    <CardFooter className="flex justify-end">
      <Skeleton className="h-8 w-8" />
    </CardFooter>
  </Card> 
  )
}
export { CourseCardSkeleton }