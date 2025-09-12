"use client";

import {cn} from '@/lib/utils';
import {Card, CardContent} from '@/components/ui/card';
import React from 'react';
import {Input} from '@/components/Input';
import {IncomeCalculatorAmountType, useIncomeCalculator} from '@/hooks/useIncomeCalculator';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {Button} from '@/components/ui/button';
import Link from 'next/link';

export default function IncomeCalculator() {
	const {
		isCompleted,
		handleInputModeChange,
		handleInputChange,
		resetInput,
		...calculatorState
	} = useIncomeCalculator()

	const formattedInputs = {
		amount: calculatorState.amount === 0 ? "" : calculatorState.amount.toString(),
		hoursPerWeek: calculatorState.hoursPerWeek === 0 ? "" : calculatorState.hoursPerWeek.toString(),
		daysPerWeek: calculatorState.daysPerWeek === 0 ? "" : calculatorState.daysPerWeek.toString(),
	}

	const calculatorOutputs: { label: string, value: number }[] = [
		{label: "Hourly", value: calculatorState.hourlyWage},
		{label: "Daily", value: calculatorState.dailyWage},
		{label: "Weekly", value: calculatorState.weeklyWage},
		{label: "Monthly", value: calculatorState.monthlyWage},
		{label: "Yearly", value: calculatorState.yearlyWage},
	]

	const outputElements = calculatorOutputs.map(({label, value}) =>
		value === 0 ? null : (
			<Input
				key={label}
				id={label}
				label={label}
				type={"number"}
				prefix={"$"}
				placeholder="0"
				value={value.toFixed(2)}
				readOnly
			/>
		)
	)

	return (
		<div className={cn("flex", "flex-col", "gap-4", "w-full")}>
			<div className={cn("flex", "w-full", "justify-between")}>
				<h1>Income Calculator</h1>
				<Button variant={"ghost"} onClick={resetInput}>
					Reset
				</Button>
			</div>

			{/* Input */}
			<Card>
				<CardContent className={cn("flex", "flex-col", "gap-3")}>
					<div className={cn("flex", "gap-1", "items-end")}>
						<Input id={"amount"}
						       label={"Amount"}
						       type={"number"}
						       step="0.01"
						       min="0"
						       prefix={"$"}
						       placeholder="0"
						       value={formattedInputs.amount}
						       onChange={(e) => handleInputChange("amount", e.target.value)}
						/>

						<Select
							value={calculatorState.amountType}
							onValueChange={(e) => handleInputModeChange(e as IncomeCalculatorAmountType)}
						>
							<SelectTrigger className={cn("w-1/3")}>
								<SelectValue placeholder="Select income type"/>
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="hourly">Hourly</SelectItem>
								<SelectItem value="yearly">Yearly</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div className={cn("flex", "gap-1",)}>

						<Input id={"hours-per-week"}
						       label={"Hours per week"}
						       type="number"
						       step="0.5"
						       min="0"
						       placeholder="0"
						       value={formattedInputs.hoursPerWeek}
						       onChange={(e) => handleInputChange("hoursPerWeek", e.target.value)}
						/>
						<Input id={"days-per-week"}
						       label={"Days worked per week"}
						       type="number"
						       step="1"
						       min="0"
						       placeholder="0"
						       value={formattedInputs.daysPerWeek}
						       onChange={(e) => handleInputChange("daysPerWeek", e.target.value)}
						/>
					</div>
				</CardContent>
			</Card>

			{/*	TODO: Additional input */}
			{/*<Card>*/}
			{/*	<CardContent>*/}
			{/*	</CardContent>*/}
			{/*</Card>*/}

			{
				isCompleted && (
					<>
						{/*	Output */}
						<Card>
							<CardContent className={cn("flex", "flex-col", "md:grid", "md:grid-cols-2", "lg:grid-cols-4", "gap-3")}>
								{outputElements}
							</CardContent>
						</Card>

						{/* Continue to Budget */}
						<div className={cn("flex", "flex-col", "gap-2")}>
							<p>
								You can use the results to create a custom budget by clicking the button below!
							</p>
							<Button className={cn("w-fit")} asChild>
								<Link href={"/budget-planner"}>
									Create Budget
								</Link>
							</Button>
						</div>
					</>
				)
			}
		</div>
	);
}