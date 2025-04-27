import { TabsContent } from "@radix-ui/react-tabs";
import { Card } from "../ui/card"
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs"
import CourseDetailSubscriber from "./course-detail-subscriber";
import { GraduationCap, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import { useParams } from "react-router";
import { SubscriberEntity } from "@/model/Subscribers";
import { FetchInitialData } from "../utils/course/course-utils";
import { User } from "@/model/User";
import { addCourseSubscriber, deleteSubscriber, getCourseSubscribers } from "@/http/subscriber";
import { getUsers } from "@/http/user";
import { GenerateId } from "../utils/misc";
import { Grade } from "@/model/Grades";
import { getCourseGrades } from "@/http/grade";
import CourseDetailGrades from "./course-detail-grades";

const CourseDetailTabs = () => {

    const { courseId } = useParams();
    const [subscribers, setSubscribers] = useState<SubscriberEntity[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [grades, setGrades] = useState<Grade[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    
    useEffect(() => {
        const fetchSubscribers = async () => {
            const [subscribers, users, grades] = await Promise.all([
                getCourseSubscribers(courseId!),
                getUsers(),
                getCourseGrades(courseId!)
            ]);

            setSubscribers(subscribers);
            setUsers(users);
            setGrades(grades);
        }
        fetchSubscribers();
    }, [])

    const onAddSubscriber = async (userIds: string[]) => {
        try {
            setLoading(true);
            const newSubscribers: SubscriberEntity[] = [];

            for (const userId of userIds) {
                const addedSubscriber = await addCourseSubscriber({
                    id: GenerateId(),
                    userId: userId,
                    courseId: courseId!,
                    subscriptionDate: new Date().toISOString()
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

    return (
        <Card className="col-span-1 lg:col-span-4 flex flex-col px-6">
            <Tabs defaultValue="subscribers" className="h-full">
                <TabsList className="grid grid-cols-2">
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
                    <TabsTrigger value="grades" className="cursor-pointer">
                        <GraduationCap className="h-4 w-4 mr-1" />
                        Valutazioni
                        <Badge
                            variant="secondary"
                            className="flex h-5 w-5 items-center justify-center rounded-full bg-muted-foreground/30"
                        >
                            {grades.length}
                        </Badge>
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="subscribers" className="flex flex-col justify-between">
                    <CourseDetailSubscriber subscribers={subscribers} users={users} onAddSubscriber={onAddSubscriber} onDeleteSubscriber={onDeleteSubscriber}/>
                </TabsContent>
                <TabsContent value="grades" className="flex flex-col justify-between">
                    <CourseDetailGrades subscribers={subscribers} grades={grades} />
                </TabsContent>
            </Tabs>
        </Card>
    )
}
export default CourseDetailTabs;