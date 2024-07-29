// React Router Dom
import { NavigateFunction, useNavigate } from "react-router-dom";

// Components
import { Button } from "./button";

// Stores
import { globalStore } from "@/store";

/**
 * Props for the `FormButtons` component.
 */
type FormButtonsProps = {
	disabled?: boolean;
	disabledResetButton?: boolean;
	disabledSaveButton?: boolean;
	resetButtonLabel: string;
	resetRoute: string;
	saveButtonLabel: string;
	saveButtonType?: "submit" | "button";
	waitingButtonLabel: string | React.ReactNode;
	resetFunction: () => void;
	saveFunction?: () => void;
};

/**
 * `FormButtons` is a component that renders reset and submit buttons for a form.
 *
 * @export
 *
 * @param {FormButtonsProps} props - The properties for the component.
 * @param {boolean} props.disabled - Indicates if the buttons should be disabled.
 * @param {string} props.resetButtonLabel - Label for the reset button.
 * @param {() => void} props.resetFunction - Function to call when the reset button is clicked.
 * @param {string} props.route - Route to navigate to after resetting the form.
 * @param {string} props.saveButtonLabel - Label for the save (submit) button.
 * @param {string | React.ReactNode} waitingButtonLabel - Label for the save button when in a loading state.
 *
 * @returns {React.ReactNode}
 */
export default function FormButtons({ disabled = false, disabledResetButton = false, disabledSaveButton = false, resetButtonLabel, resetRoute, saveButtonLabel, saveButtonType = "submit", waitingButtonLabel, resetFunction, saveFunction }: FormButtonsProps): React.ReactNode {
	const { isLoading } = globalStore();

	const navigate: NavigateFunction = useNavigate();

	return (
		<div className="mt-5 flex items-center justify-between sm:justify-end sm:gap-5">
			<Button
				type="reset"
				variant="outline"
				disabled={disabled || disabledResetButton}
				onClick={(): void => {
					resetFunction();

					navigate(resetRoute);
				}}
				className="w-28 border-blue-700 text-blue-700 hover:bg-blue-50 hover:text-blue-700 lg:text-lg"
			>
				{resetButtonLabel}
			</Button>

			<Button
				type={saveButtonType}
				disabled={disabled || disabledSaveButton}
				onClick={(): void => {
					if (saveButtonType === "button" && saveFunction !== undefined) {
						saveFunction();
					}
				}}
				className="min-w-28 bg-blue-700 hover:bg-blue-800 lg:text-lg"
			>
				{isLoading ? waitingButtonLabel : saveButtonLabel}
			</Button>
		</div>
	);
}
