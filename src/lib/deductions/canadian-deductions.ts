import * as federalTaxData from './data/canadian-federal-taxes.json'
import * as provincialTaxData from './data/canadian-provincial-taxes.json'
import * as cppQppData from './data/canadian-cpp-qpp.json'
import * as eiQpipData from './data/canadian-ei-qpip.json'
import {CanadianProvinceOrTerritoryCode} from '@/lib/canadian-provinces';
import {
	CppQppData,
	EiQpipData,
	FederalTaxData,
	ProvincialTaxData,
	TaxBracket,
	TaxYear
} from '@/lib/deductions/canadian-deductions.types';

// Calculate tax rate using the progressive system
function calculateProgressiveTax(income: number, brackets: TaxBracket[]): number {
	let totalTax = 0;
	let previousBracketLimit = 0;

	for (const bracket of brackets) {
		const currentBracketLimit = bracket.incomeUpTo ?? income;

		if (income > previousBracketLimit) {
			const taxableInBracket = Math.min(income, currentBracketLimit) - previousBracketLimit;
			totalTax += taxableInBracket * bracket.rate;
		}

		if (income <= currentBracketLimit) {
			break; // No need to check higher brackets
		}

		previousBracketLimit = currentBracketLimit;
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

/**
 * Calculates CPP (Canada Pension Plan) or QPP (Quebec Pension Plan) contributions.
 */
export function calculateCppQpp(income: number, provinceCode: CanadianProvinceOrTerritoryCode, year: TaxYear): number {
	const dataKey = provinceCode === 'QC' ? 'QC' : 'ROC'
	const data = (cppQppData as unknown as CppQppData)[year][dataKey];

	if (income <= data.basicExemption) {
		return 0;
	}

	// Calculate base contribution (up to YMPE)
	const basePensionableEarnings = Math.min(income, data.ympe) - data.basicExemption;
	const baseContribution = Math.max(0, basePensionableEarnings) * data.rate;

	// Calculate second additional contribution (CPP2/QPP2) if income exceeds YMPE
	let secondContribution = 0;
	if (income > data.ympe) {
		const secondPensionableEarnings = Math.min(income, data.yampe) - data.ympe;
		secondContribution = Math.max(0, secondPensionableEarnings) * data.rate2;
	}

	return baseContribution + secondContribution;
}

/**
 * Calculates EI (Employment Insurance) and QPIP (Quebec Parental Insurance Plan) premiums.
 * Returns an object as QPIP is a separate deduction for Quebec residents.
 */
export function calculateEiQpip(income: number, provinceCode: CanadianProvinceOrTerritoryCode, year: TaxYear): { eiPremium: number; qpipPremium: number } {
	const data = (eiQpipData as unknown as EiQpipData)[year];

	if (provinceCode === 'QC') {
		const eiInsurableEarnings = Math.min(income, data.QC.ei.mie);
		const qpipInsurableEarnings = Math.min(income, data.QC.qpip.mie);

		return {
			eiPremium: eiInsurableEarnings * data.QC.ei.rate,
			qpipPremium: qpipInsurableEarnings * data.QC.qpip.rate,
		};
	} else {
		const eiInsurableEarnings = Math.min(income, data.ROC.mie);
		return {
			eiPremium: eiInsurableEarnings * data.ROC.rate,
			qpipPremium: 0,
		};
	}
}

export interface PayrollDeductionsResult {
	totalFederalTax: number
	totalProvincialTax: number
	totalTax: number
	cppContribution: number
	eiPremium: number
	qpipPremium: number
	totalContributions: number
	totalDeductions: number
}

/**
 * Main function to calculate all Canadian payroll deductions (taxes + contributions).
 */
export function calculatePayrollDeductions(taxableIncome: number, provinceCode: CanadianProvinceOrTerritoryCode, year: TaxYear): PayrollDeductionsResult {
	// Calculate income taxes
	const totalFederalTax = calculateFederalTax(taxableIncome, year);
	const totalProvincialTax = calculateProvincialTax(taxableIncome, provinceCode, year);
	const totalTax = totalFederalTax + totalProvincialTax;

	// Calculate contributions
	const cppContribution = calculateCppQpp(taxableIncome, provinceCode, year);
	const { eiPremium, qpipPremium } = calculateEiQpip(taxableIncome, provinceCode, year);
	const totalContributions = cppContribution + eiPremium + qpipPremium;

	const totalDeductions = totalTax + totalContributions

	return {
		cppContribution,
		eiPremium,
		qpipPremium,
		totalContributions,
		totalFederalTax,
		totalProvincialTax,
		totalTax,
		totalDeductions
	}
}

