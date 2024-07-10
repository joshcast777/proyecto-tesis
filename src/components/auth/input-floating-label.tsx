// React Hook Form
import { ControllerRenderProps } from "react-hook-form";

// Components
import { FormControl, FormItem, FormLabel, FormMessage, Input } from "@/components/ui";

// Enums & Types
import { AuthFields } from "@/enums";
import { AuthForm } from "@/types";

/**
 * Props for the `InputFloatingLabel` component.
 *
 * @template {AuthFields} T
 */
type InputFloatingLabelProps<T extends AuthFields> = {
	field: ControllerRenderProps<AuthForm, T>;
	label: string;
	type: string;
};

/**
 * `InputFloatingLabel` is a reusable form control component for auth form fields.
 *
 * @export
 *
 * @template {AuthFields} T
 *
 * @param {InputFloatingLabelProps<T>} props - The properties for the component.
 * @param {ControllerRenderProps<AuthForm, T>} props.field - Controller properties for the form field.
 * @param {string} props.label - Label for the form field.
 * @param {string} props.type - Input type (e.g., 'text', 'email', 'password').
 *
 * @returns {React.ReactNode}
 */
export default function InputFloatingLabel<T extends AuthFields>({ field, label, type }: InputFloatingLabelProps<T>): React.ReactNode {
	return (
		<FormItem>
			<div className="relative">
				<FormControl>
					<Input {...field} type={type} className="border-b-1 login-input h-12 rounded-none border-transparent border-b-gray-50 bg-transparent text-center text-lg focus:outline-none" placeholder="" />
				</FormControl>

				<FormLabel className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-text text-2xl">{label}</FormLabel>
			</div>

			<div className="h-5">
				<FormMessage />
			</div>
		</FormItem>
	);
}
