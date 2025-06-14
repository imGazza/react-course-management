import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/02-components/ui/select"
import { eachYearOfInterval } from "date-fns";

interface YearSelectProps {
	minYear: number;
	maxYear: number;
	year: string;
	onSelectedYear: (year: string) => void;
}

const YearSelect = ({ minYear, maxYear, year, onSelectedYear }: YearSelectProps) => {

	const yearInterval = eachYearOfInterval({
		start: new Date(minYear, 0, 1),
		end: new Date(maxYear, 11, 31)
	})

	return (
		<Select value={year} onValueChange={onSelectedYear}>
			<SelectTrigger className="w-[180px]">
				<SelectValue placeholder="Anno" />
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					{
						yearInterval.map(year => {
							return (
								<SelectItem
									key={year.getFullYear()}
									value={year.getFullYear().toString()}>
									{year.getFullYear()}
								</SelectItem>
							)
						})
					}
				</SelectGroup>
			</SelectContent>
		</Select>
	)
}
export default YearSelect