import { GraduationCap, BookOpen } from "lucide-react"
import CourseCard, { CourseCardSkeleton } from "../courses-list/course-card"
import { Card } from "../ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Badge } from "../ui/badge"
import { useEffect, useState } from "react"
import { getCourses } from "@/http/course"
import { addCourseSubscriber, deleteSubscriber, getSubscribersCourseAndUser } from "@/http/subscriber"
import { useParams } from "react-router"
import { CourseEntity } from "@/model/Course"
import { Subscriber } from "@/model/Subscribers"
import { Button } from "../ui/button"
import { GenerateId } from "../utils/misc"
import { Skeleton } from "../ui/skeleton"

const UserInfoCourses = () => {

    const { userId } = useParams();
    const [loading, setLoading] = useState(false);
    const [subscriptions, setSubscriptions] = useState<Subscriber[]>([]);
    const [courses, setCourses] = useState<CourseEntity[]>([]);

    useEffect(() => {
        setLoading(true);
        async function fetchData() {
            try {
                const [courses, subscribtions] = await Promise.all([
                    getCourses(),
                    getSubscribersCourseAndUser(userId!)
                ]);
                setCourses(courses);
                setSubscriptions(subscribtions);
            } catch (e) {
                // Toast 
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [])

    const subscribedCourses = courses.filter((course) => subscriptions.some((sub) => sub.courseId === course.id));
    const availableCourses = courses.filter(course => course.status !== "Chiuso" && !subscribedCourses.some(subCourse => subCourse.id === course.id));

    const handleSubscribe = async (course: CourseEntity) => {
        setLoading(true);
        try {
            if (subscribedCourses.includes(course)) {
                await unsubscribe(course);
            }
            else {
                await subscribe(course);
            }
        } catch (e) {
            // Toast 
        } finally {
            setLoading(false);
        }
    }

    const subscribe = async (course: CourseEntity) => {
        const addedSubscriber = await addCourseSubscriber({
            id: GenerateId(),
            userId: userId!,
            courseId: course.id,
            subscriptionDate: new Date().toISOString(),
            grade: null
        });

        setSubscriptions([...subscriptions, addedSubscriber]);
    }

    const unsubscribe = async (course: CourseEntity) => {
        const subscriberId = subscriptions.find(s => s.courseId === course.id)?.id;
        if (!subscriberId) {
            return;
        }

        await deleteSubscriber(subscriberId);
        setSubscriptions(subscriptions.filter(s => s.courseId !== course.id));
    }

    const subscribeFooter = (buttonText: string, course: CourseEntity) => (
        <Button
            variant={"outline"}
            className="w-full"
            onClick={() => handleSubscribe(course)}
            disabled={course.status === "Chiuso"}
        >
            {buttonText}
        </Button>
    )

    if(loading) 
        return <UserInfoCoursesSkeleton />;

    return (
        <Tabs defaultValue="subscribed" className="w-full mt-8">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="subscribed" className="cursor-pointer">
                    Iscrizioni
                    <Badge
                        variant="secondary"
                        className="flex h-5 w-5 items-center justify-center rounded-full bg-muted-foreground/30"
                    >
                        {subscribedCourses.length}
                    </Badge>
                </TabsTrigger>
                <TabsTrigger value="available" className="cursor-pointer">
                    Disponibili
                    <Badge
                        variant="secondary"
                        className="flex h-5 w-5 items-center justify-center rounded-full bg-muted-foreground/30"
                    >
                        {availableCourses.length}
                    </Badge>
                </TabsTrigger>
            </TabsList>
            <TabsContent value="subscribed">
                {subscribedCourses.length === 0 ? (
                    <Card className="flex flex-col items-center justify-center py-12 text-center">
                        <GraduationCap className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-xl font-semibold text-muted-foreground">Non ci sono iscrizioni</p>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {subscribedCourses.map((course) => (
                            <CourseCard key={course.id} course={course} customFooter={subscribeFooter("Rimuovi iscrizione", course)} />
                        ))}
                    </div>
                )}
            </TabsContent>
            <TabsContent value="available">
                {availableCourses.length === 0 ? (
                    <Card className="flex flex-col items-center justify-center py-12 text-center">
                        <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-xl font-semibold text-muted-foreground">Non ci sono corsi disponibili</p>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-6">
                        {availableCourses.map((course) => (
                            <CourseCard key={course.id} course={course} customFooter={subscribeFooter("Iscrivi", course)} />
                        ))}
                    </div>
                )}
            </TabsContent>
        </Tabs>
    )
}
export default UserInfoCourses

const UserInfoCoursesSkeleton = () => {
    return (
        <Tabs defaultValue="subscribed" className="w-full mt-8">
            <TabsList className="grid w-full grid-cols-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-20" />
            </TabsList>
            <TabsContent value="subscribed">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {
                        Array.from({ length: 4 }).map((_, index) => (
                            <CourseCardSkeleton key={index} />
                        ))
                    }
                </div>
            </TabsContent>
        </Tabs>
    )
}
export { UserInfoCoursesSkeleton };