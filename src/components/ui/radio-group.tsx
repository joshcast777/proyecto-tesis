import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { Circle } from "lucide-react";

import { cn } from "@/lib/utils";
import { FormControl, FormItem, FormLabel } from "./form";
import { SexData } from "@/types";

type RadioGroupLayoutProps = {
	sexData: SexData;
	disable: boolean;
};

const RadioGroup = React.forwardRef<React.ElementRef<typeof RadioGroupPrimitive.Root>, React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>>(({ className, ...props }, ref) => {
	return <RadioGroupPrimitive.Root className={cn("grid gap-2", className)} {...props} ref={ref} />;
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const RadioGroupItem = React.forwardRef<React.ElementRef<typeof RadioGroupPrimitive.Item>, React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>>(({ className, ...props }, ref) => {
	return (
		<RadioGroupPrimitive.Item ref={ref} className={cn("aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", className)} {...props}>
			<RadioGroupPrimitive.Indicator className="flex items-center justify-center">
				<Circle className="h-2.5 w-2.5 fill-current text-current" />
			</RadioGroupPrimitive.Indicator>
		</RadioGroupPrimitive.Item>
	);
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

const RadioGroupLayout = ({ sexData, disable }: RadioGroupLayoutProps): React.ReactNode => {
	return (
		<FormItem className="flex items-center space-x-3 space-y-0 disabled:text-gray-900 disabled:opacity-75">
			<FormControl>
				<RadioGroupItem value={sexData.value} disabled={disable} />
			</FormControl>

			<FormLabel
				className={cn("text-base font-normal", {
					"cursor-not-allowed": disable
				})}
			>
				{sexData.label}
			</FormLabel>
		</FormItem>
	);
};

export { RadioGroup, RadioGroupItem, RadioGroupLayout };
