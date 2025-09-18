import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
	calculateAnnualIncomeWithHourlyWage, calculateIncome,
	WageResults
} from '@/components/lib/income-calculations';
import {DeductionsCalculator, useDeductionsCalculator} from '@/hooks/useDeductionsCalculator';

export type GrossIncomeType = 'hourly' | 'yearly';

interface IncomeCalculatorInput {
	grossIncome: number;
	grossIncomeType: GrossIncomeType
	hoursPerWeek: number;
	daysPerWeek: number;
}

interface IncomeCalculator extends IncomeCalculatorInput, WageResults, Omit<DeductionsCalculator, "netAnnualIncome" | "handleGrossAnnualIncomeChange" | "resetDeductionsInput" | "resetInputs"> {
	isCompleted: boolean;
	grossAnnualIncome: number;
	handleInputChange: (field: keyof IncomeCalculatorInput, value: string | undefined) => void;
	handleInputGrossIncomeTypeChange: (amountType: GrossIncomeType) => void;
	resetInput: () => void
}

export const useIncomeCalculator = (): IncomeCalculator => {
	const defaultInput: IncomeCalculatorInput = useMemo(() => ({
		grossIncome: 0,
		grossIncomeType: 'hourly',
		hoursPerWeek: 37.5,
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
		handleGrossAnnualIncomeChange,
		handleProvinceCodeChange,
		handleYearChange,
		resetInputs: resetDeductionsInput,
		...deductionsResults
	} = useDeductionsCalculator();

	const handleInputGrossIncomeTypeChange = React.useCallback((amountType: GrossIncomeType) =>
		setCalculatorInput(prevState => ({...prevState, grossIncomeType: amountType, grossIncome: 0})), [])

	const handleInputChange = React.useCallback((field: keyof IncomeCalculatorInput, value: string | undefined) => {
		if (!value) {
			setCalculatorInput(prevState => ({...prevState, [field]: 0}))
			return;
		}

		let numericValue = parseFloat(value);
		if (isNaN(numericValue)) numericValue = 0;

		setCalculatorInput(prevState => ({...prevState, [field]: numericValue}))
	}, [])

	const resetInput = useCallback(() => {
		setCalculatorInput(defaultInput)
		resetDeductionsInput()
	}, [defaultInput, resetDeductionsInput])

	const resetOutput = useCallback(() => setWageResults(defaultWages), [defaultWages])

	// Recalculate taxable income when input changes
	useEffect(() => {
		if (calculatorInput.grossIncome <= 0 || calculatorInput.hoursPerWeek <= 0 || calculatorInput.daysPerWeek <= 0) {
			resetOutput()
			return;
		}

		// Calculate annual income for tax calculations
		const taxableAnnualIncome = (calculatorInput.grossIncomeType === "hourly")
			? calculateAnnualIncomeWithHourlyWage(calculatorInput.grossIncome, calculatorInput.hoursPerWeek)
			: calculatorInput.grossIncome

		handleGrossAnnualIncomeChange(taxableAnnualIncome.toString())
	}, [calculatorInput.grossIncomeType, calculatorInput.grossIncome, calculatorInput.hoursPerWeek, calculatorInput.daysPerWeek, resetOutput, handleGrossAnnualIncomeChange])

	// Recalculate output when input or tax info changes
	useEffect(() => {
		const newState = calculateIncome(deductionsResults.netAnnualIncome, calculatorInput.hoursPerWeek, calculatorInput.daysPerWeek)
		setWageResults(newState)
	}, [deductionsResults.netAnnualIncome, calculatorInput.hoursPerWeek, calculatorInput.daysPerWeek, setWageResults]);

	const isCompleted = isTaxCompleted && calculatorInput.grossIncome > 0 && calculatorInput.hoursPerWeek > 0 && calculatorInput.daysPerWeek > 0

	return {
		...calculatorInput,
		provinceCode,
		year,
		...wageResults,
		isCompleted,
		resetInput,
		handleInputChange,
		handleInputGrossIncomeTypeChange,
		handleProvinceCodeChange,
		handleYearChange,
		...deductionsResults
	}
}