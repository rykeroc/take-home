export const CanadianProvincesAndTerritories = [
	'Alberta',
	'British Columbia',
	'Manitoba',
	'New Brunswick',
	'Newfoundland and Labrador',
	'Nova Scotia',
	'Ontario',
	'Prince Edward Island',
	'Quebec',
	'Saskatchewan',
	'Northwest Territories',
	'Nunavut',
	'Yukon',
] as const;

export type CanadianProvinceOrTerritory = (typeof CanadianProvincesAndTerritories)[number];

export const CanadianProvinceAndTerritoryCodes = [
	'AB',
	'BC',
	'MB',
	'NB',
	'NL',
	'NS',
	'ON',
	'PE',
	'QC',
	'SK',
	'NT',
	'NU',
	'YT',
] as const;

export type CanadianProvinceOrTerritoryCode = (typeof CanadianProvinceAndTerritoryCodes)[number];

export const CanadianProvinceNameToCodeMap: Record<
	CanadianProvinceOrTerritory,
	CanadianProvinceOrTerritoryCode
> = {
	Alberta: 'AB',
	'British Columbia': 'BC',
	Manitoba: 'MB',
	'New Brunswick': 'NB',
	'Newfoundland and Labrador': 'NL',
	'Nova Scotia': 'NS',
	Ontario: 'ON',
	'Prince Edward Island': 'PE',
	Quebec: 'QC',
	Saskatchewan: 'SK',
	'Northwest Territories': 'NT',
	Nunavut: 'NU',
	Yukon: 'YT',
};
