import { describe, expect, it } from '@jest/globals';
import {
	calculateAnnualIncomeWithHourlyWage,
	calculateAnnualOvertimePay,
	calculateHourlyIncomeWithAnnualIncome,
} from '@/lib/income-calculations';

describe('income-calculations', () => {
	describe('calculateAnnualIncomeWithHourlyWage', () => {
		it('should return 65000 per year for 31.25 per hour', () => {
			const input = {
				hourlyWage: 31.25,
				hoursPerWeek: 40,
			}
			const expected = 65000;
			const result = calculateAnnualIncomeWithHourlyWage(input.hourlyWage, input.hoursPerWeek);

			expect(result).toEqual(expected);
		});
	})

	describe('calculateAnnualIncomeWithHourlyWage', () => {
		it('should return 31.25 per hour for 65000 per year', () => {
			const input = {
				annualIncome: 65000,
				hoursPerWeek: 40,
			}
			const expected = 31.25;
			const result = calculateHourlyIncomeWithAnnualIncome(input.annualIncome, input.hoursPerWeek);

			expect(result).toEqual(expected);
		});
	})

	describe('calculateAnnualOvertimePay', () => {
		it('should return 0 if overtime hours per week is 0', () => {
			const input = {
				hourlyWage: 31.25,
				overtimeHoursPerWeek: 0,
				overtimeHourMultiplier: 1.5,
			}
			const expected = 0;
			const result = calculateAnnualOvertimePay(input.hourlyWage, input.overtimeHoursPerWeek, input.overtimeHourMultiplier);
			expect(result).toEqual(expected);
		});

		it('should return 0 if overtime hour multiplier is less than 1', () => {
			const input = {
				hourlyWage: 31.25,
				overtimeHoursPerWeek: 5,
				overtimeHourMultiplier: 0.5,
			}
			const expected = 0;
			const result = calculateAnnualOvertimePay(input.hourlyWage, input.overtimeHoursPerWeek, input.overtimeHourMultiplier);
			expect(result).toEqual(expected);
		});

		it('should return correct overtime pay', () => {
			const input = {
				hourlyWage: 31.25,
				overtimeHoursPerWeek: 5,
				overtimeHourMultiplier: 1.5,
			}
			const expected = 12187.5;
			const result = calculateAnnualOvertimePay(input.hourlyWage, input.overtimeHoursPerWeek, input.overtimeHourMultiplier);
			expect(result).toEqual(expected);
		});
	})
})