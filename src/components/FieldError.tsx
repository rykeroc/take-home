import { AnyFieldApi } from '@tanstack/react-form';
import { cn } from '@/lib/utils/tailwind';

export default function FieldError({ field }: { field: AnyFieldApi }) {
	return field.state.meta.isTouched && !field.state.meta.isValid ? (
		<small className={cn('text-red-500')}>{field.state.meta.errors.join(', ')}</small>
	) : null;
}