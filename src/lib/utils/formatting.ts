export function formatCurrency(
	amount: number,
	locale: string = 'en-CA',
	currency: string = 'CAD',
): string {
	return new Intl.NumberFormat(locale, {
		style: 'currency',
		currency,
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	}).format(amount);
}
