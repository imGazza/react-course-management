import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface YearSelectProps {
   year: string;
   onSelectedYear: (year: string) => void;
}

const YearSelect = ({ year, onSelectedYear }: YearSelectProps) => {
    return (
        <div className="flex items-center justify-end px-6">
            <Select value={year} onValueChange={onSelectedYear}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Anno" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectItem value="All">Tutti</SelectItem>
                        <SelectItem value="2022">2022</SelectItem>
                        <SelectItem value="2023">2023</SelectItem>
                        <SelectItem value="2024">2024</SelectItem>
                        <SelectItem value="2025">2025</SelectItem>
                        <SelectItem value="2026">2026</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>            
        </div>
    )
}
export default YearSelect