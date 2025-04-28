import { TabsContent } from "@radix-ui/react-tabs";
import { Card } from "../ui/card"
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs"
import CourseDetailSubscriber from "./course-detail-subscriber";
import { GraduationCap, Users } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import { useParams } from "react-router";
import { SubscriberEntity } from "@/model/Subscribers";
import { User } from "@/model/User";
import { addCourseSubscriber, deleteSubscriber, getCourseSubscribers } from "@/http/subscriber";
import { getUsers } from "@/http/user";
import { GenerateId } from "../utils/misc";
import CourseDetailGrades from "./course-detail-grades";
import { Skeleton } from "../ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { subDays } from "date-fns";
import { CourseContext } from "@/providers/course/course-context";

const CourseDetailTabs = () => {

    const { courseId } = useParams();
    const [subscribers, setSubscribers] = useState<SubscriberEntity[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const { course } = useContext(CourseContext);
    const [activeTab, setActiveTab] = useState("subscribers");

    useEffect(() => {
        setLoading(true);

        const fetchSubscribers = async () => {
            try {
                const [subscribers, users] = await Promise.all([
                    getCourseSubscribers(courseId!),
                    getUsers(),
                ]);

                setSubscribers(subscribers);
                setUsers(users);
            } catch (e) {
                // Toast che mostra come errore e.message
            } finally {
                setLoading(false);
            }
        }
        fetchSubscribers();
    }, [])

    useEffect(() => {
        if (!course)
            return;

        if(!isGradesEnabled) setActiveTab("subscribers");

    }, [course])

    const onAddSubscriber = async (userIds: string[]) => {
        try {
            setLoading(true);
            const newSubscribers: SubscriberEntity[] = [];

            for (const userId of userIds) {
                const addedSubscriber = await addCourseSubscriber({
                    id: GenerateId(),
                    userId: userId,
                    courseId: courseId!,
                    subscriptionDate: new Date().toISOString(),
                    grade: null
                });
                const user = users.find(user => user.id === userId);
                newSubscribers.push({ ...addedSubscriber, user: user! });
            }

            setSubscribers([...subscribers, ...newSubscribers]);
        } catch (e) {
            //Toast che mostra come errore e.message 
        } finally {
            setLoading(false);
        }
    }

    const onDeleteSubscriber = async (id: string) => {
        try {
            setLoading(true);
            await deleteSubscriber(id);
            setSubscribers(subscribers.filter(subscriber => subscriber.id !== id));
        } catch (e) {
            //Toast che mostra come errore e.message
        }
        finally {
            setLoading(false);
        }
    }

    const GradesTabContent = (
        <>
            <GraduationCap className="h-4 w-4 mr-1" />
            Valutazioni
            <Badge
                variant="secondary"
                className="flex h-5 w-5 items-center justify-center rounded-full bg-muted-foreground/30"
            >
                {subscribers.filter(subscriber => subscriber.grade !== null).length}
            </Badge>
        </>
    )

    const isGradesEnabled = course?.status === "Chiuso" && course.closeDate && new Date(course.closeDate) > subDays(new Date(), 30);

    if (loading || !course)
        return <CourseDetailTabsSkeleton />;

    return (
        <Card className="col-span-1 sm:col-span-4 flex flex-col px-6 h-[560px]">
            <Tabs defaultValue="subscribers" className="h-full" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-2 w-full md:w-fit">
                    <TabsTrigger value="subscribers" className="cursor-pointer">
                        <Users className="h-4 w-4 mr-1" />
                        Iscrizioni
                        <Badge
                            variant="secondary"
                            className="flex h-5 w-5 items-center justify-center rounded-full bg-muted-foreground/30"
                        >
                            {subscribers.length}
                        </Badge>
                    </TabsTrigger>
                    { isGradesEnabled ?
                        <TabsTrigger value="grades" className="cursor-pointer">
                            {GradesTabContent}
                        </TabsTrigger>
                        :
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div>
                                        <TabsTrigger value="grades" className="cursor-pointer" disabled>
                                            {GradesTabContent}
                                        </TabsTrigger>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Disponibile solo nei 30 giorni successivi alla chiusura del corso</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    }
                </TabsList>
                <TabsContent value="subscribers" className="flex flex-col justify-between">
                    <CourseDetailSubscriber subscribers={subscribers} users={users} onAddSubscriber={onAddSubscriber} onDeleteSubscriber={onDeleteSubscriber} />
                </TabsContent>
                <TabsContent value="grades" className="flex flex-col justify-between">
                    <CourseDetailGrades initialSubscribers={subscribers} />
                </TabsContent>
            </Tabs>
        </Card >
    )
}
export default CourseDetailTabs;

const CourseDetailTabsSkeleton = () => {
    return (
        <Card className="col-span-1 sm:col-span-4 flex flex-col px-6 h-[560px]">
            <div className="border-b flex space-x-1 py-1">
                <div className="flex items-center justify-center gap-2 py-2 px-3">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-5 w-5 rounded-full" />
                </div>
                <div className="flex items-center justify-center gap-2 py-2 px-3">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-5 w-5 rounded-full" />
                </div>
            </div>
            <div className="flex-1 py-6">
                <div className="flex justify-end mb-6">
                    <Skeleton className="h-9 w-[200px]" />
                </div>
                <div className="space-y-3">
                    <div className="flex space-x-4 border-b pb-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 flex-1" />
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex items-center space-x-4 py-2">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="flex-1 h-4" />
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-8 w-8" />
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    )
}
export { CourseDetailTabsSkeleton };