export const isNegativeOrZero = (value: string): boolean => {
	const num = parseFloat(value);
	return !isNaN(num) && num > 0;
}
