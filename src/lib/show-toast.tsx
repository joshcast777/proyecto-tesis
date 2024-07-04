import { ToastContent } from "@/components/ui";
import { ToastIcons } from "@/constants/ui";
import { ToastTitles, ToastTypeClasses, ToastTypes } from "@/enums";
import { CustomToast } from "@/types";
import { toast } from "sonner";

export function showToast(
	{ type, title, message, icon, onAutoCloseFunction, onDismissFunction, onDismissAndOnAutoCloseFunctions }: CustomToast = {
		type: ToastTypes.Success,
		title: ToastTitles.Success,
		message: "Message",
		icon: ToastIcons.Success
	}
): void {
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

	toast.error("", {
		className,
		description: <ToastContent title={title!} message={message!} />,
		icon: icon,
		duration: 3000,
		dismissible: false,
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
	});
}
