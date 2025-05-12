import AreaChartSubscriptions from "./area-chart-data/area-chart-subscriptions";
import BarChartCourses from "./bar-chart-data/bar-chart-courses";
import StatisticsCards from "./statistics-cards";

const Statistics = () => {
	return (
		<>
			<StatisticsCards />
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full px-4 lg:px-6">
				<AreaChartSubscriptions />
				<BarChartCourses />
			</div>			
		</>
	);
}
export default Statistics;