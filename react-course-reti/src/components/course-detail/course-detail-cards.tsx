import { ChevronUp, ChevronUpCircle, TrendingDownIcon, TrendingUpIcon, Users } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Course } from "@/model/Course";
import { useEffect, useState } from "react";
import { getCourse } from "@/http/course";
import { useParams } from "react-router";
import { Button } from "../ui/button";

interface CourseProps {
  course: Course;
}

const CourseDetailCards = ({ course }: CourseProps) => {
  return (
    <div className="grid grid-cols-1 @xl/main:grid-cols-4 gap-4 px-4 *:data-[slot=card]:shadow-xs *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card lg:px-6">
      <Card className="@container/card @xl/main:col-span-2 flex flex-col md:flex-row overflow-hidden p-0">
        <div className="relative md:w-1/2 h-48 md:h-auto">
          <img
            src={course.image}
            alt="Statistics visualization"
            className="object-cover"
          />
        </div>
        <div className="md:w-1/2 py-6 flex flex-col gap-8">
          <CardHeader className="relative">
            <CardDescription>{course.year}</CardDescription>
            <CardTitle className="@[250px]/card:text-4xl text-2xl font-semibold tabular-nums">
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
        </div>
      </Card>
      <Card className="@container/card gap-8">
        <CardHeader className="relative">
          <CardDescription className="flex gap-2 items-center">
            <Users className="h-4 w-4" />
            Iscrizioni
          </CardDescription>
          <CardTitle className="@[250px]/card:text-4xl text-2xl font-semibold tabular-nums">
            {course.subscribers}
          </CardTitle>          
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Down 20% this period <TrendingDownIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Acquisition needs attention
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card justify-between">
        <CardHeader className="relative">
          <CardDescription>Stato</CardDescription>
          <CardTitle className="@[250px]/card:text-4xl text-2xl font-semibold tabular-nums">
            {course.status}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <Button variant="outline" className="flex items-center gap-1 cursor-pointer w-full">
            <ChevronUp className="mr-4 h-4 w-4" />       
            Passa a In corso
          </Button>
        </CardFooter>
      </Card>
    </div>
  )

}
export default CourseDetailCards
