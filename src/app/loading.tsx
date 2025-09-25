import { Spinner } from '@/components/ui/shadcn-io/spinner';
import { cn } from '@/lib/utils/tailwind';

export default function Loading() {
	return (
		<section className={cn('flex', 'flex-col', 'items-center', 'justify-center', 'gap-3')}>
			<Spinner />
			<h4 className={'text-muted-foreground'}>Loading</h4>
		</section>
	);
}
