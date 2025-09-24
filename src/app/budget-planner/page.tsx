import React from 'react';
import BudgetPlannerPageClient from '@/app/budget-planner/BudgetPlannerPageClient';
import {Metadata} from 'next';

export const metadata: Metadata = {
	title: "Budget Planner - Take Home",
	description: "Plan your budget effectively with our comprehensive budget planner tool. Track your income, expenses, and savings to achieve your financial goals.",
	openGraph: {
		title: "Budget Planner",
		description: "Plan your budget effectively with our comprehensive budget planner tool. Track your income, expenses, and savings to achieve your financial goals.",
		// TODO: Replace with production URL
		url: "https://takehome.vercel.app/budget-planner",
		siteName: "Take Home",
		images: [
			{
				// TODO: Replace with custom image
				url: "",
				width: 1200,
				height: 630,
				alt: "Budget Planner",
			},
		],
		locale: "en_US",
		type: "website",
	},
}

export default function BudgetPlannerPage() {
	return <BudgetPlannerPageClient/>
}