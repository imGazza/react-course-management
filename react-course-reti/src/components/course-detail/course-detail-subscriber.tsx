import { Check, ChevronsUpDown, Trash2, UserCheck, UserPlus, X } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Subscriber, SubscriberEntity } from "@/model/Subscribers"
import { useEffect, useState } from "react"
import { useParams } from "react-router"
import { FetchInitialData } from "../utils/course/course-utils"
import { addCourseSubscriber, deleteSubscriber, getCourseSubscribers } from "@/http/subscriber"
import { Button } from "../ui/button"
import { ScrollArea } from "../ui/scroll-area"
import { Skeleton } from "../ui/skeleton"
import { Badge } from "../ui/badge"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { cn } from "@/lib/utils"
import { User } from "@/model/User"
import { getUsers } from "@/http/user"
import { GenerateId } from "../utils/misc"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"

const CourseDetailSubscriber = () => {

    const { courseId } = useParams();
    const [subscribers, setSubscribers] = useState<SubscriberEntity[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedValues, setSelectedValues] = useState<string[]>([]);

    useEffect(() => {
        const fetchSubscribers = async () => {
            FetchInitialData<SubscriberEntity[], string>(setLoading, setSubscribers, getCourseSubscribers, courseId!);
            FetchInitialData<User[], string>(setLoading, setUsers, getUsers, courseId!);
        }
        fetchSubscribers();
    }, []);

    const usersOptions = users.map(user => ({
        label: `${user.firstName} ${user.lastName}`,
        value: user.id!
    }))

    const toggleUser = (value: string) => {
        setSelectedValues(current => current.includes(value) ?
            current.filter(v => v !== value) : [...current, value]
        )
    }

    const onAddSubscriber = async () => {
        try {
            setLoading(true);
            const newSubscribers: SubscriberEntity[] = [];

            for (const userId of selectedValues) {
                const addedSubscriber = await addCourseSubscriber({ 
                    id: GenerateId(), 
                    userId: userId, 
                    courseId: courseId!, 
                    subscriptionDate: new Date().toISOString()
                });
                const user = users.find(user => user.id === userId);
                newSubscribers.push({ ...addedSubscriber, user: user!});
            }   

            setSubscribers([...subscribers, ...newSubscribers]);
        } catch (e) {
            //Toast che mostra come errore e.message 
        } finally {
            setLoading(false);
            setSelectedValues([]);
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

    if (subscribers.length === 0 || loading) {
        return <CourseDetailSubscriberSkeleton />
    }

    return (
        <Card className="col-span-1 lg:col-span-1 min-h-[405px] flex flex-col px-6">


            <Tabs defaultValue="account" className="w-full h-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="subscribers">Iscrizioni</TabsTrigger>
                    <TabsTrigger value="grades">Valutazioni</TabsTrigger>
                </TabsList>

                <TabsContent value="subscribers" className="flex flex-col justify-between">
                    <CardContent className="flex-1 px-0">
                        <ScrollArea className="h-[245px]">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="text-foreground/50 font-normal">Nome</TableHead>
                                        <TableHead className="text-foreground/50 text-right font-normal">Elimina</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {subscribers.map((subscriber) => (
                                        <TableRow key={subscriber.id}>
                                            <TableCell className="font-medium">{`${subscriber.user.firstName} ${subscriber.user.lastName}`}</TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="icon" onClick={() => onDeleteSubscriber(subscriber.id)}>
                                                    <Trash2 className="h-4 w-4" />
                                                    <span className="sr-only">Delete</span>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </ScrollArea>
                    </CardContent>
                    <CardFooter className="px-0">
                        <Popover>
                            <div className="flex items-center gap-2 w-full">
                                <PopoverTrigger asChild>
                                    <Button variant="outline" role="combobox" className="flex-1 justify-between">
                                        {"Seleziona utenti..."}
                                        <ChevronsUpDown className="opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <Button variant="outline" size="icon" onClick={onAddSubscriber}>
                                    <Check className="h-4 w-4" />
                                    <span className="sr-only">Conferma</span>
                                </Button>
                            </div>
                            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 max-h-[245px] overflow-y-auto" side="top">
                                <Command className="border rounded-md">
                                    <CommandInput placeholder="Cerca per nome..." />
                                    <CommandEmpty>Non ci sono utenti.</CommandEmpty>
                                    <CommandGroup>
                                        {usersOptions.map((option) => (
                                            <CommandItem
                                                key={option.value}
                                                onSelect={() => toggleUser(option.value)}
                                                className="cursor-pointer"
                                                onMouseDown={(e) => e.preventDefault()}
                                            >
                                                <div className="flex items-center justify-between w-full">
                                                    {option.label}
                                                    {selectedValues.includes(option.value) && (
                                                        <Check className="text-foreground h-4 w-4" />
                                                    )}
                                                </div>
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </CardFooter>
                </TabsContent>
            </Tabs>
        </Card>
    )
}
export default CourseDetailSubscriber;

const CourseDetailSubscriberSkeleton = () => {
    return (
        <Card className="col-span-1 lg:col-span-1 min-h-[405px] flex flex-col">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Skeleton className="h-5 w-5" />
                    <Skeleton className="h-6 w-24" />
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
                <div className="h-[245px]">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>
                                    <Skeleton className="h-4 w-20" />
                                </TableHead>
                                <TableHead className="text-right">
                                    <Skeleton className="h-4 w-16 ml-auto" />
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {Array.from({ length: 4 }).map((_, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        <Skeleton className="h-5 w-40" />
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Skeleton className="h-8 w-8 ml-auto" />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
            <CardFooter>
                <Skeleton className="h-8 w-full" />
            </CardFooter>
        </Card>
    )
}

export { CourseDetailSubscriberSkeleton }