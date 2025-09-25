'use client';

import { useSearchParams } from 'next/navigation';
import {
	MonthlyBudgetPlannerProvider,
	useMonthlyBudgetPlannerContext,
} from '@/contexts/MonthlyBudgetPlannerContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/Input';
import { Separator } from '@/components/ui/separator';
import BudgetCategoryList from '@/components/BudgetCategoryList';
import BudgetExportDropdown from '@/components/BudgetExportDropdown';
import BudgetCategoriesBreakdownPieChart from '@/components/BudgetCategoriesBreakdownPieChart';
import React from 'react';
import { cn } from '@/lib/utils/tailwind';

const BudgetPlannerPageClient = () => {
	const searchParams = useSearchParams();
	const initialMonthlyBudget = parseFloat(searchParams.get('monthlyBudget') ?? '0');
	const initialBudget = isNaN(initialMonthlyBudget) ? 0 : initialMonthlyBudget;

	return (
		<MonthlyBudgetPlannerProvider initialBudget={initialBudget}>
			<div className={cn('flex', 'flex-col', 'gap-4', 'w-full')}>
				<HeaderSection />

				<InputsCard />

				<Summary />
			</div>
		</MonthlyBudgetPlannerProvider>
	);
};

export default BudgetPlannerPageClient;

const HeaderSection = () => {
	const { resetBudget } = useMonthlyBudgetPlannerContext();

	return (
		<div className={cn('flex', 'w-full', 'justify-between')}>
			<div className={cn('flex', 'flex-col', 'gap-1')}>
				<h1>Budget Planner</h1>
				<p className={cn('text-muted-foreground')}>Plan your budget effectively</p>
			</div>

			<Button variant={'ghost'} onClick={resetBudget}>
				Reset
			</Button>
		</div>
	);
};

const InputsCard = () => {
	const { totalBudget, handleBudgetChange } = useMonthlyBudgetPlannerContext();
	const isZeroBudget = totalBudget === 0;
	const totalBudgetValue = isZeroBudget ? '' : totalBudget.toString();
	return (
		<Card>
			<CardHeader>
				<CardTitle>Budget Information</CardTitle>
			</CardHeader>
			<CardContent className={cn('flex', 'flex-col', 'gap-4')}>
				<Input
					id={'budget'}
					className={cn('w-full', 'md:w-1/2', 'lg:w-1/3', 'xl:w-1/4')}
					type={'number'}
					placeholder={'0'}
					label={'Monthly Budget'}
					prefix={'$'}
					value={totalBudgetValue}
					onChange={e => handleBudgetChange(e.target.value)}
				/>

				{!isZeroBudget && (
					<>
						<Separator />

						<BudgetCategoryList />
					</>
				)}
			</CardContent>
		</Card>
	);
};

const Summary = () => {
	const { userDefinedCategories, totalBudget } = useMonthlyBudgetPlannerContext();

	// Don't show summary if no user categories
	if (totalBudget === 0 || userDefinedCategories.length === 0) return null;

	return (
		<Card>
			<CardHeader className={cn('flex', 'justify-between')}>
				<CardTitle>Summary</CardTitle>

				<BudgetExportDropdown />
			</CardHeader>
			<CardContent>
				<BudgetCategoriesBreakdownPieChart />
			</CardContent>
		</Card>
	);
};
