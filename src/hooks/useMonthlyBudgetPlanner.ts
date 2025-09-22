import {useMemo, useState} from 'react';

interface MonthlyBudgetPlannerProps {
	initialBudget?: number;
}

export interface MonthlyBudgetPlanner {
	budget: number;
	handleBudgetChange: (value: string) => void;
	resetBudget: () => void;
	categories: BudgetCategory[];
	addCategory: (name: string, amount: number) => boolean;
	updateCategory: (name: string, amount: number) => boolean;
	removeCategory: (name: string) => void;
	categoryExists: (name: string) => boolean;
	resetCategories: () => void;
	unallocatedAmount: number;
	categoryError: string | null;
	resetCategoryError: () => void;
}

interface BudgetCategory {
	name: string;
	amount: number;
}

export default function useMonthlyBudgetPlanner(props: MonthlyBudgetPlannerProps): MonthlyBudgetPlanner {
	const defaultBudget = useMemo(() => 0, []);
	const defaultCategories = useMemo(() => [], []);
	const {initialBudget} = props;

	const [budget, setBudget] = useState<number>(initialBudget ?? defaultBudget);
	const [categories, setCategories] = useState<BudgetCategory[]>(defaultCategories);
	const [categoryError, setCategoryError] = useState<string | null>(null);

	const allocatedAmount = useMemo(() => categories.reduce((acc, category) => acc + category.amount, 0), [categories]);
	const unallocatedAmount = useMemo(() => budget - allocatedAmount, [budget, allocatedAmount]);

	const resetCategoryError = () => setCategoryError(null);

	const handleBudgetChange = (value: string) => {
		const numericValue = parseFloat(value);
		if (!isNaN(numericValue)) {
			setBudget(numericValue);
		} else {
			setBudget(defaultBudget);
		}
	}
	const resetBudget = () => {
		setBudget(defaultBudget);
	};

	const isValidCategoryName = (name: string): boolean => {
		return !categories.find(category => category.name === name);
	}
	const isValidCategoryAmount = (amount: number): boolean => {
		return amount + allocatedAmount <= budget;
	}

	const addCategory = (name: string, amount: number): boolean => {
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
		setCategories(prev => [...prev, {name, amount}]);
		return true
	}
	const updateCategory = (name: string, amount: number): boolean => {
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
		setCategories(prev => prev.map(category => category.name === name ? {...category, amount} : category));
		return true;
	}
	const removeCategory = (name: string) => {
		setCategories(prev => prev.filter(category => category.name !== name));
	}
	const categoryExists = (name: string): boolean => {
		return !!categories.find(category => category.name === name);
	}
	const resetCategories = () => {
		setCategories(defaultCategories);
	}

	return {
		budget,
		handleBudgetChange,
		resetBudget,
		categories,
		addCategory,
		updateCategory,
		removeCategory,
		categoryExists,
		resetCategories,
		unallocatedAmount,
		categoryError,
		resetCategoryError
	};
}