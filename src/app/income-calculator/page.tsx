"use client";

import {cn} from '@/lib/utils';
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from '@/components/ui/card';
import React from 'react';
import {Input} from '@/components/Input';
import {GrossIncomeType} from '@/hooks/useIncomeCalculator';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {Button} from '@/components/ui/button';
import Link from 'next/link';
import {TaxYears} from '@/lib/deductions/canadian-deductions.types';
import {CanadianProvinceNameToCodeMap} from '@/lib/canadian-provinces';
import AnnualDeductionsBreakdownPieChart from '@/components/IncomeDeductionsBreakdownPieChart';
import AnnualDeductionTable from '@/components/IncomeDeductionTable';
import {Separator} from '@/components/ui/separator';
import {IncomeCalculatorProvider, useIncomeCalculatorContext} from '@/app/contexts/IncomeCalculatorContext';

export default function IncomeCalculatorPage() {
	return (
		<IncomeCalculatorProvider>
			<div className={cn("flex", "flex-col", "gap-4", "w-full")}>
				<Header/>

				<InputsCard/>

				<CompletedOutputs/>
			</div>
		</IncomeCalculatorProvider>
	);
}

const Header = () => {
	const {resetInput} = useIncomeCalculatorContext()
	return (
		<div className={cn("flex", "w-full", "justify-between")}>
			<div className={cn("flex", "flex-col", "gap-1")}>
				<h1>Income Calculator</h1>
				<p className={cn("text-muted-foreground")}>Calculate your income after deductions</p>
			</div>
			<Button variant={"ghost"} onClick={resetInput}>
				Reset
			</Button>
		</div>
	)
}

const InputsCard = () => {
	const {
		grossIncome,
		grossIncomeType,
		hoursPerWeek,
		daysPerWeek,
		provinceCode,
		year,
		handleInputChange,
		handleInputGrossIncomeTypeChange,
		handleProvinceCodeChange,
		handleYearChange,
	} = useIncomeCalculatorContext()

	const formattedInputs = {
		grossIncome: grossIncome === 0 ? "" : grossIncome.toString(),
		hoursPerWeek: hoursPerWeek === 0 ? "" : hoursPerWeek.toString(),
		daysPerWeek: daysPerWeek === 0 ? "" : daysPerWeek.toString(),
		provinceCode: provinceCode ?? "",
		year: year?.toString() ?? "",
	}

	const canadianProvinceAndTerritorySelectItems = Object.entries(CanadianProvinceNameToCodeMap).map(([name, code]) => (
		<SelectItem key={code} value={code}>{name}</SelectItem>
	))

	const taxYearSelectItems = TaxYears.map((year) => <SelectItem key={year} value={year.toString()}>{year}</SelectItem>)

	return (
		<Card>
			<CardHeader>
				<CardTitle>Inputs</CardTitle>
			</CardHeader>
			<CardContent className={cn("flex", "flex-col", "gap-3")}>
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
						value={grossIncomeType}
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

				<Separator/>


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
	)
}

const CompletedOutputs = () => {
	const {
		isCompleted,
	} = useIncomeCalculatorContext()

	return isCompleted && (
		<>
			<NetIncomeCard/>

			<AnnualDeductionsCard/>

			<FooterMessage/>
		</>
	)
}

const NetIncomeCard = () => {
	const {
		hourlyWage,
		dailyWage,
		weeklyWage,
		monthlyWage,
		netAnnualIncome
	} = useIncomeCalculatorContext()

	const wageOutputs: {label: string, value: number}[] = [
		{label: "Hourly", value: hourlyWage},
		{label: "Daily", value: dailyWage},
		{label: "Weekly", value: weeklyWage},
		{label: "Monthly", value: monthlyWage},
		{label: "Yearly", value: netAnnualIncome},
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
		<Card>
			<CardHeader>
				<CardTitle>Net Income</CardTitle>
			</CardHeader>
			<CardContent className={cn("flex", "flex-col", "gap-3",)}>
				<div className={cn("flex", "flex-col", "md:grid", "md:grid-cols-2", "lg:grid-cols-5", "gap-3")}>
					{wageElements}
				</div>
			</CardContent>
		</Card>
	)
}

const AnnualDeductionsCard = () => {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Annual Deduction Breakdown</CardTitle>
			</CardHeader>
			<CardContent>
				<div className={cn("flex", "flex-col", "lg:flex-row", "gap-3",)}>
					<AnnualDeductionTable/>

					<AnnualDeductionsBreakdownPieChart className={cn("xl:w-1/3", "lg:w-1/2")}/>
				</div>
			</CardContent>
			<CardFooter>
				<small className={"text-red-400"}>*These results may not be 100% accurate and should be used as approximations</small>
			</CardFooter>
		</Card>
	)
}

const FooterMessage = () => {
	const {
		monthlyWage
	} = useIncomeCalculatorContext()
	return (
		<div className={cn("flex", "flex-col", "gap-3")}>
			<p>You can use the results to create a custom budget by clicking the button below!</p>
			<Button className={cn("w-fit")} asChild>
				<Link href={`/budget-planner?monthlyBudget=${monthlyWage.toFixed(2)}`}>
					Create Budget
				</Link>
			</Button>
		</div>
	)
}