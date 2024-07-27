import { ToastTypes } from "@/enums";

export type CustomToast = {
	type?: ToastTypes;
	title?: string;
	message?: string;
	icon?: React.ReactNode;
	actionLabel?: string;
	onActionClick?: () => void;
	onDismissAndOnAutoCloseFunctions?: () => void;
	onDismissFunction?: () => void;
	onAutoCloseFunction?: () => void;
};
