import { CanadianProvinceOrTerritoryCode } from '@/lib/canadian-provinces';

export const TaxYears = [2025] as const;

export type TaxYear = (typeof TaxYears)[number];

export type TaxBracket = {
	incomeUpTo: number | null;
	rate: number;
};

// Model Federal data file structure
export type FederalTaxData = Record<TaxYear, TaxBracket[]>;

// Model Provincial data file structure
export type ProvinceTaxBrackets = Record<CanadianProvinceOrTerritoryCode, TaxBracket[]>;
export type ProvincialTaxData = Record<TaxYear, ProvinceTaxBrackets>;

// Model CPP/QPP data file structure
export type CppQppEntry = {
	rate: number;
	basicExemption: number;
	ympe: number;
	rate2: number;
	yampe: number;
};
export type CppQppYearData = {
	ROC: CppQppEntry;
	QC: CppQppEntry;
};
export type CppQppData = Record<TaxYear, CppQppYearData>;

// Model EI/QPIP data file structure
export type EIQpipEntry = {
	rate: number;
	mie: number;
};
export type QcEqQpipData = {
	ei: EIQpipEntry;
	qpip: EIQpipEntry;
};
export type EiQpipYearData = {
	ROC: EIQpipEntry;
	QC: QcEqQpipData;
};
export type EiQpipData = Record<TaxYear, EiQpipYearData>;
