import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

export default function Footer() {
	const currentYear = new Date().getFullYear();

	return (
		<footer className={cn('w-full', 'h-full')}>
			<Separator />
			<div
				className={cn(
					'w-full',
					'py-4',
					'flex',
					'justify-center',
					'text-sm',
					'text-muted-foreground',
				)}
			>
				<p>&copy; {currentYear} Take Home. All rights reserved.</p>
			</div>
		</footer>
	);
}
