import {CanadianProvinceOrTerritoryCode} from '@/lib/canadian-provinces';
import React, {useEffect} from 'react';
import {TaxYear} from '@/lib/deductions/canadian-deductions.types';
import {calculatePayrollDeductions, PayrollDeductionsResult} from '@/lib/deductions/canadian-deductions';

export interface DeductionsCalculator extends PayrollDeductionsResult {
	isCompleted: boolean;
	provinceCode: CanadianProvinceOrTerritoryCode | null;
	year: TaxYear | null;
	netAnnualIncome: number;
	handleAnnualIncomeChange: (value: string | undefined) => void;
	handleProvinceCodeChange: (value: string | undefined) => void;
	handleYearChange: (value: string | undefined) => void;
}

export function useDeductionsCalculator(): DeductionsCalculator {
	const [annualIncome, setAnnualIncome] = React.useState<number | null>(null);
	const handleAnnualIncomeChange = React.useCallback((value: string | undefined) => {
		const parsedValue = value ? parseFloat(value) : null;
		setAnnualIncome(parsedValue);
	}, [])

	const [provinceCode, setProvinceCode] = React.useState<CanadianProvinceOrTerritoryCode | null>(null);
	const handleProvinceCodeChange = React.useCallback((value: string | undefined) => {
		setProvinceCode(value as CanadianProvinceOrTerritoryCode ?? null);
	}, [])

	const [year, setYear] = React.useState<TaxYear | null>(null);
	const handleYearChange = React.useCallback((value: string | undefined) => {
		const parsedValue = value ? parseInt(value) as TaxYear : null;
		setYear(parsedValue);
	}, [])

	const defaultOutputs: PayrollDeductionsResult & Pick<DeductionsCalculator, "netAnnualIncome"> = {
		totalFederalTax: 0,
		totalProvincialTax: 0,
		totalTax: 0,
		netAnnualIncome: 0,
		cppContribution: 0,
		eiPremium: 0,
		qpipPremium: 0,
		totalContributions: 0,
		totalDeductions: 0
	}
	const [outputs, setOutputs] = React.useState(defaultOutputs);

	useEffect(() => {
		if (!annualIncome || !provinceCode || !year) return

		const deductionResults = calculatePayrollDeductions(annualIncome, provinceCode, year);
		console.log("Deduction Results:", deductionResults);
		const netAnnualIncome = annualIncome - (deductionResults.totalDeductions);
		setOutputs({...deductionResults, netAnnualIncome});
	}, [annualIncome, provinceCode, year, setOutputs]);

	useEffect(() => {
		console.log("Tax Calculator State Changed:", outputs);
	}, []);

	const isCompleted = annualIncome !== null && provinceCode !== null && year !== null;

	return  {
		...outputs,
		isCompleted,
		provinceCode,
		year,
		handleAnnualIncomeChange,
		handleProvinceCodeChange,
		handleYearChange,
	};
}