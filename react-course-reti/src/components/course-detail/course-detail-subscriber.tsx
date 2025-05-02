import { Check, ChevronsUpDown, Trash2, UserMinus } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { SubscriberEntity } from "@/model/Subscribers"
import { useContext, useState } from "react"
import { Button } from "../ui/button"
import { ScrollArea } from "../ui/scroll-area"
import { Skeleton } from "../ui/skeleton"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "../ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { User } from "@/model/User"
import { CourseContext } from "@/providers/course/course-context"
import { Lock } from "lucide-react";

interface CourseDetailSubscriberProps {
    subscribers: SubscriberEntity[];
    users: User[];
    onAddSubscriber: (userIds: string[]) => void;
    onDeleteSubscriber: (subscriberId: string) => void;
}

const CourseDetailSubscriber = ({ subscribers, users, onAddSubscriber, onDeleteSubscriber }: CourseDetailSubscriberProps) => {

    const [selectedValues, setSelectedValues] = useState<string[]>([]);
    const { course } = useContext(CourseContext);

    const usersOptions = users.map(user => ({
        label: `${user.firstName} ${user.lastName}`,
        value: user.id!
    }))

    const toggleUser = (value: string) => {
        setSelectedValues(current => current.includes(value) ?
            current.filter(v => v !== value) : [...current, value]
        )
    }

    const onAdd = async (userIds: string[]) => {
        onAddSubscriber(userIds);
        setSelectedValues([]);
    }

    const isReadOnly = course?.status === "Chiuso";

    return (
        <>
            <CardHeader className="px-0">
                {!isReadOnly ?
                    <Popover>
                        <div className="flex items-center gap-2 w-full max-md:justify-between justify-end">
                            <PopoverTrigger asChild>
                                <Button variant="outline" role="combobox" className="w-[200px] justify-between">
                                    {"Aggiungi utenti..."}
                                    <ChevronsUpDown className="opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <Button variant="outline" onClick={() => onAdd(selectedValues)}>
                                <Check className="h-4 w-4" />
                                Conferma
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
                    :
                    <div className="flex items-center justify-center gap-2 text-muted-foreground bg-muted/50 p-4 rounded-md">
                        <Lock className="h-4 w-4"/>
                        Non è possibile modificare le iscrizioni a corso chiuso.
                    </div>
                }
            </CardHeader>
            <CardContent className="flex-1 px-0 pt-4 max-h-[405px]">
                <ScrollArea className="h-full">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-foreground/50 font-normal">Nome</TableHead>
                                <TableHead className="text-foreground/50 font-normal">Cognome</TableHead>
                                <TableHead className="text-foreground/50 font-normal max-md:hidden">Email</TableHead>
                                <TableHead className="text-foreground/50 font-normal max-md:hidden">Data Iscrizione</TableHead>
                                <TableHead className="text-foreground/50 text-right font-normal">Disiscrivi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {subscribers.map((subscriber) => (
                                <TableRow key={subscriber.id}>
                                    <TableCell className="font-medium">{`${subscriber.user.firstName}`}</TableCell>
                                    <TableCell className="font-medium">{`${subscriber.user.lastName}`}</TableCell>
                                    <TableCell className="font-medium max-md:hidden">{`${subscriber.user.email}`}</TableCell>
                                    <TableCell className="font-medium max-md:hidden">{`${new Date(subscriber.subscriptionDate).toLocaleDateString('it-IT')}`}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => onDeleteSubscriber(subscriber.id)} disabled={isReadOnly}>
                                            <UserMinus className="h-4 w-4" />
                                            <span className="sr-only">Delete</span>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </ScrollArea>
            </CardContent>
        </>
    )
}
export default CourseDetailSubscriber;

const CourseDetailSubscriberSkeleton = () => {
    return (
        <Card className="col-span-1 sm:col-span-4 min-h-[405px] flex flex-col">
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