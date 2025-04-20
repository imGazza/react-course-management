import { Plus } from "lucide-react"
import { Button } from "../ui/button"
import { ReactNode } from "react";

interface AddNewButtonProps {
    //onClick: () => void;
    addComponent: ReactNode;
}

const AddNewButton = ({ addComponent }: AddNewButtonProps) => {
    return (
        <div className="flex gap-2 ml-4">
            <Button onClick={() => { }} variant="outline" className="flex items-center gap-1 cursor-pointer">
                <Plus className="h-4 w-4" />
                Aggiungi
                {addComponent}
            </Button>
        </div>
    )
}
export default AddNewButton