import {Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow} from '@/components/ui/table';
import {cn, formatCurrency} from '@/lib/utils';
import React from 'react';
import {IncomeCalculator} from '@/hooks/useIncomeCalculator';

type IncomeDeductionTableProps = Pick<IncomeCalculator,
"totalFederalTax" | "totalProvincialTax" | "totalTax" | "cppContribution" | "eiPremium" | "grossAnnualIncome" | "totalDeductions">

export default function IncomeDeductionTable(props: IncomeDeductionTableProps) {
	const deductionOutputs = [
		{label: "Gross Annual Income", value: formatCurrency(props.grossAnnualIncome)},
		{label: "Federal Tax", value: formatCurrency(props.totalFederalTax)},
		{label: "Provincial Tax", value: formatCurrency(props.totalProvincialTax)},
		{label: "Total Tax", value: formatCurrency(props.totalTax)},
		{label: "CPP", value: formatCurrency(props.cppContribution)},
		{label: "EI", value: formatCurrency(props.eiPremium)},
	]

	const deductionTableRows = deductionOutputs.map(({label, value}) =>
		value === "0.00" ? null : (
			<TableRow key={label}>
				<TableCell className={cn("text-muted-foreground")}>{label}</TableCell>
				<TableCell>{value}</TableCell>
			</TableRow>
		)
	)

	const netAnnualIncome = formatCurrency(props.grossAnnualIncome - props.totalDeductions);

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead className={cn("w-4/5")}>Deduction</TableHead>
					<TableHead className={cn()}>Amount</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{deductionTableRows}
			</TableBody>
			<TableFooter>
				<TableRow>
					<TableCell>Net Income</TableCell>
					<TableCell>{netAnnualIncome}</TableCell>
				</TableRow>
			</TableFooter>
		</Table>
	)
}