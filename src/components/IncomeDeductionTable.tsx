import {
	Table,
	TableBody,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils/tailwind';
import { formatCurrency } from '@/lib/utils/formatting';
import React from 'react';
import { useIncomeCalculatorContext } from '@/contexts/IncomeCalculatorContext';

export default function IncomeDeductionTable() {
	const {
		grossAnnualIncome,
		totalFederalTax,
		totalProvincialTax,
		cppContribution,
		eiPremium,
		totalDeductions,
	} = useIncomeCalculatorContext();

	const deductionOutputs = [
		{ label: 'Gross Annual Income', value: grossAnnualIncome },
		{ label: 'Federal Tax', value: totalFederalTax * -1 },
		{ label: 'Provincial Tax', value: totalProvincialTax * -1 },
		{ label: 'CPP', value: cppContribution * -1 },
		{ label: 'EI', value: eiPremium * -1 },
	];

	const deductionTableRows = deductionOutputs.map(({ label, value }) =>
		value === 0 ? null : (
			<TableRow key={label}>
				<TableCell className={cn('text-muted-foreground')}>{label}</TableCell>
				<TableCell>{formatCurrency(value)}</TableCell>
			</TableRow>
		),
	);

	const netAnnualIncome = formatCurrency(grossAnnualIncome - totalDeductions);

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead className={cn('w-4/5')}>Deduction</TableHead>
					<TableHead className={cn()}>Amount</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>{deductionTableRows}</TableBody>
			<TableFooter>
				<TableRow>
					<TableCell>Net Income</TableCell>
					<TableCell>{netAnnualIncome}</TableCell>
				</TableRow>
			</TableFooter>
		</Table>
	);
}
