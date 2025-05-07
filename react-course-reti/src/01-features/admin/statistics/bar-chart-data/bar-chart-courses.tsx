import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/02-components/ui/card"
import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/02-components/ui/chart"
import { useEffect, useState } from "react"
import { BarChartUnit, createBarChartData, getBaseData } from "./bar-chart-data"
import { Popover, PopoverContent, PopoverTrigger } from "@/02-components/ui/popover"
import { Button } from "@/02-components/ui/button"
import { Check, ChevronsUpDown } from "lucide-react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/02-components/ui/command"

const chartConfig = {
	course1: {
		label: "course-1",
		color: "hsl(var(--chart-1))",
	},
	course2: {
		label: "course-2",
		color: "hsl(var(--chart-2))",
	},
	course3: {
		label: "course-3",
		color: "hsl(var(--chart-3))",
	},
	course4: {
		label: "course-2",
		color: "hsl(var(--chart-4))",
	},
	course5: {
		label: "course-3",
		color: "hsl(var(--chart-5))",
	},
} satisfies ChartConfig

const SELECTABLE_COURSES = 5

const BarChartCourses = () => {

	const [chartData, setChartData] = useState<BarChartUnit[]>([]);
	const [selectedValues, setSelectedValues] = useState<string[]>([]);
	const [courseOptions, setCourseOptions] = useState<{ label: string, value: string }[]>([])

	useEffect(() => {
		async function initializeChartData() {
			const baseData = await getBaseData();
			setCourseOptions([...baseData.uniqueCourses].map(course => ({
				label: course,
				value: course
			})));
			const chartData = await createBarChartData(baseData);
			setChartData(chartData);
			setSelectedValues([...baseData.uniqueCourses].slice(0, SELECTABLE_COURSES));
		}
		initializeChartData();
	}, [])

	const toggleCourse = (value: string) => {
		setSelectedValues(current => {
			if (current.includes(value)) {
				return current.filter(v => v !== value);
			}
			else {
				if (current.length >= SELECTABLE_COURSES) {
					return [...current.slice(1), value];
				}
				return [...current, value];
			}
		});
	}

	return (
		<Card>
			<CardHeader className="relative">
				<CardTitle className="text-xs md:text-base">Iscrizioni per corso</CardTitle>
				<CardDescription className="text-xs md:text-base">Seleziona fino a 3 corsi</CardDescription>
				<div className="absolute right-6">
					<Popover>
						<PopoverTrigger asChild>
							<Button variant="outline" role="combobox" className="w-[150px] justify-between">
								{"Seleziona corsi..."}
								<ChevronsUpDown className="opacity-50" />
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 max-h-[245px] overflow-y-auto" side="top">
							<Command className="border rounded-md">
								<CommandInput placeholder="Cerca per nome..." />
								<CommandEmpty>Non ci sono utenti.</CommandEmpty>
								<CommandGroup>
									{courseOptions.map((option) => (
										<CommandItem
											key={option.value}
											onSelect={() => toggleCourse(option.value)}
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
				</div>
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig}>
					<BarChart accessibilityLayer data={chartData}>
						<CartesianGrid vertical={false} />
						<XAxis
							dataKey="year"
							tickLine={false}
							tickMargin={10}
							axisLine={false}
						/>
						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent indicator="dashed" />}
						/>

						{selectedValues.map((course, index) => (
							<Bar
								key={course}
								dataKey={course}
								fill={`var(--color-course${index + 1})`}
								radius={4}
							/>
						))}
					</BarChart>
				</ChartContainer>
			</CardContent>
			<CardFooter className="flex-col items-start gap-2 text-sm">
				<div className="flex gap-2 leading-none">
					Iscrizioni ai corsi negli anni
				</div>
			</CardFooter>
		</Card>
	)
}
export default BarChartCourses
