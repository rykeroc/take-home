import {calculateCanadianTaxes, TaxYear} from '@/lib/taxes/canadian-tax-calculator';
import {CanadianProvinceOrTerritoryCode} from '@/lib/canadian-provinces';
import React, {useEffect} from 'react';

export interface TaxCalculator extends ReturnType<typeof calculateCanadianTaxes> {
	isCompleted: boolean;
	provinceCode: CanadianProvinceOrTerritoryCode | null;
	year: TaxYear | null;
	netAnnualIncome: number;
	handleAnnualIncomeChange: (value: string | undefined) => void;
	handleProvinceCodeChange: (value: string | undefined) => void;
	handleYearChange: (value: string | undefined) => void;
}

export function useTaxCalculator(): TaxCalculator {
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

	const defaultOutputs = {
		totalFederalTax: 0,
		totalProvincialTax: 0,
		totalTax: 0,
		netAnnualIncome: 0,
	}
	const [outputs, setOutputs] = React.useState(defaultOutputs);

	useEffect(() => {
		if (!annualIncome || !provinceCode || !year) return

		const taxResults = calculateCanadianTaxes(annualIncome, provinceCode, year);
		const netAnnualIncome = annualIncome - taxResults.totalTax;
		setOutputs({...taxResults, netAnnualIncome});
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