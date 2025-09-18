"use client";

import {cn} from '@/lib/utils';
import {Card, CardContent} from '@/components/ui/card';
import React from 'react';
import {Input} from '@/components/Input';
import {GrossIncomeType, useIncomeCalculator} from '@/hooks/useIncomeCalculator';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {Button} from '@/components/ui/button';
import Link from 'next/link';
import {TaxYears} from '@/lib/deductions/canadian-deductions.types';
import {CanadianProvinceNameToCodeMap} from '@/lib/canadian-provinces';
import {Separator} from '@/components/ui/separator';
import {Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow} from '@/components/ui/table';
import IncomeDeductionsBreakdownPieChart from '@/components/IncomeDeductionsBreakdownPieChart';
import IncomeDeductionTable from '@/components/IncomeDeductionTable';

type LabelValue = {
	label: string;
	value: number;
}

export default function IncomeCalculator() {
	const {
		isCompleted,
		handleInputGrossIncomeTypeChange,
		handleInputChange,
		handleProvinceCodeChange,
		handleYearChange,
		resetInput,
		...calculatorState
	} = useIncomeCalculator()

	const formattedInputs = {
		grossIncome: calculatorState.grossIncome === 0 ? "" : calculatorState.grossIncome.toString(),
		hoursPerWeek: calculatorState.hoursPerWeek === 0 ? "" : calculatorState.hoursPerWeek.toString(),
		daysPerWeek: calculatorState.daysPerWeek === 0 ? "" : calculatorState.daysPerWeek.toString(),
		provinceCode: calculatorState.provinceCode ?? "",
		year: calculatorState.year?.toString() ?? "",
	}

	const canadianProvinceAndTerritorySelectItems = Object.entries(CanadianProvinceNameToCodeMap).map(([name, code]) => (
		<SelectItem key={code} value={code}>{name}</SelectItem>
	))

	const taxYearSelectItems = TaxYears.map((year) => <SelectItem key={year} value={year.toString()}>{year}</SelectItem>)

	const wageOutputs: LabelValue[] = [
		{label: "Hourly", value: calculatorState.hourlyWage},
		{label: "Daily", value: calculatorState.dailyWage},
		{label: "Weekly", value: calculatorState.weeklyWage},
		{label: "Monthly", value: calculatorState.monthlyWage},
		{label: "Yearly", value: calculatorState.yearlyWage},
	]

	const wageElements = wageOutputs.map(({label, value}) =>
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

	const deductionOutputs: LabelValue[] = [
		{label: "Gross Annual Income", value: calculatorState.grossAnnualIncome},
		{label: "Federal Tax", value: calculatorState.totalFederalTax},
		{label: "Provincial Tax", value: calculatorState.totalProvincialTax},
		{label: "Total Tax", value: calculatorState.totalTax},
		{label: "CPP", value: calculatorState.cppContribution},
		{label: "EI", value: calculatorState.eiPremium},
	]

	const deductionRows = deductionOutputs.map(({label, value}) =>
		value === 0 ? null : (
			<TableRow key={label}>
				<TableCell className={cn("text-muted-foreground")}>{label}</TableCell>
				<TableCell>${value.toFixed(2)}</TableCell>
			</TableRow>
		)
	)

	return (
		<div className={cn("flex", "flex-col", "gap-4", "w-full")}>
			<div className={cn("flex", "w-full", "justify-between")}>
				<div className={cn("flex", "flex-col", "gap-1")}>
					<h1>Income Calculator</h1>
					<p className={cn("text-muted-foreground")}>Calculate your income after deductions</p>
				</div>
				<Button variant={"ghost"} onClick={resetInput}>
					Reset
				</Button>
			</div>

			{/* Input */}
			<Card>
				<CardContent className={cn("flex", "flex-col", "gap-3")}>
					<h3 className={cn("text-place")}>Input</h3>

					<div className={cn("flex", "gap-3", "items-end")}>
						<Input id={"amount"}
						       label={"Amount"}
						       type={"number"}
						       step="0.01"
						       min="0"
						       prefix={"$"}
						       placeholder="0"
						       value={formattedInputs.grossIncome}
						       onChange={(e) => handleInputChange("grossIncome", e.target.value)}
						/>

						<Select
							value={calculatorState.grossIncomeType}
							onValueChange={(e) => handleInputGrossIncomeTypeChange(e as GrossIncomeType)}
						>
							<SelectTrigger className={cn("w-1/2")}>
								<SelectValue placeholder="Select income type"/>
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="hourly">Hourly</SelectItem>
								<SelectItem value="yearly">Yearly</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div className={cn("flex", "gap-3",)}>
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


					<div className={cn("flex", "gap-3", "items-end")}>
						{/* Province or Territory selection */}
						<Select
							label={"Province / Territory"}
							value={formattedInputs.provinceCode}
							onValueChange={(e) => handleProvinceCodeChange(e)}
						>
							<SelectTrigger className={cn("w-full")}>
								<SelectValue placeholder="Select a province or territory"/>
							</SelectTrigger>
							<SelectContent>
								{canadianProvinceAndTerritorySelectItems}
							</SelectContent>
						</Select>

						{/* Tax year selection */}
						<Select
							label={"Year"}
							value={formattedInputs.year}
							onValueChange={(e) => handleYearChange(e)}
						>
							<SelectTrigger className={cn("w-full")}>
								<SelectValue placeholder="Select tax year"/>
							</SelectTrigger>
							<SelectContent>
								{taxYearSelectItems}
							</SelectContent>
						</Select>
					</div>
				</CardContent>
			</Card>

			{
				isCompleted && (
					<>
						{/*	Output */}
						<Card>
							<CardContent className={cn("flex", "flex-col", "gap-3",)}>
								<h3>Net Income</h3>
								<div className={cn("flex", "flex-col", "md:grid", "md:grid-cols-2", "lg:grid-cols-5", "gap-3")}>
									{wageElements}
								</div>

								<Separator className={cn("mt-2")}/>

								<h3>Annual Deduction Breakdown</h3>
								<div className={cn("flex", "flex-col", "lg:flex-row", "gap-3",)}>
									<IncomeDeductionTable {...calculatorState}/>

									<IncomeDeductionsBreakdownPieChart {...calculatorState} className={cn("xl:w-1/3", "lg:w-1/2")}/>
								</div>

								<small className={"text-red-400"}>*These results may not be 100% accurate and should be used as approximations</small>
							</CardContent>
						</Card>

						{/* Continue to Budget */}
						<div className={cn("flex", "flex-col", "gap-3")}>
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