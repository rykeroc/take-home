'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function GlobalError() {
	return (
		<section>
			<div className={cn('mb-4', 'text-start', 'flex', 'flex-col', 'gap-2')}>
				<h1>Something Went Wrong</h1>
				<p>Sorry, an unexpected error has occurred. Please try again later.</p>
			</div>
			<Button asChild>
				<Link href={'/'}>Return Home</Link>
			</Button>
		</section>
	);
}
