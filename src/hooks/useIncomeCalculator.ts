import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
	calculateAnnualIncomeWithHourlyWage, calculateAnnualOvertimePay, calculateHourlyIncomeWithAnnualIncome,
	calculateIncome,
	WageResults,
} from '@/lib/income-calculations';
import {
	DeductionsCalculator,
	DeductionsCalculatorParams,
	useDeductionsCalculator,
} from '@/hooks/useDeductionsCalculator';

export type GrossIncomeType = 'hourly' | 'yearly';

interface IncomeCalculatorParams {
	grossIncome: number;
	grossIncomeType: GrossIncomeType;
	hoursPerWeek: number;
	daysPerWeek: number;
	overtimeHoursPerWeek: number,
	overtimeHourMultiplier: number,
}

export interface IncomeCalculator
	extends IncomeCalculatorParams,
		Omit<WageResults, 'yearlyWage'>,
		Omit<
			DeductionsCalculator,
			'handleParamsChange' | 'resetDeductionsInput' | 'resetParams'
		> {
	isCompleted: boolean;
	grossAnnualIncome: number;
	handleParamsChange: (fields: Partial<IncomeCalculatorParams> & Partial<Pick<DeductionsCalculatorParams, 'provinceCode' | 'year'>>) => void;
	resetParams: () => void;
}

const defaultParams: IncomeCalculatorParams = {
	grossIncome: 0,
	grossIncomeType: 'hourly',
	hoursPerWeek: 37.5,
	daysPerWeek: 5,
	overtimeHoursPerWeek: 0,
	overtimeHourMultiplier: 0,
};

const defaultWages: WageResults = {
	hourlyWage: 0,
	dailyWage: 0,
	weeklyWage: 0,
	monthlyWage: 0,
	yearlyWage: 0,
};

export const useIncomeCalculator = (): IncomeCalculator => {
	const [calculatorParams, setCalculatorParams] = useState<IncomeCalculatorParams>(defaultParams);
	const [wageResults, setWageResults] = useState<WageResults>(defaultWages);

	// Hook for calculating deductions and net income
	const {
		isCompleted: isTaxCompleted,
		provinceCode,
		year,
		handleParamsChange: handleDeductionsParamsChange,
		resetParams: resetDeductionsParams,
		...deductionsResults
	} = useDeductionsCalculator();

	// Handlers for input changes

	// When gross income type changes, reset gross income to 0
	useEffect(() => {
		setCalculatorParams(prevState => ({
			...prevState,
			grossIncome: 0,
		}));
	}, [calculatorParams.grossIncomeType]);

	// Generic handler for input changes
	const handleParamsChange = React.useCallback(
		(fields: Partial<IncomeCalculatorParams> & Partial<Pick<DeductionsCalculatorParams, 'provinceCode' | 'year'>>) => {
			setCalculatorParams(prevState => ({
				...prevState,
				...fields,
			}));
			handleDeductionsParamsChange({
				provinceCode: fields.provinceCode,
				year: fields.year,
			});
		},
		[handleDeductionsParamsChange],
	);

	// Reset input to default values
	const resetParams = useCallback(() => {
		setCalculatorParams(defaultParams);
		resetDeductionsParams();
	}, [resetDeductionsParams]);

	// Reset output to default values
	const resetOutput = useCallback(() => setWageResults(defaultWages), []);

	// Recalculate taxable income when input changes
	useEffect(() => {
		if (
			calculatorParams.grossIncome <= 0 ||
			calculatorParams.hoursPerWeek <= 0 ||
			calculatorParams.daysPerWeek <= 0
		) {
			resetOutput();
			return;
		}

		const {
			grossIncomeType,
			grossIncome,
			hoursPerWeek,
			overtimeHoursPerWeek,
			overtimeHourMultiplier,
		} = calculatorParams;

		const hourlyWage = grossIncomeType === 'hourly' ? grossIncome : calculateHourlyIncomeWithAnnualIncome(grossIncome, hoursPerWeek);
		const overtimePay = calculateAnnualOvertimePay(hourlyWage, overtimeHoursPerWeek, overtimeHourMultiplier);
		const taxableAnnualIncome = calculateAnnualIncomeWithHourlyWage(hourlyWage, hoursPerWeek) + overtimePay;

		handleDeductionsParamsChange({grossAnnualIncome: taxableAnnualIncome});
	}, [
		calculatorParams,
		calculatorParams.grossIncome,
		calculatorParams.hoursPerWeek,
		calculatorParams.daysPerWeek,
		resetOutput,
		handleDeductionsParamsChange,
	]);

	// Recalculate output when input or tax info changes
	useEffect(() => {
		const newState = calculateIncome(
			deductionsResults.netAnnualIncome,
			calculatorParams.hoursPerWeek,
			calculatorParams.daysPerWeek,
		);
		setWageResults(newState);
	}, [
		deductionsResults.netAnnualIncome,
		calculatorParams.hoursPerWeek,
		calculatorParams.daysPerWeek,
		setWageResults,
	]);

	// Determine if the calculator inputs are all filled out
	const isCompleted = useMemo(
		() =>
			isTaxCompleted &&
			calculatorParams.grossIncome > 0 &&
			calculatorParams.hoursPerWeek > 0 &&
			calculatorParams.daysPerWeek > 0,
		[isTaxCompleted, calculatorParams],
	);

	return {
		...calculatorParams,
		...wageResults,
		...deductionsResults,
		provinceCode,
		year,
		isCompleted,
		resetParams: resetParams,
		handleParamsChange,
	};
};
