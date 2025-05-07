import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

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
import { AreaChartUnit, createAreaChartData } from "./area-chart-data"
import { useEffect, useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/02-components/ui/select"

const chartConfig = {
	desktop: {
		label: "Desktop",
		color: "hsl(var(--chart-1))",
	},
	mobile: {
		label: "Mobile",
		color: "hsl(var(--chart-2))",
	},
} satisfies ChartConfig

const AreaChartSubscriptions = () => {
	const [chartData, setChartData] = useState<AreaChartUnit[]>([]);
	const [timeRange, setTimeRange] = useState("12")

	useEffect(() => {
		async function initializeChartData() {
			const chartData = await createAreaChartData(timeRange);
			setChartData(chartData);
		}
		initializeChartData();
	}, [])

	//TODO: Primo grafico con utenti registrati e utenti iscritti al mese, divisi tra 12 mesi, 24 mesi e 36 mesi
	// Secondo grafico con scelta del corso, e differenza di iscritti tra anno corrente e anno precedente

	const handleValueChange = async (value: string) => {
		const chartData = await createAreaChartData(value);
		setTimeRange(value);
		setChartData(chartData);
	}

	return (
		<Card>
			<CardHeader className="relative">
				<CardTitle className="text-xs md:text-base">Registrazioni e iscritti</CardTitle>
				<CardDescription className="text-xs md:text-base">
					Seleziona l'intervallo di tempo
				</CardDescription>
				<div className="absolute right-6">
					<Select value={timeRange} onValueChange={handleValueChange}>
						<SelectTrigger
							className="@[767px]/card:hidden flex w-30 md:w-40"
							aria-label="Seleziona un valore"
						>
							<SelectValue placeholder="Ultimi 12 mesi" />
						</SelectTrigger>
						<SelectContent className="rounded-xl">
							<SelectItem value="12" className="rounded-lg">
								Ultimi 12 mesi
							</SelectItem>
							<SelectItem value="24" className="rounded-lg">
								Ultimi 24 mesi
							</SelectItem>
							<SelectItem value="36" className="rounded-lg">
								Ultimi 36 mesi
							</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig} className="min-h-[100px]">
					<AreaChart
						accessibilityLayer
						data={chartData}
						margin={{
							left: 12,
							right: 12,
						}}
					>
						<CartesianGrid vertical={false} />
						<XAxis
							dataKey="monthPeriod"
							tickLine={false}
							axisLine={false}
							tickMargin={8}
							interval={2}
						/>
						<ChartTooltip cursor={false} content={<ChartTooltipContent />} />
						<defs>
							<linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
								<stop
									offset="5%"
									stopColor="var(--color-desktop)"
									stopOpacity={0.8}
								/>
								<stop
									offset="95%"
									stopColor="var(--color-desktop)"
									stopOpacity={0.1}
								/>
							</linearGradient>
							<linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
								<stop
									offset="5%"
									stopColor="var(--color-mobile)"
									stopOpacity={0.8}
								/>
								<stop
									offset="95%"
									stopColor="var(--color-mobile)"
									stopOpacity={0.1}
								/>
							</linearGradient>
						</defs>
						<Area
							dataKey="Utenti"
							type="natural"
							fill="url(#fillMobile)"
							fillOpacity={0.4}
							stroke="var(--color-mobile)"
						/>
						<Area
							dataKey="Iscritti"
							type="natural"
							fill="url(#fillDesktop)"
							fillOpacity={0.4}
							stroke="var(--color-desktop)"
						/>
					</AreaChart>
				</ChartContainer>
			</CardContent>
			<CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none">
					Confronto tra registrazioni e iscritti ai corsi
        </div>
      </CardFooter>
		</Card>
	)
}
export default AreaChartSubscriptions
