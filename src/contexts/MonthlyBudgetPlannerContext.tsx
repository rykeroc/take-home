import {createContext, PropsWithChildren, useContext} from 'react';
import useMonthlyBudgetPlanner, {
	MonthlyBudgetPlanner,
	MonthlyBudgetPlannerProps
} from '@/hooks/useMonthlyBudgetPlanner';

const MonthlyBudgetPlannerContext = createContext<MonthlyBudgetPlanner | null>(null)

type MonthlyBudgetPlannerProviderProps = PropsWithChildren & MonthlyBudgetPlannerProps

export const MonthlyBudgetPlannerProvider = ({children, initialBudget}: MonthlyBudgetPlannerProviderProps) => {
	const monthlyBudgetPlanner = useMonthlyBudgetPlanner({initialBudget});
	return (
		<MonthlyBudgetPlannerContext.Provider value={monthlyBudgetPlanner}>
			{children}
		</MonthlyBudgetPlannerContext.Provider>
	)
}

export const useMonthlyBudgetPlannerContext = () => {
	const context = useContext(MonthlyBudgetPlannerContext);
	if (!context) {
		throw new Error('useMonthlyBudgetPlannerContext must be used within a MonthlyBudgetPlannerProvider');
	}
	return context;
}