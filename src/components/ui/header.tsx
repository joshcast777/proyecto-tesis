// React
import { useEffect } from "react";

// Components
import { Button } from "@/components/ui";

// Constants
import { ToastIcons } from "@/constants/ui";

// Stores
import { authStore, globalStore } from "@/store";

// Utils
import { showToast } from "@/lib";

// Enums & Types
import { ToastTitles, ToastTypes } from "@/enums";

import { UgLogo } from "@/assets/images";
import { NavigateFunction, useNavigate } from "react-router-dom";

export function Header(): React.ReactNode {
	const { clearIsAuthenticated, signOutUser } = authStore();
	const { errorMessage, clearErrorMessage, clearLocalStorage, setErrorMessage } = globalStore();

	const navigate: NavigateFunction = useNavigate();

	const signOutSession = async (): Promise<void> => {
		const response: string = await signOutUser();

		if (response !== "") {
			setErrorMessage(response);

			return;
		}

		clearIsAuthenticated();
		clearLocalStorage();

		navigate("/auth");
	};

	useEffect((): void => {
		if (errorMessage !== "") {
			showToast({
				type: ToastTypes.Error,
				title: ToastTitles.Error,
				message: errorMessage,
				icon: ToastIcons.Error,
				actionLabel: "Ok",
				onActionClick: clearErrorMessage,
				onDismissAndOnAutoCloseFunctions: clearErrorMessage
			});
		}
	}, [errorMessage]);

	return (
		<header className="py-3 shadow-md">
			<div className="container flex h-20 items-center justify-between">
				<img src={UgLogo} alt="UG Logo" className="h-full" />

				<Button onClick={signOutSession}>Cerrar sesión</Button>
			</div>
		</header>
	);
}
