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
import { useForm } from '@tanstack/react-form';
import { isGreaterThanZero } from '@/lib/utils/validations';
import FieldError from '@/components/FieldError';

const BudgetPlannerPageClient = () => {
	const searchParams = useSearchParams();
	const initialMonthlyBudget = parseFloat(searchParams.get('monthlyBudget') ?? '0');
	const initialBudget = isNaN(initialMonthlyBudget) ? 0 : initialMonthlyBudget;

	return (
		<MonthlyBudgetPlannerProvider initialBudget={initialBudget}>
			<div className={cn('flex', 'flex-col', 'gap-4', 'w-full')}>
				<HeaderSection />

				<BudgetInformationCard />

				<BudgetCategoriesCard />

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

const BudgetInformationCard = () => {
	const { totalBudget, handleBudgetChange } = useMonthlyBudgetPlannerContext();

	const form = useForm({
		defaultValues: {
			budget: totalBudget === 0 ? '' : totalBudget.toString(),
		},
		validators: {
			onChange: ({ value }) => handleBudgetChange(value.budget),
		},
	});

	const isValidBudget = ({ value }: { value: string }): string | undefined => {
		if (!value) return;
		if (!isGreaterThanZero(value)) return 'Please enter a valid budget greater than 0';
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Budget Information</CardTitle>
			</CardHeader>
			<CardContent className={cn('flex', 'flex-col', 'gap-4')}>
				<form.Field
					name={'budget'}
					validators={{
						onChange: isValidBudget,
					}}
					children={(field) => (
						<div className={cn('flex', 'flex-col', 'gap-1', 'w-full')}>
							<Input
								id={'budget'}
								className={cn('w-full', 'md:w-1/2', 'lg:w-1/3', 'xl:w-1/4')}
								type={'number'}
								placeholder={'0'}
								label={'Monthly Budget'}
								prefix={'$'}
								value={field.state.value}
								onChange={e => field.handleChange(e.target.value)}
							/>
							<FieldError field={field} />
						</div>
					)}
				/>
			</CardContent>
		</Card>
	);
};

const BudgetCategoriesCard = () => {
	const { totalBudget } = useMonthlyBudgetPlannerContext();

	if (!totalBudget && !isGreaterThanZero(totalBudget.toString())) return null;

	return (
		<Card>
			<CardHeader>
				<CardTitle>Budget Categories</CardTitle>
			</CardHeader>
			<CardContent className={cn('flex', 'flex-col', 'gap-4')}>
				<BudgetCategoryList />
			</CardContent>
		</Card>
	);
};

const Summary = () => {
	const { userDefinedCategories, totalBudget } = useMonthlyBudgetPlannerContext();

	// Don't show summary if no user categories
	if (totalBudget === 0 || userDefinedCategories.length === 0) return null;

	return (
		<>
			<Separator />
			<Card>
				<CardHeader className={cn('flex', 'justify-between')}>
					<CardTitle>Summary</CardTitle>

					<BudgetExportDropdown />
				</CardHeader>
				<CardContent>
					<BudgetCategoriesBreakdownPieChart />
				</CardContent>
			</Card>
		</>
	);
};
