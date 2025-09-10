import {Button} from '@/components/ui/button';
import Link from 'next/link';
import {cn} from '@/lib/utils';

export default function GlobalNotFound() {
	return (
		<div>
			<div className={cn("mb-4", "text-start", "flex", "flex-col", "gap-2")}>
				<h1>Page Not Found</h1>
				<p>Sorry, the page you are looking for does not exist.</p>
			</div>
			<Button asChild>
				<Link href={"/"}>
					Return Home
				</Link>
			</Button>
		</div>
	)
}