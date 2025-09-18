import {cn} from '@/lib/utils';
import React from 'react';
import {Input} from '@/components/Input';
import {IncomeCalculator} from '@/hooks/useIncomeCalculator';

interface IncomeWageElementsProps extends Pick<IncomeCalculator, "hourlyWage" | "dailyWage" | "weeklyWage" | "monthlyWage" | "yearlyWage">{}

export default function IncomeWageElements(props: IncomeWageElementsProps) {
	console.log("IncomeWageElements props:", props);
	const wageOutputs: {label: string, value: number}[] = [
		{label: "Hourly", value: props.hourlyWage},
		{label: "Daily", value: props.dailyWage},
		{label: "Weekly", value: props.weeklyWage},
		{label: "Monthly", value: props.monthlyWage},
		{label: "Yearly", value: props.yearlyWage},
	]

	const wageElements = wageOutputs.map(({label, value}) => {
			if (!value) return null;
			const formattedValue = value.toFixed(2);
			return <Input
				key={label}
				id={label}
				label={label}
				prefix={"$"}
				placeholder="0"
				value={formattedValue}
				readOnly
			/>
		}
	)

	return (
		<div className={cn("flex", "flex-col", "md:grid", "md:grid-cols-2", "lg:grid-cols-5", "gap-3")}>
			{wageElements}
		</div>
	)
}