import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DialogDescription, } from "@radix-ui/react-dialog";
import { Lesson } from "@/model/Lesson";
import { Presentation } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface LessonsDialogProps {
	lessons: Lesson[];
	courseName: string
}

const LessonsDialog = ({ lessons, courseName }: LessonsDialogProps) => {
	return (
		<DialogContent className="sm:max-w-[450px]">
			<DialogHeader>
				<DialogTitle>{courseName}</DialogTitle>
			</DialogHeader>
			<DialogDescription className="mb-6">
				Lezioni previste per il corso.
			</DialogDescription>
			{lessons.length === 0 ? (
				<div className="flex items-center justify-center gap-2 p-3 border rounded-md">
					<p className="text-sm text-muted-foreground">
						Nessuna lezione disponibile.
					</p>
				</div>
			)
				:
				<ScrollArea className="h-100">
					<div className="flex flex-col gap-4">
						{
							lessons.map((lesson) => (
								<div key={lesson.id} className="flex items-center justify-between p-3 border rounded-md">
									<div className="flex items-center gap-3">
										<Presentation className="h-5 w-5 text-muted-foreground" />
										<div>
											<p className="font-medium">{lesson.name}</p>
											<p className="text-sm text-muted-foreground">
												{
													new Date() <= new Date(lesson.lessonDate) ?
														`La lezione si terrà in data ${new Date(lesson.lessonDate).toLocaleDateString('it-IT')}` :
														`La lezione si è tenuta in data ${new Date(lesson.lessonDate).toLocaleDateString('it-IT')}`
												}
											</p>
										</div>
									</div>									
								</div>
							))
						}
					</div>
				</ScrollArea>
			}
		</DialogContent>
	)
}
export default LessonsDialog;