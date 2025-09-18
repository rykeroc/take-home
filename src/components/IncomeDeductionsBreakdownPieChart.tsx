import {IncomeCalculator} from '@/hooks/useIncomeCalculator';
import {ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent} from '@/components/ui/chart';
import {Pie, PieChart} from 'recharts';
import {cn} from '@/lib/utils';
import * as React from 'react';

interface IncomeDeductionsBreakdownPieChartProps extends Pick<IncomeCalculator,
	"totalFederalTax" | "totalProvincialTax" | "totalTax" | "cppContribution" | "eiPremium" | "grossAnnualIncome">,
	React.ComponentProps<"div">{}

export default function IncomeDeductionsBreakdownPieChart(props: IncomeDeductionsBreakdownPieChartProps) {
	const netIncome = props.grossAnnualIncome - props.totalTax - props.cppContribution - props.eiPremium;
	const pieData = [
		{ name: 'federal-tax', value: props.totalFederalTax, fill: "var(--color-federal-tax" },
		{ name: 'provincial-tax', value: props.totalProvincialTax, fill: "var(--color-provincial-tax" },
		{ name: 'cpp', value: props.cppContribution, fill: "var(--color-cpp" },
		{ name: 'ei', value: props.eiPremium, fill: "var(--color-ei" },
		{ name: 'net-income', value: netIncome, fill: "var(--color-net-income" },
	]

	const chartConfig: ChartConfig = {
		"federal-tax": {
			label: "Federal Tax",
			color: "var(--chart-1)",
		},
		"provincial-tax": {
			label: "Provincial Tax",
			color: "var(--chart-2)",
		},
		"cpp": {
			label: "CPP",
			color: "var(--chart-3)",
		},
		"ei": {
			label: "EI",
			color: "var(--chart-4)",
		},
		"net-income": {
			label: "Net Income",
			color: "var(--chart-5)",
		},
	}

	return (
		<ChartContainer config={chartConfig} className={props.className}>
			<PieChart>
				<ChartTooltip content={<ChartTooltipContent hideLabel/>} />
				<Pie data={pieData} nameKey={"name"} dataKey={"value"} label/>
			</PieChart>
		</ChartContainer>
	)
}