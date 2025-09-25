import { CanadianProvinceOrTerritoryCode } from '@/lib/canadian-provinces';
import React, { useEffect } from 'react';
import { TaxYear } from '@/lib/deductions/canadian-deductions.types';
import {
	calculatePayrollDeductions,
	PayrollDeductionsResult,
} from '@/lib/deductions/canadian-deductions';

export interface DeductionsCalculator extends PayrollDeductionsResult {
	isCompleted: boolean;
	provinceCode: CanadianProvinceOrTerritoryCode | null;
	year: TaxYear | null;
	netAnnualIncome: number;
	grossAnnualIncome: number;
	handleGrossAnnualIncomeChange: (value: string | undefined) => void;
	handleProvinceCodeChange: (value: string | undefined) => void;
	handleYearChange: (value: string | undefined) => void;
	resetInputs: () => void;
}

interface DeductionsCalculatorParams {
	grossAnnualIncome: number;
	provinceCode: CanadianProvinceOrTerritoryCode | null;
	year: TaxYear | null;
}

const defaultParams: DeductionsCalculatorParams = {
	grossAnnualIncome: 0,
	provinceCode: null,
	year: null,
};

const defaultOutputs: PayrollDeductionsResult & Pick<DeductionsCalculator, 'netAnnualIncome'> = {
	totalFederalTax: 0,
	totalProvincialTax: 0,
	totalTax: 0,
	netAnnualIncome: 0,
	cppContribution: 0,
	eiPremium: 0,
	qpipPremium: 0,
	totalContributions: 0,
	totalDeductions: 0,
};

export function useDeductionsCalculator(): DeductionsCalculator {
	const [params, setParams] = React.useState<DeductionsCalculatorParams>(defaultParams);

	// Input handlers
	const handleGrossAnnualIncomeChange = React.useCallback((value: string | undefined) => {
		const parsedValue = value ? parseFloat(value) : 0;
		setParams(prev => ({ ...prev, grossAnnualIncome: parsedValue }));
	}, []);

	const handleProvinceCodeChange = React.useCallback((value: string | undefined) => {
		setParams(prev => ({
			...prev,
			provinceCode: (value as CanadianProvinceOrTerritoryCode) ?? null,
		}));
	}, []);

	const handleYearChange = React.useCallback((value: string | undefined) => {
		const parsedValue = value ? (parseInt(value) as TaxYear) : null;
		setParams(prev => ({ ...prev, year: parsedValue }));
	}, []);

	const resetInputs = React.useCallback(() => {
		setParams(defaultParams);
	}, [setParams]);

	const [outputs, setOutputs] = React.useState(defaultOutputs);

	// Recalculate outputs when inputs change
	useEffect(() => {
		if (!params.grossAnnualIncome || !params.provinceCode || !params.year) return;

		const deductionResults = calculatePayrollDeductions(
			params.grossAnnualIncome,
			params.provinceCode,
			params.year,
		);
		const netAnnualIncome = params.grossAnnualIncome - deductionResults.totalDeductions;

		setOutputs({ ...deductionResults, netAnnualIncome });
	}, [params.grossAnnualIncome, params.provinceCode, params.year, setOutputs]);

	// Is the form completed
	const isCompleted =
		params.grossAnnualIncome !== null && params.provinceCode !== null && params.year !== null;

	return {
		isCompleted,
		...params,
		...outputs,
		handleGrossAnnualIncomeChange,
		handleProvinceCodeChange,
		handleYearChange,
		resetInputs,
	};
}
