// React Hook Form
import { ControllerRenderProps } from "react-hook-form";

// Components
import { FormControl, FormItem, FormLabel, FormMessage, Input } from "../ui";

// Enums & Types
import { PatientFormFields } from "@/enums";
import { PatientForm } from "@/types";

// Libraries
import { cn } from "@/lib";

/**
 * Props for the `PatientFormControl` component.
 *
 * @template {PatientFormFields} T
 */
type PatientFormControlProps<T extends PatientFormFields> = {
	children?: React.ReactNode;
	controlState: boolean;
	disabled?: boolean;
	field: ControllerRenderProps<PatientForm, T>;
	label: string;
	placeholder: string;
	type: string;
};

/**
 * `PatientFormControl` is a reusable form control component for patient form fields.
 *
 * @export
 *
 * @template {PatientFormFields} T - Type of the patient form fields.
 *
 * @param {PatientFormControlProps<T>} props - The properties for the component.
 * @param {React.ReactNode} props.children - Optional children elements to customize the form control.
 * @param {boolean} props.controlState - Indicates the control state to add specific classes.
 * @param {boolean} [props.disabled=false] - Indicates if the input field should be disabled.
 * @param {ControllerRenderProps<PatientForm, T>} props.field - Controller properties for the form field.
 * @param {string} props.label - Label for the form field.
 * @param {string} props.placeholder - Placeholder text for the input field.
 * @param {string} props.type - Input type (e.g., 'text', 'email', 'password').
 *
 * @returns {React.ReactNode}
 */
export default function PatientFormControl<T extends PatientFormFields>({ children, controlState, disabled = false, field, label, placeholder, type }: PatientFormControlProps<T>): React.ReactNode {
	return (
		<FormItem>
			<FormLabel className="text-lg">{label}</FormLabel>

			<FormControl>
				{Boolean(children) ? (
					children
				) : (
					<Input
						{...field}
						type={type}
						placeholder={placeholder}
						className={cn("text-base placeholder:text-base disabled:text-gray-900 disabled:opacity-75 md:h-12", {
							"shake-animation border-red-500 outline-red-500": controlState
						})}
						disabled={disabled}
					/>
				)}
			</FormControl>

			<div className="h-5">
				<FormMessage />
			</div>
		</FormItem>
	);
}
