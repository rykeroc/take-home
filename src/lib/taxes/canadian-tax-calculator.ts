import * as federalTaxData from './canadian-federal-taxes.json'
import * as provincialTaxData from './canadian-provincial-taxes.json'
import {CanadianProvinceOrTerritoryCode} from '@/lib/canadian-provinces';

const TaxYears = [
	2025
] as const

export type TaxYear = typeof TaxYears[number]

type TaxBracket = {
	incomeUpTo: number | null
	rate: number
}

type FederalTaxData = Record<TaxYear, TaxBracket[]>

type ProvinceTaxBrackets = Record<CanadianProvinceOrTerritoryCode, TaxBracket[]>

type ProvincialTaxData = Record<TaxYear, ProvinceTaxBrackets>

export interface TaxCalculationResult {
	totalFederalTax: number
	totalProvincialTax: number
	totalTax: number
}

// Calculate tax rate using the progressive system
function calculateProgressiveTax(income: number, brackets: TaxBracket[]): number {
	let remainingIncome = income;
	let totalTax = 0;

	for (const bracket of brackets) {
		// If incomeUpTo is null or remaining income falls into the bracket limit, it means this is the max bracket
		// So we tax all remaining income at this rate
		if (bracket.incomeUpTo === null || remainingIncome <= bracket.incomeUpTo) {
			totalTax += remainingIncome * bracket.rate;
			break;
		}
		// Otherwise, we tax the full amount of this bracket and continue to the next
		else {
			const taxableAmount = bracket.incomeUpTo;
			totalTax += taxableAmount * bracket.rate;
			remainingIncome -= taxableAmount;
		}
	}

	return totalTax;
}

export function calculateFederalTax(income: number, year: TaxYear): number {
	const brackets = (federalTaxData as unknown as FederalTaxData)[year];
	return calculateProgressiveTax(income, brackets);
}

export function calculateProvincialTax(income: number, provinceCode: CanadianProvinceOrTerritoryCode, year: TaxYear): number {
	const brackets = (provincialTaxData as unknown as ProvincialTaxData)[year][provinceCode];
	return calculateProgressiveTax(income, brackets);
}

// Main function to calculate total Canadian taxes (federal + provincial)
export function calculateCanadianTaxes(taxableIncome: number, provinceCode: CanadianProvinceOrTerritoryCode, year: TaxYear): TaxCalculationResult {
    // Calculate federal tax on income
	const totalFederalTax = calculateFederalTax(taxableIncome, year);

	// Calculate provincial tax on income
	const totalProvincialTax = calculateProvincialTax(taxableIncome, provinceCode, year);

	return {
		totalFederalTax,
		totalProvincialTax,
		totalTax: totalFederalTax + totalProvincialTax
	}
}


