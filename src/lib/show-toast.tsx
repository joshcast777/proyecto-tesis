import { ToastContent } from "@/components/ui";
import { ToastIcons } from "@/constants/ui";
import { ToastTitles, ToastTypeClasses, ToastTypes } from "@/enums";
import { CustomToast } from "@/types";
import { ExternalToast, toast } from "sonner";

export function showToast({ actionLabel = "", type = ToastTypes.Success, title = ToastTitles.Success, message = "", icon = ToastIcons.Success, onActionClick, onAutoCloseFunction, onDismissFunction, onDismissAndOnAutoCloseFunctions }: CustomToast): void {
	let className: string = "";

	if (type === ToastTypes.Error) {
		className = ToastTypeClasses.Error;
	} else if (type === ToastTypes.Info) {
		className = ToastTypeClasses.Info;
	} else if (type === ToastTypes.Success) {
		className = ToastTypeClasses.Success;
	} else {
		className = ToastTypeClasses.Warn;
	}

	const data: ExternalToast = {
		className,
		description: <ToastContent title={title} message={message} />,
		icon: icon,
		dismissible: false,
		duration: 3000,
		onDismiss: (): void => {
			if (onDismissFunction !== undefined) {
				onDismissFunction();

				return;
			} else if (onDismissAndOnAutoCloseFunctions !== undefined) {
				onDismissAndOnAutoCloseFunctions();
			}
		},
		onAutoClose: (): void => {
			if (onAutoCloseFunction !== undefined) {
				onAutoCloseFunction();

				return;
			} else if (onDismissAndOnAutoCloseFunctions !== undefined) {
				onDismissAndOnAutoCloseFunctions();
			}
		}
	};

	if (onActionClick !== undefined) {
		data.action = {
			label: actionLabel,
			onClick: onActionClick
		};
	}

	toast("", data);
}
