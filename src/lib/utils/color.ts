export function getRandomColor(min: number, max: number): string {
	const r = Math.floor(Math.random() * (max - min + 1)) + min;
	const g = Math.floor(Math.random() * (max - min + 1)) + min;
	const b = Math.floor(Math.random() * (max - min + 1)) + min;
	return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}
