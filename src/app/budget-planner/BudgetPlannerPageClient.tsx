"use client"

import {useSearchParams} from 'next/navigation';
import {MonthlyBudgetPlannerProvider, useMonthlyBudgetPlannerContext} from '@/contexts/MonthlyBudgetPlannerContext';
import {cn} from '@/lib/utils';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/Input';
import {Separator} from '@/components/ui/separator';
import BudgetCategoryList from '@/components/BudgetCategoryList';
import MonthlyBudgetExportDropdown from '@/components/MonthlyBudgetExportDropdown';
import BudgetCategoriesBreakdownPieChart from '@/components/BudgetCategoriesBreakdownPieChart';
import React from 'react';

const BudgetPlannerPageClient = () =>  {
	const searchParams = useSearchParams();
	const initialMonthlyBudget = parseFloat(searchParams.get("monthlyBudget") ?? "0");
	const initialBudget = isNaN(initialMonthlyBudget) ? 0 : initialMonthlyBudget

	return (
		<MonthlyBudgetPlannerProvider initialBudget={initialBudget}>
			<div className={cn("flex", "flex-col", "gap-4", "w-full")}>
				<Header/>

				<InputsCard/>

				<Summary/>
			</div>
		</MonthlyBudgetPlannerProvider>
	)
}

export default BudgetPlannerPageClient;

const Header = () => {
	const {resetBudget} = useMonthlyBudgetPlannerContext();

	return (
		<div className={cn("flex", "w-full", "justify-between")}>
			<div className={cn("flex", "flex-col", "gap-1")}>
				<h1>Budget Planner</h1>
				<p className={cn("text-muted-foreground")}>Plan your budget effectively</p>
			</div>

			<Button variant={"ghost"} onClick={resetBudget}>
				Reset
			</Button>
		</div>
	)
}

const InputsCard = () => {
	const {totalBudget, handleBudgetChange} = useMonthlyBudgetPlannerContext();
	return (
		<Card>
			<CardHeader>
				<CardTitle>Budget Information</CardTitle>
			</CardHeader>
			<CardContent className={cn("flex", "flex-col", "gap-4")}>
				<Input
					id={"budget"}
					className={cn("w-full", "md:w-1/2", "lg:w-1/3", "xl:w-1/4")}
					type={"number"}
					placeholder={"0"}
					label={"Monthly Budget"}
					prefix={"$"}
					value={totalBudget === 0 ? "" : totalBudget}
					onChange={(e) => handleBudgetChange(e.target.value)}/>

				{
					totalBudget !== 0 && (
						<>
							<Separator/>

							<BudgetCategoryList/>
						</>
					)
				}
			</CardContent>
		</Card>
	)
}

const Summary = () => {
	const {userDefinedCategories} = useMonthlyBudgetPlannerContext();

	// Don't show summary if no categories
	if (userDefinedCategories.length === 0) return null

	return (
		<Card>
			<CardHeader className={cn("flex", "justify-between")}>
				<CardTitle>Summary</CardTitle>

				<MonthlyBudgetExportDropdown/>
			</CardHeader>
			<CardContent>
				<BudgetCategoriesBreakdownPieChart/>
			</CardContent>
		</Card>
	)
}