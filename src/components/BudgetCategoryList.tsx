import {MonthlyBudgetPlanner} from '@/hooks/useMonthlyBudgetPlanner';
import {cn} from '@/lib/utils';
import {Input} from '@/components/Input';
import {Button} from '@/components/ui/button';
import {Plus, Trash} from 'lucide-react';
import {Label} from '@/components/ui/label';
import {AnyFieldApi, useForm} from '@tanstack/react-form';
import {FormEvent} from 'react';
import {Table, TableBody, TableCell, TableRow} from '@/components/ui/table';

type BudgetCategoryListProps = Pick<MonthlyBudgetPlanner, "categories" | "addCategory" | "updateCategory" | "removeCategory" | "resetCategories" | "unallocatedAmount" | "categoryExists" | "categoryError" | "resetCategoryError">;

export default function BudgetCategoryList(props: BudgetCategoryListProps) {
	const {categories, removeCategory, unallocatedAmount} = props;

	const categoryRows = [...categories, {name: "Unallocated", amount: unallocatedAmount}]
		.map((category, index) => {
			const isUnallocatedRow = index === categories.length;
			const mutedStyle = isUnallocatedRow ? "text-muted-foreground" : "";

			if (isUnallocatedRow && unallocatedAmount === 0) return null

			return (
				<TableRow key={category.name} className={cn("group", "h-14")}>
					<TableCell className={cn(mutedStyle)}>{category.name}</TableCell>
					<TableCell className={cn(mutedStyle)}>${category.amount.toFixed(2)}</TableCell>
					<TableCell className={cn("w-24")}>
						{
							!isUnallocatedRow && (
								<Button
									variant={"ghost"}
									className={cn("hidden", "group-hover:block")}
									onClick={() => removeCategory(category.name)}>
									<Trash className={cn("text-red-500")}/>
								</Button>
							)
						}
					</TableCell>
				</TableRow>
			)
		});

return (
	<div className={cn("flex", "flex-col", "gap-4")}>
		<Label className={cn("text-muted-foreground")}>Budget Categories</Label>

		<Table>
			<TableBody>
				{categoryRows}
			</TableBody>
		</Table>

		{
			unallocatedAmount > 0 &&
          <NewBudgetCategoryForm {...props}/>
		}
	</div>
)}

type NewBudgetCategoryFormProps = Pick<BudgetCategoryListProps, "addCategory" | "unallocatedAmount" | "categoryExists" | "resetCategoryError" | "categoryError">

function NewBudgetCategoryForm(props: NewBudgetCategoryFormProps) {
	const form = useForm({
		defaultValues: {
			categoryAmount: '',
			categoryName: '',
		},
		onSubmit: ({value}) => {
			const addSuccess = props.addCategory(value.categoryName, Number(value.categoryAmount));
			if (addSuccess) {
				form.reset();
			}
		},
		validators: {
			onChange: () => {
				props.resetCategoryError && props.resetCategoryError();
			}
		}
	})

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		e.stopPropagation();
		await form.handleSubmit();
	}

	return (
		<form onSubmit={handleSubmit}>
			<div className={cn("flex", "flex-row", "gap-3", "items-start")}>
				{/* Category Amount */}
				<form.Field
					name={"categoryAmount"}
					validators={{
						onChange: ({value}) => {
							if (value === '') {
								return "Amount is required";
							}
							const amount = parseFloat(value);
							if (isNaN(amount) || amount <= 0) {
								return "Amount must be a positive number";
							}
							if (props.unallocatedAmount !== undefined && amount > props.unallocatedAmount) {
								return `Amount must not exceed unallocated amount ($${props.unallocatedAmount})`;
							}
						}
					}}
					children={(field) => (
						<div className={cn("flex", "flex-col", "gap-1", "w-full", "md:w-1/2", "lg:w-1/3", "xl:w-1/4")}>
							<Input
								id={field.name}
								name={field.name}
								onBlur={field.handleBlur}
								value={field.state.value}
								onChange={(e) => field.handleChange(e.target.value)}
								type={"number"}
								placeholder={"0"}
								prefix={"$"}
							/>
							<FieldError field={field}/>
						</div>
					)}
				/>

				{/* Category Name */}
				<form.Field
					name={"categoryName"}
					validators={{
						onChange: ({value}) => {
							if (value.trim() === '') {
								return "Category name is required";
							}
							if (value.length < 1 || value.length > 50) {
								return "Category name must be between 1 and 50 characters";
							}
							if (props.categoryExists(value)) {
								return "Category name must be unique";
							}
						}
					}}
					children={(field) => (
						<>
							<Input
								id={field.name}
								name={field.name}
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								className={cn("w-full", "md:w-1/2", "lg:w-1/3", "xl:w-1/4")}
								type={"text"}
								placeholder={"Enter category name"}
							/>
							<FieldError field={field}/>
						</>
					)}
				/>

				{/* Submit Button */}
				<form.Subscribe
					selector={(state) => [state.canSubmit]}
					children={([canSubmit]) => (
						<Button type="submit" disabled={!canSubmit}>
							<Plus/>
						</Button>
					)}
				/>
			</div>

			{
				props.categoryError && (
					<small className={cn("text-red-500")}>{props.categoryError}</small>
				)
			}
		</form>
	)
}

function FieldError({field}: { field: AnyFieldApi }) {
	return (
		field.state.meta.isTouched && !field.state.meta.isValid ? (
			<small className={cn("text-red-500")}>{field.state.meta.errors.join(', ')}</small>
		) : null
	)
}