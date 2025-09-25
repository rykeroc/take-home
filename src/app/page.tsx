import { cn } from '@/lib/utils';
import { ReactNode } from 'react';
import {
	Calculator,
	ChevronRight,
	PanelsTopLeft,
	PiggyBank,
	Shield,
	TrendingUp,
} from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

type DescriptorDetails = {
	icon: ReactNode;
	title: string;
	description: string;
};

type FeaturesCardDetails = DescriptorDetails & {
	subDescriptions: string[];
	href: string;
};

export default function Home() {
	const iconClasses = cn('w-6 h-6 text-primary');
	const iconBackgroundClasses = cn('bg-primary/15 rounded-lg p-3');

	const featuresCardsDetails: FeaturesCardDetails[] = [
		{
			icon: <Calculator className={iconClasses} />,
			title: 'Income Calculator',
			description: 'Calculate your take-home pay after taxes and deductions',
			subDescriptions: [
				'Tax calculations for all Canadian provinces',
				'Breakdowns for different time periods',
				'Detailed deduction breakdown',
			],
			href: '/income-calculator',
		},
		{
			icon: <PiggyBank className={iconClasses} />,
			title: 'Budget Planner',
			description: 'Create and manage your monthly budget with ease',
			subDescriptions: [
				'Create budget categories with visual indicators',
				'Plan spending across multiple categories',
				'Visual summary of your financial health',
			],
			href: '/budget-planner',
		},
	];

	const FeatureCards = featuresCardsDetails.map(card => (
		<Card key={card.title} className={'w-full'}>
			<CardHeader className={cn('flex', 'flex-col', 'gap-3')}>
				<div className={iconBackgroundClasses}>{card.icon}</div>
				<h3>{card.title}</h3>
				<p className={'text-foreground'}>{card.description}</p>
			</CardHeader>
			<CardContent className={cn('flex', 'flex-col', 'gap-2', 'w-full', 'h-full')}>
				<div className={cn('flex', 'flex-col', 'gap-2')}>
					{card.subDescriptions.map((desc, index) => (
						<ul
							key={index}
							className={cn('flex', 'items-center', 'gap-2', 'text-muted-foreground')}
						>
							{desc}
						</ul>
					))}
				</div>
			</CardContent>
			<CardFooter>
				<Button className={'w-full'} asChild>
					<Link href={card.href}>
						Get Started <ChevronRight className={'ml-2'} />
					</Link>
				</Button>
			</CardFooter>
		</Card>
	));

	const footerDescriptorDetails: DescriptorDetails[] = [
		{
			icon: <Shield className={iconClasses} />,
			title: '100% Private',
			description:
				'All calculations happen in your browser. Your financial data never leaves your device.',
		},
		{
			icon: <TrendingUp className={iconClasses} />,
			title: 'Always Accurate',
			description:
				'Updated tax rates and calculations ensure you get the most accurate results.',
		},
		{
			icon: <PanelsTopLeft className={iconClasses} />,
			title: 'User-Friendly Interface',
			description:
				'Clean, intuitive interface makes financial planning accessible to everyone.',
		},
	];

	const FooterDescriptors = footerDescriptorDetails.map(desc => (
		<div
			key={desc.title}
			className={cn('flex', 'flex-col', 'gap-2', 'items-center', 'text-center', 'max-w-xs')}
		>
			<div className={iconBackgroundClasses}>{desc.icon}</div>
			<h4>{desc.title}</h4>
			<p className={'text-muted-foreground'}>{desc.description}</p>
		</div>
	));

	return (
		<div className={cn('flex', 'flex-col', 'gap-20')}>
			<section className={cn('flex', 'flex-col', 'gap-5', 'items-center', 'w-full')}>
				<h1 className={'text-center'}>
					Plan your <span className={cn('text-primary')}>Financial Future</span>
				</h1>
				<h5 className={cn('text-muted-foreground', 'text-center')}>
					Simple, powerful tools to calculate your income and plan your budget
					effectively.
				</h5>
			</section>

			<section className={cn('flex', 'flex-col', 'gap-5', 'md:flex-row')}>
				{FeatureCards}
			</section>

			<section className={cn('flex', 'flex-col', 'gap-10', 'items-center')}>
				<h3>Why use Take Home?</h3>
				<div className={cn('flex', 'flex-col', 'gap-5', 'md:flex-row')}>
					{FooterDescriptors}
				</div>
			</section>
		</div>
	);
}
