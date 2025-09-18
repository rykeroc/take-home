import * as React from "react"

import {cn} from "@/lib/utils"
import {Label} from '@/components/ui/label';
import {Input as ShadcnInput} from "@/components/ui/input";

interface InputProps extends React.ComponentProps<"input"> {
	label?: string;
}

function Input({id, label, className, type, prefix, ...props}: InputProps) {
	return (
		<div className="grid w-full items-center gap-3">
			{label && <Label htmlFor={id} className={cn("text-muted-foreground")}>{label}</Label>}
			<div className={cn("flex", "gap-2", "w-full")}>
				{
					prefix && (
						<span
							className="inline-flex items-center px-3 rounded-md border border-input bg-muted text-muted-foreground text-sm">
                      {prefix}
                  </span>
					)
				}
				<ShadcnInput
					id={id}
					type={type}
					data-slot="input"
					className={cn(
						"file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
						"focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
						"aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
						className
					)}
					{...props}
				/>
			</div>
		</div>
	)
}

export {Input}
