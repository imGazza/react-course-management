import { Button } from "@/02-components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/02-components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/02-components/ui/popover"
import { userService } from "@/03-http/base/services/user"
import useBaseComponent from "@/04-hooks/use-base-component"
import { User } from "@/05-model/User"
import { Check, ChevronsUpDown } from "lucide-react"
import { useState } from "react"

interface ComboboxUsersProps {
	onAddSubscriber: (users: User[]) => void;
}

const ComboboxUsers = ({ onAddSubscriber }: ComboboxUsersProps) => {

	const { query: { data: users = [] } } = useBaseComponent<User, User[]>(
		{
			queryKey: ["users"],
			fetch: userService.getAll
		}
	)

	const [selectedValues, setSelectedValues] = useState<string[]>([]);

	const usersOptions = users.map(user => ({
		label: `${user.firstName} ${user.lastName}`,
		value: user.id
	}))

	const toggleUser = (value: string) => {
		setSelectedValues(current => current.includes(value) ?
			current.filter(v => v !== value) : [...current, value]
		)
	}

	const onAdd = async (userIds: string[]) => {
		onAddSubscriber(users.filter(user => userIds.includes(user.id)));
		setSelectedValues([]);
	}

	return (
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
	)
}
export default ComboboxUsers