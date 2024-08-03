// React
import { useEffect } from "react";

// Components
import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui";

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
import { ChevronDown } from "lucide-react";

export function Header(): React.ReactNode {
	const { currentPatient, currentUser, clearIsAuthenticated, signOutUser } = authStore();
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
		<header className="bg-blue-200 py-3 shadow-lg">
			<div className="container flex h-20 items-center justify-between">
				<img src={UgLogo} alt="UG Logo" className="h-full" />

				<DropdownMenu>
					<DropdownMenuTrigger>
						<Button className="text-lg" variant="link">
							{currentUser.id === "" ? `${currentPatient.data.firstName} ${currentPatient.data.lastName}` : `${currentUser.data.firstName} ${currentUser.data.lastName}`} <ChevronDown />
						</Button>
					</DropdownMenuTrigger>

					<DropdownMenuContent>
						<DropdownMenuItem onClick={signOutSession}>Cerrar sesión</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</header>
	);
}
