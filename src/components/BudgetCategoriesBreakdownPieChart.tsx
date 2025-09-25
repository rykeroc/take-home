import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart';
import { Pie, PieChart, PieLabel } from 'recharts';
import * as React from 'react';
import { cn, formatCurrency } from '@/lib/utils';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';
import { useMemo } from 'react';
import { useMonthlyBudgetPlannerContext } from '@/contexts/MonthlyBudgetPlannerContext';

type BudgetCategoriesBreakdownPieChartProps = React.ComponentProps<'div'>;

export default function BudgetCategoriesBreakdownPieChart(
	props: BudgetCategoriesBreakdownPieChartProps,
) {
	const { userDefinedCategories, unallocatedBudget } = useMonthlyBudgetPlannerContext();

	const allCategories = useMemo(
		() => [...userDefinedCategories, unallocatedBudget],
		[userDefinedCategories, unallocatedBudget],
	);

	const pieData = allCategories.map(category => ({
		id: category.id,
		value: category.amount,
		fill: category.color,
	}));

	const chartConfig: ChartConfig = allCategories.reduce((acc, category) => {
		acc[category.id] = {
			label: category.name,
			color: category.color,
		};

		return acc;
	}, {} as ChartConfig);

	console.log(chartConfig);

	const pieLabelFormatter: PieLabel = ({ payload, ...props }) => (
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
	);

	const formatter = React.useCallback(
		(value: ValueType, name: NameType) => {
			const { label, color } = chartConfig[name];
			return (
				<div className={cn('flex', 'gap-2')}>
					<div
						className={cn(
							'shrink-0',
							'rounded-[2px]',
							'border-(--color-border)',
							'bg-(--color-bg)',
							'h-4.5',
							'w-4.5',
						)}
						style={
							{
								'--color-bg': color,
								'--color-border': color,
							} as React.CSSProperties
						}
					/>
					<div className={cn('flex', 'flex-col')}>
						<small className={cn('text-muted-foreground')}>{label}</small>
						<p>{formatCurrency(value as number)}</p>
					</div>
				</div>
			);
		},
		[chartConfig],
	);

	return (
		<ChartContainer config={chartConfig} className={props.className}>
			<PieChart>
				<ChartTooltip content={<ChartTooltipContent formatter={formatter} hideLabel />} />
				<Pie data={pieData} nameKey={'id'} dataKey={'value'} label={pieLabelFormatter} />
			</PieChart>
		</ChartContainer>
	);
}
