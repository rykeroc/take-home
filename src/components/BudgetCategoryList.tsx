/* eslint-disable react/no-children-prop */

import { cn, getRandomColor } from '@/lib/utils';
import { Input } from '@/components/Input';
import { Button } from '@/components/ui/button';
import { Plus, Trash } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { AnyFieldApi, useForm } from '@tanstack/react-form';
import { FormEvent, useRef } from 'react';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { useMonthlyBudgetPlannerContext } from '@/contexts/MonthlyBudgetPlannerContext';

export default function BudgetCategoryList() {
	const { userDefinedCategories, unallocatedBudget, removeCategory } =
		useMonthlyBudgetPlannerContext();

	const categoryRows = [...userDefinedCategories, unallocatedBudget].map(category => {
		const isUnallocatedRow = category.id === 'unallocated';
		const mutedStyle = isUnallocatedRow ? 'text-muted-foreground' : '';

		if (isUnallocatedRow && unallocatedBudget!.amount === 0) return null;

		return (
			<TableRow key={category!.name} className={cn('group', 'h-14')}>
				<TableCell>
					<div
						className={cn('w-3', 'h-3', 'rounded-full')}
						style={{ backgroundColor: category.color }}
					/>
				</TableCell>
				<TableCell className={cn(mutedStyle)}>{category!.name}</TableCell>
				<TableCell className={cn(mutedStyle)}>${category!.amount.toFixed(2)}</TableCell>
				<TableCell className={cn('w-24')}>
					{!isUnallocatedRow && (
						<Button
							variant={'ghost'}
							className={cn('hidden', 'group-hover:block')}
							onClick={() => removeCategory(category.name)}
						>
							<Trash className={cn('text-red-500')} />
						</Button>
					)}
				</TableCell>
			</TableRow>
		);
	});

	return (
		<div className={cn('flex', 'flex-col', 'gap-4')}>
			<Label className={cn('text-muted-foreground')}>Budget Categories</Label>

			{/* Add Budget category form*/}
			{unallocatedBudget.amount > 0 && <NewBudgetCategoryForm />}

			{/* Budget category items */}
			<Table>
				<TableBody>{categoryRows}</TableBody>
			</Table>
		</div>
	);
}

function NewBudgetCategoryForm() {
	const { addCategory, categoryError, resetCategoryError, unallocatedBudget, categoryExists } =
		useMonthlyBudgetPlannerContext();

	const amountRef = useRef<HTMLInputElement>(null);
	const handleFocusAmountInput = () => {
		if (amountRef.current) amountRef.current.focus();
	};

	const form = useForm({
		defaultValues: {
			categoryColor: getRandomColor(0, 255),
			categoryAmount: '',
			categoryName: '',
		},
		onSubmit: ({ value }) => {
			console.log('Submitting new category:', value);
			const addSuccess = addCategory(
				value.categoryName,
				Number(value.categoryAmount),
				value.categoryColor,
			);
			if (addSuccess) {
				form.reset();
				handleFocusAmountInput();
			}
		},
		validators: {
			onChange: resetCategoryError,
		},
	});

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		e.stopPropagation();
		await form.handleSubmit();
	};

	return (
		<form onSubmit={handleSubmit}>
			<div className={cn('flex', 'flex-col', 'sm:flex-row', 'gap-3', 'items-start')}>
				<div className={cn('flex', 'gap-3', 'w-full')}>
					{/* Category Amount */}
					<form.Field
						name={'categoryAmount'}
						validators={{
							onChange: ({ value }) => {
								if (value === '') {
									return 'Amount is required';
								}
								const amount = parseFloat(value);
								if (isNaN(amount) || amount <= 0) {
									return 'Amount must be a positive number';
								}
								if (
									unallocatedBudget !== undefined &&
									amount > unallocatedBudget.amount
								) {
									return `Amount must not exceed unallocated amount ($${unallocatedBudget.amount.toFixed(2)})`;
								}
							},
						}}
						children={field => (
							<div className={cn('flex', 'flex-col', 'gap-1', 'w-full')}>
								<Input
									ref={amountRef}
									id={field.name}
									name={field.name}
									onBlur={field.handleBlur}
									value={field.state.value}
									onChange={e => field.handleChange(e.target.value)}
									type={'number'}
									placeholder={'0'}
									prefix={'$'}
								/>
								<FieldError field={field} />
							</div>
						)}
					/>

					{/* Category Name */}
					<form.Field
						name={'categoryName'}
						validators={{
							onChange: ({ value }) => {
								if (value.trim() === '') {
									return 'Category name is required';
								}
								if (value.length < 1 || value.length > 50) {
									return 'Category name must be between 1 and 50 characters';
								}
								if (categoryExists(value)) {
									return 'Category name must be unique';
								}
							},
						}}
						children={field => (
							<div className={cn('flex', 'flex-col', 'gap-1', 'w-full')}>
								<Input
									id={field.name}
									name={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={e => field.handleChange(e.target.value)}
									type={'text'}
									placeholder={'Category name'}
								/>
								<FieldError field={field} />
							</div>
						)}
					/>
				</div>

				<div className={cn('flex', 'gap-3', 'w-full')}>
					{/* Color */}
					<form.Field
						name={'categoryColor'}
						children={field => (
							<Input
								id={field.name}
								name={field.name}
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={e => field.handleChange(e.target.value)}
								type={'color'}
								className={cn(
									'w-18', // make it square, remove padding/border
									'cursor-pointer appearance-none', // remove default browser styles
								)}
							/>
						)}
					/>
					{/* Submit Button */}
					<form.Subscribe
						selector={state => [state.canSubmit]}
						children={([canSubmit]) => (
							<Button type="submit" disabled={!canSubmit}>
								<Plus />
							</Button>
						)}
					/>
				</div>
			</div>

			{categoryError && <small className={cn('text-red-500')}>{categoryError}</small>}
		</form>
	);
}

function FieldError({ field }: { field: AnyFieldApi }) {
	return field.state.meta.isTouched && !field.state.meta.isValid ? (
		<small className={cn('text-red-500')}>{field.state.meta.errors.join(', ')}</small>
	) : null;
}
