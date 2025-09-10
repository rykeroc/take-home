import {useEffect, useState} from 'react';
import {
	calculateIncomeWithHourlyWage, calculateIncomeWithYearlyWage,
	HourlyWageResults,
	YearlyWageResults
} from '@/components/lib/income-calculations';

export type IncomeCalculatorAmountType = 'hourly' | 'yearly';

interface IncomeCalculatorInput {
	amount: number;
	amountType: IncomeCalculatorAmountType
	hoursPerWeek: number;
	daysPerWeek: number;
}

type IncomeCalculatorOutput = HourlyWageResults & YearlyWageResults

interface IncomeCalculator extends IncomeCalculatorInput, IncomeCalculatorOutput{
	handleInputChange: (field: keyof IncomeCalculatorInput, value: string | undefined) => void;
	handleInputModeChange: (amountType: IncomeCalculatorAmountType) => void;
	resetInput: () => void
}

export const useIncomeCalculator = (): IncomeCalculator => {
	const defaultInput: IncomeCalculatorInput = {
		amount: 0,
		amountType: 'hourly',
		hoursPerWeek: 40,
		daysPerWeek: 5,
	}
	const [inputState, setInputState] = useState<IncomeCalculatorInput>(defaultInput)

	const defaultOutput: IncomeCalculatorOutput = {
		hourlyWage: 0,
		dailyWage: 0,
		weeklyWage: 0,
		monthlyWage: 0,
		yearlyWage: 0,
	}
	const [outputState, setOutputState] = useState<IncomeCalculatorOutput>(defaultOutput)

	const handleInputModeChange = (amountType: IncomeCalculatorAmountType) =>
		setInputState({...inputState, amountType, amount: 0})

	const handleInputChange = (field: keyof IncomeCalculatorInput, value: string | undefined) => {
		if (!value) {
			setInputState({...inputState, [field]: 0})
			return;
		}

		let numericValue = parseFloat(value);
		if (isNaN(numericValue)) numericValue = 0;

		setInputState({...inputState, [field]: numericValue})
	}

	const resetInput = () => setInputState(defaultInput)

	const resetOutput = () => setOutputState(defaultOutput)

	// Recalculate output values whenever input state changes
	useEffect(() => {
		if (inputState.amount <= 0 || inputState.hoursPerWeek <= 0 || inputState.daysPerWeek <= 0) {
			resetOutput()
			return;
		}

		const newState = (inputState.amountType === "hourly")
			? calculateIncomeWithHourlyWage(inputState.amount, inputState.hoursPerWeek, inputState.daysPerWeek)
			: calculateIncomeWithYearlyWage(inputState.amount, inputState.hoursPerWeek, inputState.daysPerWeek)

		setOutputState((prevState) => {
			return {...prevState, ...newState}
		})
	}, [inputState.amountType, inputState.amount, inputState.hoursPerWeek, inputState.daysPerWeek, setOutputState])

	useEffect(() => {
		console.log(outputState)
	}, [outputState]);
	return {
		...inputState,
		...outputState,
		resetInput,
		handleInputChange,
		handleInputModeChange,
	}
}