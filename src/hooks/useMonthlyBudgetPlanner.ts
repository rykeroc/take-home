import { useMemo, useState } from 'react';

export interface MonthlyBudgetPlannerProps {
	initialBudget?: number;
}

export interface MonthlyBudgetPlanner {
	totalBudget: number;
	handleBudgetChange: (value: string) => void;
	resetBudget: () => void;
	userDefinedCategories: BudgetCategory[];
	unallocatedBudget: BudgetCategory;
	addCategory: (name: string, amount: number, color: string) => boolean;
	removeCategory: (name: string) => void;
	categoryExists: (name: string) => boolean;
	resetCategories: () => void;
	categoryError: string | null;
	resetCategoryError: () => void;
}

export type BudgetCategoryIdType = string | 'unallocated' | 'total';
export type BudgetCategoryNameType = string | 'Unallocated' | 'Total';

export interface BudgetCategory {
	id: BudgetCategoryIdType;
	name: BudgetCategoryNameType;
	amount: number;
	color: string;
}

const defaultBudget = 0;
const defaultCategories = [] as BudgetCategory[];

export default function useMonthlyBudgetPlanner(
	props: MonthlyBudgetPlannerProps,
): MonthlyBudgetPlanner {
	const { initialBudget } = props;

	const [totalBudget, setTotalBudget] = useState<number>(initialBudget ?? defaultBudget);
	const [userDefinedCategories, setUserDefinedCategories] =
		useState<BudgetCategory[]>(defaultCategories);
	const [categoryError, setCategoryError] = useState<string | null>(null);

	// Calculate allocated budget amount
	const allocatedAmount = useMemo(
		() => userDefinedCategories.reduce((acc, category) => acc + category.amount, 0),
		[userDefinedCategories],
	);

	// Calculate unallocated budget
	const unallocatedBudget = useMemo(
		() =>
			({
				id: 'unallocated',
				name: 'Unallocated',
				amount: totalBudget - allocatedAmount,
				color: '#232323',
			}) as BudgetCategory,
		[totalBudget, allocatedAmount],
	);

	const resetCategoryError = () => setCategoryError(null);

	const handleBudgetChange = (value: string) => {
		const numericValue = parseFloat(value);
		if (!isNaN(numericValue)) {
			setTotalBudget(numericValue);
		} else {
			setTotalBudget(defaultBudget);
		}
	};

	const resetBudget = () => {
		setTotalBudget(defaultBudget);
	};

	const isValidCategoryName = (name: string): boolean => {
		return !userDefinedCategories.find(category => category.name === name);
	};

	const isValidCategoryAmount = (amount: number): boolean => {
		return amount + allocatedAmount <= totalBudget;
	};

	const addCategory = (name: string, amount: number, color: string): boolean => {
		if (!isValidCategoryName(name)) {
			// Category with the same name already exists
			setCategoryError(`Category with name '${name}' already exists`);
			return false;
		}
		if (!isValidCategoryAmount(amount)) {
			// Amount exceeds budget
			setCategoryError('Amount exceeds unallocated budget');
			return false;
		}

		const id = crypto.randomUUID();
		setUserDefinedCategories(prev => [...prev, { id, name, amount, color }]);
		return true;
	};

	const removeCategory = (name: string) => {
		setUserDefinedCategories(prev => prev.filter(category => category.name !== name));
	};

	const categoryExists = (name: string): boolean => {
		return !!userDefinedCategories.find(category => category.name === name);
	};

	const resetCategories = () => {
		setUserDefinedCategories(defaultCategories);
	};

	return {
		totalBudget,
		handleBudgetChange,
		resetBudget,
		userDefinedCategories,
		addCategory,
		removeCategory,
		categoryExists,
		resetCategories,
		unallocatedBudget,
		categoryError,
		resetCategoryError,
	};
}
