import { Button } from "@/components/ui";
import { LocalStorageKeys } from "@/constants";
import { ToastIcons } from "@/constants/ui";
import { ToastTitles, ToastTypes } from "@/enums";
import { showToast } from "@/lib";
import { authStore, globalStore } from "@/store";
import { useEffect } from "react";

export function Header(): React.ReactNode {
	const { clearIsAuthenticated, signOutDoctor: signOutUser } = authStore();
	const { errorMessage, clearErrorMessage, setErrorMessage } = globalStore();

	const signOutSession = async (): Promise<void> => {
		const response: string = await signOutUser();

		if (response !== "") {
			setErrorMessage(response);

			return;
		}

		clearIsAuthenticated();

		localStorage.removeItem(LocalStorageKeys.Id);
		localStorage.removeItem(LocalStorageKeys.Role);
	};

	useEffect((): void => {
		if (errorMessage !== "") {
			showToast({
				type: ToastTypes.Error,
				title: ToastTitles.Error,
				message: errorMessage,
				icon: ToastIcons.Error,
				onDismissAndOnAutoCloseFunctions: clearErrorMessage
			});
		}
	}, [errorMessage]);

	return (
		<header className="py-3 shadow-md">
			<div className="container flex h-20 items-center justify-between">
				<img src="/src/assets/images/ug-logo.png" alt="UG Logo" className="h-full" />

				<Button onClick={signOutSession}>Cerrar sesión</Button>
			</div>
		</header>
	);
}
