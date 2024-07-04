import { FormControl, FormLabel, FormMessage, Input } from "@/components/ui";
import { AuthFields } from "@/enums";
import { AuthForm } from "@/types";
import { ControllerRenderProps } from "react-hook-form";

type InputFloatingLabelProps<T extends AuthFields> = {
	field: ControllerRenderProps<AuthForm, T>;
	label: string;
	type: string;
};

export default function InputFloatingLabel<T extends AuthFields>({ field, label, type }: InputFloatingLabelProps<T>): React.ReactNode {
	return (
		<>
			<div className="relative">
				<FormControl>
					<Input {...field} type={type} className="border-b-1 login-input h-12 rounded-none border-transparent border-b-gray-50 bg-transparent text-center text-lg focus:outline-none" placeholder="" />
				</FormControl>

				<FormLabel className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-text text-2xl">{label}</FormLabel>
			</div>

			<div className="h-5">
				<FormMessage />
			</div>
		</>
	);
}
