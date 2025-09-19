import {IncomeCalculator} from '@/hooks/useIncomeCalculator';
import {ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent} from '@/components/ui/chart';
import {Pie, PieChart, PieLabel} from 'recharts';
import * as React from 'react';
import {cn, formatCurrency} from '@/lib/utils';
import {NameType, ValueType} from 'recharts/types/component/DefaultTooltipContent';

interface IncomeDeductionsBreakdownPieChartProps extends Pick<IncomeCalculator,
	"totalFederalTax" | "totalProvincialTax" | "totalTax" | "cppContribution" | "eiPremium" | "grossAnnualIncome">,
	React.ComponentProps<"div">{}

type PieName = 'federal-tax' | 'provincial-tax' | 'cpp' | 'ei' | 'net-income';
type PieValue = number

export default function IncomeDeductionsBreakdownPieChart(props: IncomeDeductionsBreakdownPieChartProps) {
	const netIncome = props.grossAnnualIncome - props.totalTax - props.cppContribution - props.eiPremium;
	const pieData: {name: PieName, value: PieValue, fill: string}[]  = [
		{ name: 'federal-tax', value: props.totalFederalTax, fill: "var(--color-federal-tax" },
		{ name: 'provincial-tax', value: props.totalProvincialTax, fill: "var(--color-provincial-tax" },
		{ name: 'cpp', value: props.cppContribution, fill: "var(--color-cpp" },
		{ name: 'ei', value: props.eiPremium, fill: "var(--color-ei" },
		{ name: 'net-income', value: netIncome, fill: "var(--color-net-income" },
	]

	const pieLabelFormatter: PieLabel = ({payload, ...props}) => (
		<text
			cx={props.cx}
			cy={props.cy}
			x={props.x}
			y={props.y}
			textAnchor={props.textAnchor}
			dominantBaseline={props.dominantBaseline}
			fill="hsla(var(--foreground))"
		>
			{formatCurrency(payload.value)}
		</text>
	)

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

	const formatter = React.useCallback((value: ValueType, name: NameType) => {
		const {label, color} = chartConfig[name]
		return (
			<div className={cn("flex", "gap-2")}>
				<div
					className={cn("shrink-0", "rounded-[2px]", "border-(--color-border)", "bg-(--color-bg)", "h-4.5", "w-4.5")}
					style={
						{
							"--color-bg": color,
							"--color-border": color,
						} as React.CSSProperties
					}
				/>
				<div className={cn("flex", "flex-col")}>
					<small className={cn("text-muted-foreground")}>{label}</small>
					<p>{formatCurrency(value as number)}</p>
				</div>
			</div>
		)
	}, [])

	return (
		<ChartContainer config={chartConfig} className={props.className}>
			<PieChart>
				<ChartTooltip content={<ChartTooltipContent formatter={formatter} hideLabel/>} />
				<Pie data={pieData} nameKey={"name"} dataKey={"value"} label={pieLabelFormatter} innerRadius={60}/>
			</PieChart>
		</ChartContainer>
	)
}