import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';
import React from 'react';
import HeaderNavigation from '@/components/HeaderNavigation';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/sonner';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
	metadataBase: new URL('https://take-home-gray.vercel.app/'),
	title: 'Take Home – Plan Your Financial Future',
	description:
		'Calculate your take-home pay after Canadian tax deductions and create a budget with ease. Take Home helps you plan your financial future with accurate income calculations and powerful budgeting tools.',
	applicationName: 'Take Home',
	authors: [{ name: 'Ryker Cooke', url: 'https://ryker-cooke.vercel.app/' }],
	keywords: [
		'Canada tax calculator',
		'take-home pay calculator',
		'Canadian income tax',
		'budget planner',
		'personal finance',
		'after tax income',
		'financial planning',
	],
	creator: 'Ryker Cooke',
	openGraph: {
		title: 'Take Home – Plan Your Financial Future',
		description:
			'Calculate your take-home pay after Canadian tax deductions and create a budget with ease. Take Home helps you plan your financial future with accurate income calculations and powerful budgeting tools.',
		url: 'https://takehome.vercel.app',
		siteName: 'Take Home',
		images: [
			{
				// TODO: Update with actual image
				url: '',
				width: 1200,
				height: 630,
				alt: 'Take Home',
			},
		],
		locale: 'en-US',
		type: 'website',
	},
};

const montserrat = Montserrat({
	variable: '--font-montserrat',
	subsets: ['latin'],
});

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	const layoutClasses = cn(
		'flex',
		'flex-col',
		'flex-1',
		'items-center',
		'p-4',
		'w-full',
		'md:w-5/6',
		'lg:w-4/5',
		'xl:w-3/4',
		'2xl:w-2/3',
	);
	return (
		<html lang="en">
			<body
				className={cn(
					montserrat.variable,
					'antialiased',
					'min-h-screen',
					'flex',
					'flex-col',
				)}
			>
				<HeaderNavigation />
				<main className={cn('flex', 'flex-col', 'items-center', 'w-full', 'flex-1')}>
					<div className={layoutClasses}>{children}</div>
				</main>
				<Footer />
				<Toaster position={'top-center'} />
			</body>
		</html>
	);
}
