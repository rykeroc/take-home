import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
	calculateAnnualIncomeWithHourlyWage, calculateIncome,
	WageResults
} from '@/components/lib/income-calculations';
import {DeductionsCalculator, useDeductionsCalculator} from '@/hooks/useDeductionsCalculator';

export type IncomeCalculatorAmountType = 'hourly' | 'yearly';

interface IncomeCalculatorInput {
	amount: number;
	amountType: IncomeCalculatorAmountType
	hoursPerWeek: number;
	daysPerWeek: number;
}

interface IncomeCalculator extends IncomeCalculatorInput, WageResults, Omit<DeductionsCalculator, "netAnnualIncome" | "handleAnnualIncomeChange"> {
	isCompleted: boolean;
	handleInputChange: (field: keyof IncomeCalculatorInput, value: string | undefined) => void;
	handleInputModeChange: (amountType: IncomeCalculatorAmountType) => void;
	resetInput: () => void
}

export const useIncomeCalculator = (): IncomeCalculator => {
	const defaultInput: IncomeCalculatorInput = useMemo(() => ({
		amount: 0,
		amountType: 'hourly',
		hoursPerWeek: 40,
		daysPerWeek: 5,
	}), [])
	const [calculatorInput, setCalculatorInput] = useState<IncomeCalculatorInput>(defaultInput)

	const defaultWages: WageResults = useMemo(() => ({
		hourlyWage: 0,
		dailyWage: 0,
		weeklyWage: 0,
		monthlyWage: 0,
		yearlyWage: 0,
	}), [])
	const [wageResults, setWageResults] = useState<WageResults>(defaultWages)

	const {
		isCompleted: isTaxCompleted,
		provinceCode,
		year,
		handleAnnualIncomeChange,
		handleProvinceCodeChange,
		handleYearChange,
		...defuctionsResults
	} = useDeductionsCalculator();

	const handleInputModeChange = React.useCallback((amountType: IncomeCalculatorAmountType) =>
		setCalculatorInput(prevState => ({...prevState, amountType, amount: 0})), [])

	const handleInputChange = React.useCallback((field: keyof IncomeCalculatorInput, value: string | undefined) => {
		if (!value) {
			setCalculatorInput(prevState => ({...prevState, [field]: 0}))
			return;
		}

		let numericValue = parseFloat(value);
		if (isNaN(numericValue)) numericValue = 0;

		setCalculatorInput(prevState => ({...prevState, [field]: numericValue}))
	}, [])

	const resetInput = useCallback(() => setCalculatorInput(defaultInput), [defaultInput])

	const resetOutput = useCallback(() => setWageResults(defaultWages), [defaultWages])

	// Recalculate taxable income when input changes
	useEffect(() => {
		if (calculatorInput.amount <= 0 || calculatorInput.hoursPerWeek <= 0 || calculatorInput.daysPerWeek <= 0) {
			resetOutput()
			return;
		}

		// Calculate annual income for tax calculations
		const taxableAnnualIncome = (calculatorInput.amountType === "hourly")
			? calculateAnnualIncomeWithHourlyWage(calculatorInput.amount, calculatorInput.hoursPerWeek)
			: calculatorInput.amount

		handleAnnualIncomeChange(taxableAnnualIncome.toString())
	}, [calculatorInput.amountType, calculatorInput.amount, calculatorInput.hoursPerWeek, calculatorInput.daysPerWeek, resetOutput, handleAnnualIncomeChange])

	// Recalculate output when input or tax info changes
	useEffect(() => {
		const newState = calculateIncome(defuctionsResults.netAnnualIncome, calculatorInput.hoursPerWeek, calculatorInput.daysPerWeek)
		setWageResults(newState)
	}, [defuctionsResults.netAnnualIncome, calculatorInput.hoursPerWeek, calculatorInput.daysPerWeek, setWageResults]);

	const isCompleted = isTaxCompleted && calculatorInput.amount > 0 && calculatorInput.hoursPerWeek > 0 && calculatorInput.daysPerWeek > 0

	return {
		...calculatorInput,
		provinceCode,
		year,
		...wageResults,
		isCompleted,
		resetInput,
		handleInputChange,
		handleInputModeChange,
		handleProvinceCodeChange,
		handleYearChange,
		...defuctionsResults
	}
}