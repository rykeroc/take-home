import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

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

export function getRandomColor(min: number, max: number): string {
	const r = Math.floor(Math.random() * (max - min + 1)) + min;
	const g = Math.floor(Math.random() * (max - min + 1)) + min;
	const b = Math.floor(Math.random() * (max - min + 1)) + min;
	return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}
