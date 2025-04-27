import { Card } from "../ui/card"
import { SubscriberEntity } from "@/model/Subscribers";
import { Grade } from "@/model/Grades";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Check, Edit } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useState } from "react";
import { setGrade } from "@/http/grade";
import { GenerateId } from "../utils/misc";

interface CourseDetailSubscriberProps {
    subscribers: SubscriberEntity[];
    grades: Grade[];
}

const CourseDetailGrades = ({ subscribers, grades }: CourseDetailSubscriberProps) => {
    const [openPopoverId, setOpenPopoverId] = useState<string | null>(null);

    const handleGradeSubmit = async (subscriber: SubscriberEntity) => {
        await setGrade({
            id: GenerateId(),
            userId: subscriber.userId,
            courseId: subscriber.courseId,
            grade: 0
        })
        setOpenPopoverId(null);
    };

    //TODO: Allegare il valore dell'input quando faccio handleGradeSubmit e poi rimuovere il valore dall'input

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
                <Card className="p-4">
                    <div className="text-sm text-muted-foreground">Media</div>
                    <div className="text-2xl font-bold">
                        {grades.length ? (grades.reduce((acc, g) => acc + g.grade, 0) / grades.length).toFixed(1) : '-'}
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="text-sm text-muted-foreground">Valutazioni Assegnate</div>
                    <div className="text-2xl font-bold">{grades.length}/{subscribers.length}</div>
                </Card>
                <Card className="p-4">
                    <div className="text-sm text-muted-foreground">Da Assegnare</div>
                    <div className="text-2xl font-bold">{subscribers.length - grades.length}</div>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {subscribers.map((subscriber) => {
                    const grade = grades.find(g => g.userId === subscriber.userId);
                    return (
                        <Card key={subscriber.id} className="p-4">
                            <div className="flex items-center space-x-4">
                                <Avatar>
                                    <AvatarImage src={"no"} />
                                    <AvatarFallback>{subscriber.user.firstName.charAt(0) + subscriber.user.lastName.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <div className="font-medium">{`${subscriber.user.firstName} ${subscriber.user.lastName}`}</div>
                                    <div className="text-sm text-muted-foreground">
                                        Iscritto: {new Date(subscriber.subscriptionDate).toLocaleDateString('it-IT')}
                                    </div>
                                </div>
                                {
                                    grade && (
                                        <Badge className="text-md size-9">
                                            {grade.grade}
                                        </Badge>
                                    )
                                }
                                <Popover 
                                    open={openPopoverId === subscriber.id}
                                    onOpenChange={(open) => setOpenPopoverId(open ? subscriber.id : null)}
                                >
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" size="icon">
                                            <Edit />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-80">
                                        <div className="grid gap-2">
                                            <div className="grid grid-cols-3 items-center gap-4">
                                                <Label htmlFor="maxHeight">Valutazione</Label>
                                                <Input
                                                    id="maxHeight"
                                                    type="number"
                                                    min={1}
                                                    max={30}
                                                    className="col-span-2 h-8"
                                                />                                                
                                            </div>
                                            <Button className="mt-2" onClick={() => handleGradeSubmit(subscriber)}>
                                                <Check />
                                                Conferma
                                            </Button>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </Card>
                    );
                })}
            </div>
        </div>
    )
}
export default CourseDetailGrades;