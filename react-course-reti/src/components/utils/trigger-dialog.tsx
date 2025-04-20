import { type LucideIcon} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ReactNode, useState } from "react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

interface TriggerDialogProps {
    buttonText: string;
    ButtonIcon: LucideIcon;
    dialogComponent: (props: { setOpen: (open: boolean) => void }) => ReactNode;
}

const TriggerDialog = ({ dialogComponent, buttonText, ButtonIcon }: TriggerDialogProps) => {

    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-1 cursor-pointer">
                    <ButtonIcon className="h-4 w-4" />
                    {buttonText}
                </Button>
            </DialogTrigger>
            {dialogComponent({ setOpen: setOpen })}
        </Dialog>
    )
}
export default TriggerDialog