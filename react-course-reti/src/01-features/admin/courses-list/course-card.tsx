import { Pencil, SquareArrowOutUpRight, Trash2, Users } from "lucide-react"
import { Badge } from "@/02-components/ui/badge"
import { Button } from "@/02-components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/02-components/ui/card"
import { Course, CourseWithSubscriptions } from "@/05-model/Course"
import { Skeleton } from "@/02-components/ui/skeleton"
import CourseDialog from "@/02-components/ui/dialogs/course-dialog"
import GazzaDialog from "@/02-components/ui/gazza-dialog"
import GazzaConfirmDialog from "@/02-components/ui/gazza-confirm-dialog"
import { Link } from "react-router"
import React, { useEffect } from "react"

const statusColors = {
  "Pianificato": "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  "In corso": "bg-green-100 text-green-800 hover:bg-green-100",
  "Chiuso": "bg-gray-100 text-gray-800 hover:bg-gray-100"
}

interface CourseProps {
  courseWithSubscriptions: CourseWithSubscriptions;
  onEdit?: (data: Course) => void;
  onDelete?: (id: string) => void;
  customFooter?: React.ReactNode;
}

const CourseCard = ({ courseWithSubscriptions, onEdit, onDelete, customFooter }: CourseProps) => {  

  const statusColor = statusColors[courseWithSubscriptions.course.status] || statusColors["Pianificato"];

  const defaultFooter = (
    <>
      <GazzaConfirmDialog dialogTitle="Elimina corso" dialogMessage={`Sei sicuro di voler eliminare ${courseWithSubscriptions.course.name}?`} onConfirm={() => onDelete!(courseWithSubscriptions.course.id)}>
            <Link to={`/courses/detail/${courseWithSubscriptions.course.id}`}>
              <Button variant="outline" size="icon" className="flex items-center">
                <SquareArrowOutUpRight />
              </Button>
            </Link>
        </GazzaConfirmDialog>
        <div className="flex justify-between gap-2">
          <GazzaDialog dialogComponent={(props) => <CourseDialog course={courseWithSubscriptions.course} submit={onEdit!} {...props} />}>
            <Button variant="outline" size="icon" className="flex items-center gap-1">
              <Pencil />
            </Button>
          </GazzaDialog>
          {courseWithSubscriptions.course.status === "Pianificato" ?
            <GazzaConfirmDialog dialogTitle="Elimina corso" dialogMessage={`Sei sicuro di voler eliminare ${courseWithSubscriptions.course.name}?`} onConfirm={() => onDelete!(courseWithSubscriptions.course.id)}>
              <Button variant="outline" size="icon" className="flex items-center hover:border-delete-red-foreground hover:bg-delete-red hover:text-delete-red-foreground">
                <Trash2 />
              </Button>
            </GazzaConfirmDialog> : null
          }
        </div>
    </>    
  )
  
  return (
    <Card className="overflow-hidden w-full max-w-sm pt-0">
      <div className="relative h-48 w-full">
        <img src={courseWithSubscriptions.course.image} alt={courseWithSubscriptions.course.name} className="object-cover w-full h-full"/>
      </div>
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle className="text-xl">{courseWithSubscriptions.course.name}</CardTitle>
          <CardDescription className="mt-1">
            <div className="flex items-center text-sm text-muted-foreground">
              <Users className="mr-1 h-4 w-4" />
              {courseWithSubscriptions.subscriptions.length} {courseWithSubscriptions.subscriptions.length === 1 ? "iscritto" : "iscritti"} • {courseWithSubscriptions.course.year}
            </div>
          </CardDescription>
        </div>
        <Badge className={statusColor}>{courseWithSubscriptions.course.status}</Badge>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2">{courseWithSubscriptions.course.description}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        {customFooter ?? defaultFooter}
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
      <Skeleton className="h-10 w-full" />
    </CardFooter>
  </Card> 
  )
}
export { CourseCardSkeleton }