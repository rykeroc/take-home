/* eslint-disable react/no-children-prop */

'use client';

import {
	IncomeCalculatorProvider,
	useIncomeCalculatorContext,
} from '@/contexts/IncomeCalculatorContext';
import { cn } from '@/lib/utils/tailwind';
import { Button } from '@/components/ui/button';
import { CanadianProvinceNameToCodeMap, CanadianProvinceOrTerritoryCode } from '@/lib/canadian-provinces';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { TaxYear, TaxYears } from '@/lib/deductions/canadian-deductions.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/Input';
import { GrossIncomeType } from '@/hooks/useIncomeCalculator';
import { Separator } from '@/components/ui/separator';
import AnnualDeductionTable from '@/components/IncomeDeductionTable';
import AnnualDeductionsBreakdownPieChart from '@/components/IncomeDeductionsBreakdownPieChart';
import Link from 'next/link';
import React, { useCallback } from 'react';
import { useForm } from '@tanstack/react-form';
import FieldError from '@/components/FieldError';
import { isGreaterThanZero } from '@/lib/utils/validations';

export const IncomeCalculatorPageClient = () => (
	<IncomeCalculatorProvider>
		<div className={cn('flex', 'flex-col', 'gap-4', 'w-full')}>
			<HeaderSection />

			<RequiredInputsCard />

			<OptionalInputsCard />

			<CompletedOutputsSection />
		</div>
	</IncomeCalculatorProvider>
);

export default IncomeCalculatorPageClient;

const HeaderSection = () => {
	const { resetParams } = useIncomeCalculatorContext();
	return (
		<section className={cn('flex', 'w-full', 'justify-between')}>
			<div className={cn('flex', 'flex-col', 'gap-1')}>
				<h1>Income Calculator</h1>
				<p className={cn('text-muted-foreground')}>
					Calculate your income after deductions
				</p>
			</div>
			<Button variant={'ghost'} onClick={resetParams}>
				Reset
			</Button>
		</section>
	);
};

const RequiredInputsCard = () => {
	const {
		handleParamsChange,
	} = useIncomeCalculatorContext();

	const form = useForm({
		defaultValues: {
			grossIncome: '',
			grossIncomeType: 'hourly' as GrossIncomeType,
			hoursPerWeek: '37.5',
			daysPerWeek: '5',
			provinceCode: null as CanadianProvinceOrTerritoryCode | null,
			year: null as TaxYear | null,
		},
		validators: {
			onChange: ({ value }) => handleParamsChange({
				grossIncome: parseFloat(value.grossIncome) || 0,
				grossIncomeType: value.grossIncomeType,
				hoursPerWeek: parseFloat(value.hoursPerWeek) || 0,
				daysPerWeek: parseInt(value.daysPerWeek) || 0,
				provinceCode: value.provinceCode,
				year: value.year,
			}),
		},
	});

	const canadianProvinceAndTerritorySelectItems = Object.entries(
		CanadianProvinceNameToCodeMap,
	).map(([name, code]) => (
		<SelectItem key={code} value={code}>
			{name}
		</SelectItem>
	));

	const taxYearSelectItems = TaxYears.map(year => (
		<SelectItem key={year} value={year.toString()}>
			{year}
		</SelectItem>
	));

	const validateGrossIncome = ({ value }: { value: string }): string | undefined => {
		if (!value) return undefined;

		if (!isGreaterThanZero(value)) return 'Please enter a valid number';
	};

	const validateHoursPerWeek = ({ value }: { value: string }): string | undefined => {
		if (!value) return undefined;

		if (!isGreaterThanZero(value)) return 'Please enter a valid number';
		if (parseFloat(value) > 168) return 'Hours per week cannot be more than 168';
	};

	const validateDaysPerWeek = ({ value }: { value: string }): string | undefined => {
		if (!value) return undefined;

		if (!isGreaterThanZero(value)) return 'Please enter a valid number';
		if (parseInt(value) > 7) return 'Days per week cannot be more than 7';
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Required Inputs</CardTitle>
			</CardHeader>
			<CardContent className={cn('flex', 'flex-col', 'gap-3')}>
				<div className={cn('flex', 'gap-3', 'items-start')}>
					<form.Field
						name={'grossIncome'}
						validators={{
							onChange: validateGrossIncome,
						}}
						children={field => (
							<div className={cn('flex', 'flex-col', 'gap-1', 'w-full')}>
								<Input
									id={field.name}
									label={'Amount'}
									type={'number'}
									step="0.01"
									min="0"
									prefix={'$'}
									placeholder="0"
									value={field.state.value.toString()}
									onChange={e => field.handleChange(e.target.value)}
									required
								/>
								<FieldError field={field} />
							</div>
						)}
					/>

					<form.Field
						name={'grossIncomeType'}
						children={field => (
							<div className={cn('flex', 'flex-col', 'gap-1', 'w-full')}>
								<Select
									value={field.state.value.toString()}
									onValueChange={e => field.handleChange(e as GrossIncomeType)}
									label={'Per'}
									required
								>
									<SelectTrigger className={cn('w-full', 'sm:w-1/2')}>
										<SelectValue placeholder="Select income type" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="hourly">Hour</SelectItem>
										<SelectItem value="yearly">Year</SelectItem>
									</SelectContent>
								</Select>
								<FieldError field={field} />
							</div>
						)}
					/>
				</div>

				<div className={cn('flex', 'gap-3', 'items-start')}>
					<form.Field
						name={'hoursPerWeek'}
						validators={{
							onChange: validateHoursPerWeek,
						}}
						children={field => (
							<div className={cn('flex', 'flex-col', 'gap-1', 'w-full')}>
								<Input
									id={field.name}
									label={'Hours per week'}
									type={'number'}
									step="0.5"
									min="0"
									placeholder="0"
									value={field.state.value.toString()}
									onChange={e => field.handleChange(e.target.value)}
									required
								/>
								<FieldError field={field} />
							</div>
						)}
					/>

					<form.Field
						name={'daysPerWeek'}
						validators={{
							onChange: validateDaysPerWeek,
						}}
						children={field => (
							<div className={cn('flex', 'flex-col', 'gap-1', 'w-full')}>
								<Input
									id={field.name}
									label={'Days worked per week'}
									type={'number'}
									step="1"
									min="0"
									placeholder="0"
									value={field.state.value.toString()}
									onChange={e => field.handleChange(e.target.value)}
									required
								/>
								<FieldError field={field} />
							</div>
						)}
					/>
				</div>

				<Separator />

				<div className={cn('flex', 'flex-col', 'sm:flex-row', 'gap-3', 'items-start')}>
					{/* Province or Territory selection */}
					<form.Field
						name={'provinceCode'}
						children={field => (
							<div className={cn('flex', 'flex-col', 'gap-1', 'w-full')}>
								<Select
									label={'Province / Territory'}
									value={field.state.value ? field.state.value.toString() : ''}
									onValueChange={e => field.handleChange(e as CanadianProvinceOrTerritoryCode)}
									required
								>
									<SelectTrigger className={cn('w-full')}>
										<SelectValue placeholder="Select a province or territory" />
									</SelectTrigger>
									<SelectContent>{canadianProvinceAndTerritorySelectItems}</SelectContent>
								</Select>
								<FieldError field={field} />
							</div>
						)}
					/>

					{/* Tax year selection */}
					<form.Field
						name={'year'}
						children={field => (
							<div className={cn('flex', 'flex-col', 'gap-1', 'w-full')}>
								<Select
									label={'Year'}
									value={field.state.value ? field.state.value.toString() : ''}
									onValueChange={e => field.handleChange(parseInt(e) as TaxYear)}
									required
								>
									<SelectTrigger className={cn('w-full')}>
										<SelectValue placeholder="Select tax year" />
									</SelectTrigger>
									<SelectContent>{taxYearSelectItems}</SelectContent>
								</Select>
								<FieldError field={field} />
							</div>
						)}
					/>
				</div>
			</CardContent>
		</Card>
	);
};

const OptionalInputsCard = () => {
	const {
		hoursPerWeek,
		handleParamsChange,
	} = useIncomeCalculatorContext();

	const form = useForm({
		defaultValues: {
			overtimeHoursPerWeek: '',
			overtimeHourMultiplier: '1.5',
		},
		validators: {
			onChange: ({ value }) => handleParamsChange({
				overtimeHoursPerWeek: parseFloat(value.overtimeHoursPerWeek) || 0,
				overtimeHourMultiplier: parseFloat(value.overtimeHourMultiplier) || 0,
			}),
		},
	});

	const validateOvertimeHoursPerWeek = useCallback(({ value }: { value: string }): string | undefined => {
		if (!value) return undefined;

		if (!isGreaterThanZero(value)) return 'Please enter a valid number';
		if ((parseFloat(value) + hoursPerWeek) > 168) return 'Overtime hours per week + hours per week cannot exceed 168';
	}, [hoursPerWeek]);

	const validateOvertimeHourMultiplier = ({ value }: { value: string }): string | undefined => {
		if (!value) return undefined;

		if (!isGreaterThanZero(value)) return 'Please enter a valid number';
		if (parseFloat(value) < 1) return 'Overtime hour multiplier must be at least 1 (eg. 1.5)';
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Optional Inputs</CardTitle>
			</CardHeader>
			<CardContent className={cn('flex', 'flex-col', 'gap-3')}>

				{/* Overtime inputs */}
				<div className={cn('flex', 'gap-3')}>
					<form.Field
						name={'overtimeHoursPerWeek'}
						validators={{
							onChange: validateOvertimeHoursPerWeek,
						}}
						children={field => (
							<div className={cn('flex', 'flex-col', 'gap-1', 'w-full')}>
								<Input
									id={field.name}
									label={'Overtime hours per week'}
									type={'number'}
									step="0.5"
									min="0"
									placeholder="0"
									value={field.state.value.toString()}
									onChange={e => field.handleChange(e.target.value)}
								/>
								<FieldError field={field} />
							</div>
						)}
					/>

					<form.Field
						name={'overtimeHourMultiplier'}
						validators={{
							onChange: validateOvertimeHourMultiplier,
						}}
						children={field => (
							<div className={cn('flex', 'flex-col', 'gap-1', 'w-full')}>
								<Input
									id={field.name}
									label={'Overtime hour multiplier'}
									type={'number'}
									step="0.25"
									min="0"
									placeholder="0"
									value={field.state.value.toString()}
									onChange={e => field.handleChange(e.target.value)}
								/>
								<FieldError field={field} />
							</div>
						)}
					/>
				</div>
			</CardContent>
		</Card>
	);
};

const CompletedOutputsSection = () => {
	const { isCompleted } = useIncomeCalculatorContext();

	if (!isCompleted) return null;

	return (
		<>
			<Separator />

			<NetIncomeCard />

			<AnnualDeductionsCard />

			<FooterMessage />
		</>
	);
};

const NetIncomeCard = () => {
	const { hourlyWage, dailyWage, weeklyWage, monthlyWage, netAnnualIncome } =
		useIncomeCalculatorContext();

	const wageOutputs: { label: string; value: number }[] = [
		{ label: 'Hourly', value: hourlyWage },
		{ label: 'Daily', value: dailyWage },
		{ label: 'Weekly', value: weeklyWage },
		{ label: 'Monthly', value: monthlyWage },
		{ label: 'Yearly', value: netAnnualIncome },
	];

	const wageElements = wageOutputs.map(({ label, value }) => {
		if (!value) return null;
		const formattedValue = value.toFixed(2);
		return (
			<Input
				key={label}
				id={label}
				label={label}
				prefix={'$'}
				placeholder="0"
				value={formattedValue}
				readOnly
			/>
		);
	});

	return (
		<Card>
			<CardHeader>
				<CardTitle>Net Income</CardTitle>
			</CardHeader>
			<CardContent className={cn('flex', 'flex-col', 'gap-3')}>
				<div
					className={cn(
						'flex',
						'flex-col',
						'md:grid',
						'md:grid-cols-2',
						'lg:grid-cols-5',
						'gap-3',
					)}
				>
					{wageElements}
				</div>
			</CardContent>
		</Card>
	);
};

const AnnualDeductionsCard = () => {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Annual Deduction Breakdown</CardTitle>
			</CardHeader>
			<CardContent>
				<div className={cn('flex', 'flex-col', 'lg:flex-row', 'gap-3')}>
					<AnnualDeductionTable />

					<AnnualDeductionsBreakdownPieChart className={cn('xl:w-1/3', 'lg:w-1/2')} />
				</div>
			</CardContent>
		</Card>
	);
};

const FooterMessage = () => {
	const { monthlyWage } = useIncomeCalculatorContext();
	return (
		<div className={cn('flex', 'flex-col', 'gap-3')}>
			<p>You can use the results to create a custom budget by clicking the button below</p>
			<Button className={cn('w-fit')} asChild>
				<Link href={`/budget-planner?monthlyBudget=${monthlyWage.toFixed(2)}`}>
					Create Budget
				</Link>
			</Button>
		</div>
	);
};
