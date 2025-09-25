const WEEKS_PER_YEAR = 52;

export function calculateAnnualIncomeWithHourlyWage(
	hourlyWage: number,
	hoursPerWeek: number,
): number {
	return hourlyWage * hoursPerWeek * WEEKS_PER_YEAR;
}

export interface WageResults {
	hourlyWage: number;
	dailyWage: number;
	weeklyWage: number;
	monthlyWage: number;
	yearlyWage: number;
}

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
