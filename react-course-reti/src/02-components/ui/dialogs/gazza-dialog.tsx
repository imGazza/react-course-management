import { ReactNode, useState } from "react";
import { Dialog, DialogTrigger } from "@/02-components/ui/dialog";

interface GazzaDialogProps {    
    dialogComponent: (props: { setOpen: (open: boolean) => void, open: boolean }) => ReactNode;
    children?: ReactNode;
}

const GazzaDialog = ({ dialogComponent, children, }: GazzaDialogProps) => {

    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            {dialogComponent({ setOpen: setOpen, open: open })}
        </Dialog>
    )
}
export default GazzaDialog