"use client"

import {cn} from '@/lib/utils';
import React from 'react';
import {useSearchParams} from 'next/navigation';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import useMonthlyBudgetPlanner from '@/hooks/useMonthlyBudgetPlanner';
import {Input} from '@/components/Input';
import {Separator} from '@/components/ui/separator';
import BudgetCategoryList from '@/components/BudgetCategoryList';
import {Button} from '@/components/ui/button';
import BudgetCategoriesBreakdownPieChart from '@/components/BudgetCategoriesBreakdownPieChart';

export default function BudgetPlannerPage() {
	const searchParams = useSearchParams();
	const initialMonthlyBudget = parseFloat(searchParams.get("monthlyBudget") ?? "0");
	const {
		budget,
		handleBudgetChange,
		resetBudget,
		...categoryHandlers
	} = useMonthlyBudgetPlanner({
		initialBudget: isNaN(initialMonthlyBudget) ? 0 : initialMonthlyBudget
	});

	return (
		<div className={cn("flex", "flex-col", "gap-4", "w-full")}>
			<div className={cn("flex", "w-full", "justify-between")}>
				<div className={cn("flex", "flex-col", "gap-1")}>
					<h1>Budget Planner</h1>
					<p className={cn("text-muted-foreground")}>Plan your budget effectively</p>
				</div>

				<Button variant={"ghost"} onClick={resetBudget}>
					Reset
				</Button>
			</div>

			{/* Inputs */}
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
						value={budget === 0 ? "" : budget}
						onChange={(e) => handleBudgetChange(e.target.value)}/>

					{
						budget !== 0 && (
							<>
								<Separator/>

								<BudgetCategoryList {...categoryHandlers}/>
							</>
						)
					}
				</CardContent>
			</Card>

			{
				categoryHandlers.categories.length !== 0 && (
					<>
						{/* Summary */}
						<Card>
							<CardHeader>
								<CardTitle>Summary</CardTitle>
							</CardHeader>
							<CardContent>
								<BudgetCategoriesBreakdownPieChart {...categoryHandlers}/>
							</CardContent>
						</Card>
					</>
				)
			}
		</div>
	)
}