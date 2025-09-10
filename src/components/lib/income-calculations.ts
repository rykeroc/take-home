const WEEKS_PER_YEAR = 52;

export function calculateHourlyWage(annualSalary: number, hoursPerWeek: number): number {
	// Avoid division by zero
	if (annualSalary <= 0 || hoursPerWeek <= 0) return 0;

	return (annualSalary / WEEKS_PER_YEAR) / hoursPerWeek;
}

export function calculateAnnualSalary(hourlyWage: number, hoursPerWeek: number): number {
	if (hourlyWage <= 0 || hoursPerWeek <= 0) return 0;

	return hourlyWage * hoursPerWeek * WEEKS_PER_YEAR;
}

export interface HourlyWageResults {
	dailyWage: number;
	weeklyWage: number;
	monthlyWage: number;
	yearlyWage: number;
}

export function calculateIncomeWithHourlyWage(amount: number, hoursPerWeek: number, daysPerWeek: number): HourlyWageResults {
	const weeklyWage = amount * hoursPerWeek;
	const dailyWage = weeklyWage / daysPerWeek;
	const yearlyWage = weeklyWage * WEEKS_PER_YEAR;
	const monthlyWage = yearlyWage / 12;

	return {dailyWage, weeklyWage, monthlyWage, yearlyWage};
}

export interface YearlyWageResults {
	hourlyWage: number;
	dailyWage: number;
	weeklyWage: number;
	monthlyWage: number;
}

export function calculateIncomeWithYearlyWage(amount: number, hoursPerWeek: number, daysPerWeek: number): YearlyWageResults {
	const monthlyWage = amount / 12;
	const weeklyWage = amount / WEEKS_PER_YEAR;
	const dailyWage = weeklyWage / daysPerWeek;
	const hourlyWage = weeklyWage / hoursPerWeek;
	return {hourlyWage, dailyWage, weeklyWage, monthlyWage};
}