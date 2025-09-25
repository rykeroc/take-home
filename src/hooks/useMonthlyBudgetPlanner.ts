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

export default function useMonthlyBudgetPlanner(
	props: MonthlyBudgetPlannerProps,
): MonthlyBudgetPlanner {
	const defaultBudget = useMemo(() => 0, []);
	const defaultCategories = useMemo(() => [], []);
	const { initialBudget } = props;

	const [budget, setBudget] = useState<number>(initialBudget ?? defaultBudget);
	const [categories, setCategories] = useState<BudgetCategory[]>(defaultCategories);
	const [categoryError, setCategoryError] = useState<string | null>(null);

	const allocatedAmount = useMemo(
		() => categories.reduce((acc, category) => acc + category.amount, 0),
		[categories],
	);
	const unallocatedBudget = useMemo(
		() =>
			({
				id: 'unallocated',
				name: 'Unallocated',
				amount: budget - allocatedAmount,
				color: '#232323',
			}) as BudgetCategory,
		[budget, allocatedAmount],
	);

	const resetCategoryError = () => setCategoryError(null);

	const handleBudgetChange = (value: string) => {
		const numericValue = parseFloat(value);
		if (!isNaN(numericValue)) {
			setBudget(numericValue);
		} else {
			setBudget(defaultBudget);
		}
	};
	const resetBudget = () => {
		setBudget(defaultBudget);
	};

	const isValidCategoryName = (name: string): boolean => {
		return !categories.find(category => category.name === name);
	};
	const isValidCategoryAmount = (amount: number): boolean => {
		return amount + allocatedAmount <= budget;
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
		setCategories(prev => [...prev, { id, name, amount, color }]);
		return true;
	};
	const removeCategory = (name: string) => {
		setCategories(prev => prev.filter(category => category.name !== name));
	};
	const categoryExists = (name: string): boolean => {
		return !!categories.find(category => category.name === name);
	};
	const resetCategories = () => {
		setCategories(defaultCategories);
	};

	return {
		totalBudget: budget,
		handleBudgetChange,
		resetBudget,
		userDefinedCategories: categories,
		addCategory,
		removeCategory,
		categoryExists,
		resetCategories,
		unallocatedBudget,
		categoryError,
		resetCategoryError,
	};
}
