import { createContext, PropsWithChildren, useContext } from 'react';
import { IncomeCalculator, useIncomeCalculator } from '@/hooks/useIncomeCalculator';

const IncomeCalculatorContext = createContext<IncomeCalculator | null>(null);

type IncomeCalculatorProviderProps = PropsWithChildren;

const IncomeCalculatorProvider = ({ children }: IncomeCalculatorProviderProps) => {
	const incomeCalculator = useIncomeCalculator();

	return (
		<IncomeCalculatorContext.Provider value={incomeCalculator}>
			{children}
		</IncomeCalculatorContext.Provider>
	);
};

const useIncomeCalculatorContext = () => {
	const context = useContext(IncomeCalculatorContext);
	if (!context) {
		throw new Error(
			'useIncomeCalculatorContext must be used within an IncomeCalculatorProvider',
		);
	}
	return context;
};

export { IncomeCalculatorProvider, useIncomeCalculatorContext };
