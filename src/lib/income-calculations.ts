/**
 * A module for calculating income based on hourly wage, annual income, and overtime pay.
 */

/**
 * Number of weeks in a year, used for annual income calculations.
 */
const WEEKS_PER_YEAR = 52;

/**
 * Calculates the annual income based on hourly wage and hours worked per week.
 *
 * @param hourlyWage - The hourly wage.
 * @param hoursPerWeek - The number of hours worked per week.
 */
export function calculateAnnualIncomeWithHourlyWage(
	hourlyWage: number,
	hoursPerWeek: number,
): number {
	return hourlyWage * hoursPerWeek * WEEKS_PER_YEAR;
}

/**
 * Calculates the hourly income based on annual income and hours worked per week.
 *
 * @param annualIncome - The annual income.
 * @param hoursPerWeek - The number of hours worked per week.
 */
export function calculateHourlyIncomeWithAnnualIncome(
	annualIncome: number,
	hoursPerWeek: number,
): number {
	const weeklyWage = annualIncome / WEEKS_PER_YEAR;
	return weeklyWage / hoursPerWeek;
}

/**
 * Calculates the annual overtime pay based on hourly wage, overtime hours per week, and overtime hour multiplier.
 *
 * Returns 0 if overtimeHoursPerWeek is less than or equal to 0 or if overtimeHourMultiplier is less than 1.
 *
 * @param hourlyWage - The regular hourly wage.
 * @param overtimeHoursPerWeek - The number of overtime hours worked per week.
 * @param overtimeHourMultiplier - The multiplier applied to the hourly wage for overtime hours.
 */
export function calculateAnnualOvertimePay(
	hourlyWage: number,
	overtimeHoursPerWeek: number,
	overtimeHourMultiplier: number,
): number {
	if (overtimeHoursPerWeek <= 0 || overtimeHourMultiplier < 1) {
		return 0;
	}
	const overtimeWage = hourlyWage * overtimeHourMultiplier;
	return overtimeWage * overtimeHoursPerWeek * WEEKS_PER_YEAR;
}

export interface WageResults {
	hourlyWage: number;
	dailyWage: number;
	weeklyWage: number;
	monthlyWage: number;
	yearlyWage: number;
}

/**
 * Calculates wage breakdowns based on annual income, hours worked per week, and days worked per week.
 *
 * @param annualIncome - The annual income.
 * @param hoursPerWeek - The number of hours worked per week.
 * @param daysPerWeek - The number of days worked per week.
 */
export function calculateIncome(
	annualIncome: number,
	hoursPerWeek: number,
	daysPerWeek: number,
): WageResults {
	const monthlyWage = annualIncome / 12;
	const weeklyWage = annualIncome / WEEKS_PER_YEAR;
	const dailyWage = weeklyWage / daysPerWeek;
	const hourlyWage = weeklyWage / hoursPerWeek;
	return {
		hourlyWage,
		dailyWage,
		weeklyWage,
		monthlyWage,
		yearlyWage: annualIncome,
	};
}
