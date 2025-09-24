"use client";

import {
	NavigationMenu as ShadcnNavigationMenu,
	NavigationMenuLink,
	NavigationMenuList,
} from "@/components/ui/navigation-menu";
import * as React from "react";
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import Link from 'next/link';
import {List, Menu, Users} from 'lucide-react';
import {
	Sheet as ShadcnSheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger
} from '@/components/ui/sheet';
import {Separator} from '@/components/ui/separator';
import {cn} from '@/lib/utils';
import {ClassProp} from 'class-variance-authority/types';

interface LinkData extends React.ComponentProps<
	typeof NavigationMenuPrimitive.Link
> {
	icon: React.ReactNode
}

type NavigationMenuProps = ClassProp

const NavigationMenu = (props: NavigationMenuProps) => {
	const appName = "Finance Helper"

	const iconSizes = cn(["!h-6", "!w-6"])

	const navigationLinkData: LinkData[] = [
		{
			href: "/income-calculator",
			children: "Income Calculator",
			icon: <List className={iconSizes}/>
		},
		{
			href: "/budget-planner",
			children: "Budget Planner",
			icon: <Users className={iconSizes}/>
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
			<NavigationMenuLink key={destination.href} href={destination.href}
			                    className={cn(["flex", "flex-row", "items-center", "gap-2"])}>
				{destination.icon}
				<h4>{destination.children}</h4>
			</NavigationMenuLink>
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
			className={cn([props.className, "flex", "flex-row", "w-full", "items-center", "justify-between", "border-b-2", "p-4", "border-gray-200",])}>
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
				<SheetContent className={cn(["w-full", "gap-0"])}>
					<SheetHeader>
						<SheetTitle asChild>
							<h1>Wishes</h1>
						</SheetTitle>
						<Separator/>
					</SheetHeader>
					<ShadcnNavigationMenu className={cn(["items-start"])}>
						<NavigationMenuList className={cn(["flex", "flex-col", "items-start", "gap-4", "ps-2"])}>
							{smNavigationLinks}
						</NavigationMenuList>
					</ShadcnNavigationMenu>
				</SheetContent>
			</ShadcnSheet>
		</nav>
	);
};

export default NavigationMenu;
