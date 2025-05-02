import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { useParams } from "react-router"
import { SubscriberEntity } from "@/model/Subscribers"
import { User } from "@/model/User"
import { getCourses } from "@/http/course"
import { addCourseSubscriber, deleteSubscriber, getSubscribersCourseAndUser } from "@/http/subscriber"
import { CourseEntity } from "@/model/Course"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Button } from "../ui/button"
import CourseCard, { CourseCardSkeleton } from "../courses-list/course-card"
import { GenerateId } from "../utils/misc"
import { BookOpen, CalendarIcon, GraduationCap, MailIcon, ShieldCheck, UserIcon } from "lucide-react"
import { Skeleton } from "../ui/skeleton"
import { getUserById } from "@/http/user"
import useBreadcrumbs from "@/hooks/use-breadcrums"
import UserDetailInfo from "./user-detail-info"

export function UserProfile() {

    useBreadcrumbs([{ label: "Utenti", url: "/users" }, { label: "Dettaglio", url: "#" }])

    const [subscriptions, setSubscriptions] = useState<SubscriberEntity[]>([]);
    const [courses, setCourses] = useState<CourseEntity[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const { userId } = useParams();

    useEffect(() => {
        setLoading(true);
        async function fetchData() {
            try {
                const [user, courses, subscribtions] = await Promise.all([
                    getUserById(userId!),
                    getCourses(),
                    getSubscribersCourseAndUser(userId!)
                ]);
                setCourses(courses);
                setSubscriptions(subscribtions);
                setUser(user);
            } catch (e) {
                // Toast 
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [])

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

        const addedSubscriberEntity = {
            ...addedSubscriber,
            user: user!,
            course: course
        };

        setSubscriptions([...subscriptions, addedSubscriberEntity]);
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

    const subscribedCourses = courses.filter((course) => subscriptions.some((sub) => sub.courseId === course.id));
    const availableCourses = courses.filter(course => course.status !== "Chiuso" && !subscribedCourses.some(subCourse => subCourse.id === course.id));

    if (!user || loading) {
        return <UserProfileSkeleton />
    }

    return (
        <div className="px-6">
            <UserDetailInfo user={user}/>

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
        </div>
    )
}
export default UserProfile

const UserProfileSkeleton = () => {
    return (
        <div className="px-6">
            <div className="space-y-8">
                <Card className="overflow-hidden">
                    <div className="p-8 md:p-10">
                        <div className="flex flex-col md:flex-row md:items-center gap-6">
                            <div>
                                <Skeleton className="w-24 h-24 rounded-full" />
                            </div>

                            <div className="flex-1">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <div>
                                        <Skeleton className="h-9 w-48 mb-2" />
                                        <Skeleton className="h-6 w-32" />
                                    </div>

                                    <div className="flex flex-col sm:items-end gap-2">
                                        <div className="flex items-center gap-2">
                                            <Skeleton className="w-4 h-4" />
                                            <Skeleton className="h-4 w-32" />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Skeleton className="w-4 h-4" />
                                            <Skeleton className="h-4 w-48" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

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
        </div>


    )
}
export { UserProfileSkeleton };