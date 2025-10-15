import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
	calculateAnnualIncomeWithHourlyWage, calculateAnnualOvertimePay, calculateHourlyIncomeWithAnnualIncome,
	calculateIncome,
	WageResults,
} from '@/lib/income-calculations';
import { DeductionsCalculator, useDeductionsCalculator } from '@/hooks/useDeductionsCalculator';

export type GrossIncomeType = 'hourly' | 'yearly';

interface IncomeCalculatorInput {
	grossIncome: number;
	grossIncomeType: GrossIncomeType;
	hoursPerWeek: number;
	daysPerWeek: number;
	overtimeHoursPerWeek: number,
	overtimeHourMultiplier: number,
}

export interface IncomeCalculator
	extends IncomeCalculatorInput,
		Omit<WageResults, 'yearlyWage'>,
		Omit<
			DeductionsCalculator,
			'handleGrossAnnualIncomeChange' | 'resetDeductionsInput' | 'resetInputs'
		> {
	isCompleted: boolean;
	grossAnnualIncome: number;
	handleInputChange: (field: keyof IncomeCalculatorInput, value: string | undefined) => void;
	handleGrossIncomeTypeChange: (amountType: GrossIncomeType) => void;
	resetInput: () => void;
}

const defaultInput: IncomeCalculatorInput = {
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
	const [calculatorInput, setCalculatorInput] = useState<IncomeCalculatorInput>(defaultInput);
	const [wageResults, setWageResults] = useState<WageResults>(defaultWages);

	// Hook for calculating deductions and net income
	const {
		isCompleted: isTaxCompleted,
		provinceCode,
		year,
		handleGrossAnnualIncomeChange,
		handleProvinceCodeChange,
		handleYearChange,
		resetInputs: resetDeductionsInput,
		...deductionsResults
	} = useDeductionsCalculator();

	// Handlers for input changes

	// When gross income type changes, reset gross income to 0
	const handleGrossIncomeTypeChange = React.useCallback(
		(amountType: GrossIncomeType) =>
			setCalculatorInput(prevState => ({
				...prevState,
				grossIncomeType: amountType,
				grossIncome: 0,
			})),
		[],
	);

	// Generic handler for input changes
	const handleInputChange = React.useCallback(
		(field: keyof IncomeCalculatorInput, value: string | undefined) => {
			if (!value) {
				setCalculatorInput(prevState => ({
					...prevState,
					[field]: 0,
				}));
				return;
			}

			let numericValue = parseFloat(value);
			if (isNaN(numericValue)) numericValue = 0;

			setCalculatorInput(prevState => ({
				...prevState,
				[field]: numericValue,
			}));
		},
		[],
	);

	// Reset input to default values
	const resetInput = useCallback(() => {
		setCalculatorInput(defaultInput);
		resetDeductionsInput();
	}, [resetDeductionsInput]);

	// Reset output to default values
	const resetOutput = useCallback(() => setWageResults(defaultWages), []);

	// Recalculate taxable income when input changes
	useEffect(() => {
		if (
			calculatorInput.grossIncome <= 0 ||
			calculatorInput.hoursPerWeek <= 0 ||
			calculatorInput.daysPerWeek <= 0
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
		} = calculatorInput;

		const hourlyWage = grossIncomeType === 'hourly' ? grossIncome : calculateHourlyIncomeWithAnnualIncome(grossIncome, hoursPerWeek);
		const overtimePay = calculateAnnualOvertimePay(hourlyWage, overtimeHoursPerWeek, overtimeHourMultiplier);

		let taxableAnnualIncome = calculateAnnualIncomeWithHourlyWage(hourlyWage, hoursPerWeek) + overtimePay;

		handleGrossAnnualIncomeChange(taxableAnnualIncome.toString());
	}, [
		calculatorInput.grossIncomeType,
		calculatorInput.grossIncome,
		calculatorInput.hoursPerWeek,
		calculatorInput.daysPerWeek,
		calculatorInput.overtimeHoursPerWeek,
		calculatorInput.overtimeHourMultiplier,
		resetOutput,
		handleGrossAnnualIncomeChange,
	]);

	// Recalculate output when input or tax info changes
	useEffect(() => {
		const newState = calculateIncome(
			deductionsResults.netAnnualIncome,
			calculatorInput.hoursPerWeek,
			calculatorInput.daysPerWeek,
		);
		setWageResults(newState);
	}, [
		deductionsResults.netAnnualIncome,
		calculatorInput.hoursPerWeek,
		calculatorInput.daysPerWeek,
		setWageResults,
	]);

	// Determine if the calculator inputs are all filled out
	const isCompleted = useMemo(
		() =>
			isTaxCompleted &&
			calculatorInput.grossIncome > 0 &&
			calculatorInput.hoursPerWeek > 0 &&
			calculatorInput.daysPerWeek > 0,
		[isTaxCompleted, calculatorInput],
	);

	return {
		...calculatorInput,
		...wageResults,
		...deductionsResults,
		provinceCode,
		year,
		isCompleted,
		resetInput,
		handleInputChange,
		handleGrossIncomeTypeChange,
		handleProvinceCodeChange,
		handleYearChange,
	};
};
