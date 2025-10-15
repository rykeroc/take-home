'use client';

import { cn } from '@/lib/utils/tailwind';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';
import { logger } from '@/lib/logger';

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
	useEffect(() => {
		logger.error(error);
	}, [error])

	const handleReset = () => reset

	return (
		<section>
			<div className={cn('mb-4', 'text-start', 'flex', 'flex-col', 'gap-2')}>
				<h1>Something Went Wrong</h1>
				<p>Sorry, an unexpected error has occurred. Please try again later.</p>
			</div>
			<Button onClick={handleReset}>Try again</Button>
		</section>
	);
}
