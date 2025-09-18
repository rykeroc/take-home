import {describe, expect, it} from '@jest/globals';
import {
	calculateFederalTax,
	calculateProvincialTax,
	calculateCanadianTaxes,
	TaxYear, TaxCalculationResult
} from '@/lib/deductions/canadian-tax-calculator';
import {CanadianProvinceOrTerritoryCode} from '@/lib/canadian-provinces';

type ProvincialInput = {
	income: number
	provinceCode: CanadianProvinceOrTerritoryCode
	year: TaxYear
}

type FederalInput = Omit<ProvincialInput, 'provinceCode'>

type TotalInput = ProvincialInput

describe('CanadianTaxCalculator', () => {
	describe('Federal tax', () => {
		it('should result in 0 tax for income of 0', () => {
			const input = { income: 0, year: 2025 } as FederalInput;
			const expected = 0;
			const result = calculateFederalTax(input.income, input.year);
			expect(result).toBe(expected);
		})

		it('should calculate federal tax for income of 60000 in 2025', () => {
			const input = { income: 60000, year: 2025 } as FederalInput;
			const expected = 8857.5; // 15% on the first $53,359 and 20.5% on the remaining $6,641
			const result = calculateFederalTax(input.income, input.year);
			expect(result).toBe(expected);
		})

		it('should calculate federal tax for income of 200000 in 2025', () => {
			const input = {income: 200000, year: 2025} as FederalInput;
			const expected = 39090.625; // 15% on the first $53,359, 20.5% on the next $53,359, 26% on the next $58,713 and 29% on the remaining $34,569
			const result = calculateFederalTax(input.income, input.year);
			expect(result).toBe(expected);
		})
	})

	describe('Provincial tax', () => {
		it('should result in 0 tax for income of 0', () => {
			const input = { income: 0, provinceCode: 'AB', year: 2025 } as ProvincialInput;
			const expected = 0;
			const result = calculateProvincialTax(input.income, input.provinceCode, input.year);
			expect(result).toBe(expected);
		})

		it('should calculate AB provincial tax for income of 20000 in 2025', () => {
			const input = { income: 20000, provinceCode: 'AB', year: 2025 } as ProvincialInput;
			const expected = 1600; // 8% on the first $30,000
			const result = calculateProvincialTax(input.income, input.provinceCode, input.year);
			expect(result).toBe(expected);
		})

		it('should calculate ON provincial tax for income of 60000 in 2025', () => {
			const input = { income: 60000, provinceCode: 'ON', year: 2025 } as ProvincialInput;
			const expected = 3321.6740000000004; // 5.05% on the first $49,231 and 9.15% on the remaining $10,769
			const result = calculateProvincialTax(input.income, input.provinceCode, input.year);
			expect(result).toBe(expected);
		})
	})

	describe('Total tax', () => {
		it('should result in 0 tax for income of 0', () => {
			const input = { income: 0, provinceCode: 'AB', year: 2025 } as TotalInput;
			const expected = { totalFederalTax: 0, totalProvincialTax: 0, totalTax: 0 } as TaxCalculationResult;
			const result = calculateCanadianTaxes(input.income, input.provinceCode, input.year);
			expect(result).toEqual(expected);
		})

		it('should calculate total tax for AB for income of 20000 in 2025', () => {
			const input = { income: 20000, provinceCode: 'AB', year: 2025 } as TotalInput;
			const expected = { totalFederalTax: 2900, totalProvincialTax: 1600, totalTax: 4500 } as TaxCalculationResult;
			const result = calculateCanadianTaxes(input.income, input.provinceCode, input.year);
			expect(result).toEqual(expected);
		})

		it('should calculate total tax for ON for income of 60000 in 2025', () => {
			const input = { income: 60000, provinceCode: 'ON', year: 2025 } as TotalInput;
			const expected = { totalFederalTax: 8857.5, totalProvincialTax: 3321.6740000000004, totalTax: 12179.174000000001 } as TaxCalculationResult;
			const result = calculateCanadianTaxes(input.income, input.provinceCode, input.year);
			expect(result).toEqual(expected);
		})
	})
})