"use client";

import {
	NavigationMenu,
	NavigationMenu as ShadcnNavigationMenu, NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
} from "@/components/ui/navigation-menu";
import * as React from "react";
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import Link from 'next/link';
import {Calculator, List, Menu, PiggyBank, Users} from 'lucide-react';
import {
	Sheet as ShadcnSheet,
	SheetContent,
	SheetHeader, SheetTitle,
	SheetTrigger
} from '@/components/ui/sheet';
import {Separator} from '@/components/ui/separator';
import {cn} from '@/lib/utils';

interface LinkData extends React.ComponentProps<
	typeof NavigationMenuPrimitive.Link
> {
	icon: React.ReactNode
}

const HeaderNavigation = () => {
	const appName = "Take Home"

	const iconClasses = cn("!h-6", "!w-6", "text-primary");

	const navigationLinkData: LinkData[] = [
		{
			href: "/income-calculator",
			children: "Income Calculator",
			icon: <Calculator className={iconClasses}/>
		},
		{
			href: "/budget-planner",
			children: "Budget Planner",
			icon: <PiggyBank className={iconClasses}/>
		}
	];

	const lgNavigationLinks = navigationLinkData.map(
		(destination) => (
			<NavigationMenuLink key={destination.href} href={destination.href}>
				<p>{destination.children}</p>
			</NavigationMenuLink>
		),
	);

	const smNavigationLinks = navigationLinkData.map(
		(destination) => (
			<NavigationMenuItem
				key={destination.href}>
				<NavigationMenuLink
					href={destination.href!}
					className={cn("flex", "flex-row", "items-center", "gap-3", "w-full")}>
					<div className={cn("bg-primary/15", "rounded-lg", "p-3")}>
						{destination.icon}
					</div>
					{destination.children}
				</NavigationMenuLink>
			</NavigationMenuItem>
		),
	);

	const lgScreenClassName = cn([
		"hidden",
		"md:flex",
		"flex-row",
		"items-center",
		"gap-4",
	])

	const smScreenClassName = cn([
		"flex",
		"md:hidden",
		"flex-col",
		"items-start",
		"gap-2",
	]);

	return (
		<nav
			className={cn("flex", "flex-row", "w-full", "items-center", "justify-between", "border-b-2", "p-4", "border-gray-200", "mb-10")}>
			<div className={cn(["flex", "flex-row", "w-full", "items-center", "justify-between", "gap-4"])}>
				<Link href={"/"}>
					<h4>{appName}</h4>
				</Link>

				{/* Large screen navigation */}
				<ShadcnNavigationMenu className={lgScreenClassName}>
					<NavigationMenuList className={cn(["gap-4"])}>
						{lgNavigationLinks}
					</NavigationMenuList>
				</ShadcnNavigationMenu>
			</div>

			{/*	Small screen sheet */}
			<ShadcnSheet>
				<SheetTrigger className={smScreenClassName}>
					<Menu/>
				</SheetTrigger>
				<SheetContent className={cn("w-full", "gap-0")}>
					<SheetHeader className={"gap-2"}>
						<SheetTitle className={"font-normal"} asChild>
							<h4>{appName}</h4>
						</SheetTitle>
					</SheetHeader>
					<div className={cn("flex", "flex-col", "w-full",)}>
						<Separator/>

						<NavigationMenu orientation={"vertical"}>
							<NavigationMenuList className={cn("flex-col", "items-start", "p-2")}>
								{smNavigationLinks}
							</NavigationMenuList>
						</NavigationMenu>
					</div>
				</SheetContent>
			</ShadcnSheet>
		</nav>
	);
};

export default HeaderNavigation;
