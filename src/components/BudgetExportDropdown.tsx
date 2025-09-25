import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Share } from 'lucide-react';
import { useMonthlyBudgetPlannerContext } from '@/contexts/MonthlyBudgetPlannerContext';
import { toast } from 'sonner';
import Papa from 'papaparse';
import { useMemo } from 'react';
import { BudgetCategory } from '@/hooks/useMonthlyBudgetPlanner';

export default function BudgetExportDropdown() {
	const { userDefinedCategories, unallocatedBudget, totalBudget } =
		useMonthlyBudgetPlannerContext();

	const exportCategories = useMemo(
		() => [
			...userDefinedCategories,
			unallocatedBudget,
			{
				id: 'total',
				name: 'Total',
				amount: totalBudget,
			} as BudgetCategory,
		],
		[userDefinedCategories, unallocatedBudget, totalBudget],
	);

	const exportActions = [
		{
			label: 'Export to CSV',
			handleClick: () => {
				// Check if there are categories to export
				if (userDefinedCategories.length === 0) {
					toast.info('No category selected.');
					return;
				}

				// Convert categories to CSV format
				const fields = ['Category', 'Amount'];
				const data = exportCategories.map(cat => [cat.name, cat.amount.toFixed(2)]);
				const csvData: Papa.UnparseObject<string[]> = {
					fields,
					data,
				};
				const papaConfig: Papa.UnparseConfig = {
					quotes: false,
					quoteChar: '"',
					escapeChar: '"',
					delimiter: ',',
					header: true,
					newline: '\r\n',
				};
				const csv = Papa.unparse(csvData, papaConfig);

				// Download the CSV file
				const csvLink = document.createElement('a');
				csvLink.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
				csvLink.download = 'budget.csv';
				csvLink.click();
				// Delete the link after downloading
				csvLink.remove();

				// Display success toast
				toast.success('Budget exported successfully!');
			},
		},
	];

	const dropdownMenuItems = exportActions.map((action, index) => (
		<DropdownMenuItem key={index} onClick={action.handleClick}>
			{action.label}
		</DropdownMenuItem>
	));

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant={'outline'}>
					<Share />
				</Button>
			</DropdownMenuTrigger>

			<DropdownMenuContent align={'end'}>{dropdownMenuItems}</DropdownMenuContent>
		</DropdownMenu>
	);
}
