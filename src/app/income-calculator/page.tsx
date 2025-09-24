import {Metadata} from 'next';
import IncomeCalculatorPageClient from '@/app/income-calculator/IncomeCalculatorPageClient';

export const metadata: Metadata = {
	title: "Income Calculator – Take Home",
	description:
		"Easily calculate your Canadian take-home pay after taxes and deductions. Get breakdowns by province, tax year, and income type, then plan your budget with accurate results.",
	keywords: [
		"Canada income calculator",
		"Canadian tax calculator",
		"take-home pay Canada",
		"net income calculator",
		"after tax income",
		"budget planner Canada",
	],
	openGraph: {
		title: "Income Calculator – Take Home",
		description:
			"Calculate your net income after Canadian taxes and deductions, with detailed breakdowns for provinces and tax years.",
		url: "https://take-home-gray.vercel.app/income-calculator",
		siteName: "Take Home",
		images: [
			{
				// TODO: Update with actual image
				url: "",
				width: 1200,
				height: 630,
				alt: "Income Calculator – Take Home",
			},
		],
		locale: "en_CA",
		type: "website",
	},
};

export default function IncomeCalculatorPage() {
	return (
		<IncomeCalculatorPageClient/>
	);
}