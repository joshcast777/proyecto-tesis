import { SelectValues } from "@/types";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./select";
import { cn } from "@/lib";

type SelectLayoutProps = {
	className?: string;
	defaultValue: string;
	placeholder: string;
	values: SelectValues[][];
	onValueChange: (event: string) => void;
};

export default function SelectLayout({ className, defaultValue, placeholder, values, onValueChange }: SelectLayoutProps): React.ReactNode {
	return (
		<Select defaultValue={defaultValue} onValueChange={onValueChange}>
			<SelectTrigger className={cn("text-muted-foreground", className !== undefined ? className : "")}>
				<SelectValue placeholder={placeholder} />
			</SelectTrigger>

			<SelectContent>
				{values.map((value: SelectValues[], index: number): React.ReactNode => {
					if (value[0].key === "GorupLabel") {
						return (
							<SelectGroup key={index}>
								{value.map(
									({ key, label }: SelectValues, index: number): React.ReactNode =>
										index === 0 ? (
											<SelectLabel>{label}</SelectLabel>
										) : (
											<SelectItem key={key} value={key}>
												{label}
											</SelectItem>
										)
								)}
							</SelectGroup>
						);
					}

					return value.slice(1).map(
						({ key, label }: SelectValues): React.ReactNode => (
							<SelectItem key={key} value={key}>
								{label}
							</SelectItem>
						)
					);
				})}
			</SelectContent>
		</Select>
	);
}
