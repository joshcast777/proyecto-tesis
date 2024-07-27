// React
import { useEffect } from "react";

// React Router Dom
import { NavigateFunction, useNavigate } from "react-router-dom";

// React Hook Form
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

// Components
import { InputFloatingLabel } from "@/components/auth";
import { Button, Form, FormField } from "@/components/ui";
import { Loader2 } from "lucide-react";

// Constants
import { DefaultValues, ErrorMessages } from "@/constants";
import { ToastIcons } from "@/constants/ui";

// Schemas
import { authSchema } from "@/schemas";

// Stores
import { authStore, doctorStore, globalStore } from "@/store";

// Utils
import { showToast } from "@/lib";

// Enums & Types
import { AuthFields, LocalStorageKeys, ToastTitles, ToastTypes } from "@/enums";
import { AuthForm } from "@/types";

/**
 * Type representing the authentication fields.
 */
type AuthFieldObjects = {
	fieldName: AuthFields;
	label: string;
	type: string;
};

/**
 * Object representing the labels of the authentication form.
 *
 * @type {AuthForm}
 */
const authFieldLabels: AuthForm = {
	[AuthFields.Email]: "Correo",
	[AuthFields.Password]: "Contraseña"
};

/**
 * Object representing the type of the authentication form.
 *
 * @type {AuthForm}
 */
const authTypes: AuthForm = {
	[AuthFields.Email]: "email",
	[AuthFields.Password]: "password"
};

/**
 * Array of authentication field objects.
 *
 * @type {AuthFieldObjects[]}
 */
const authFieldObjects: AuthFieldObjects[] = Object.values(AuthFields).map(
	(fieldName: AuthFields): AuthFieldObjects => ({
		fieldName,
		label: authFieldLabels[fieldName],
		type: authTypes[fieldName]
	})
);

/**
 * Authentication page.
 *
 * @export
 * @returns {React.ReactNode} The rendered auth page.
 */
export default function Auth(): React.ReactNode {
	const { clearIsAuthenticated, getCurrentPatient, getCurrentUser, signInUser, signOutUser } = authStore();
	const { checkDoctor } = doctorStore();
	const { errorMessage, isLoading, clearErrorMessage, clearLocalStorage, enableLoading, disableLoading, setErrorMessage } = globalStore();

	const navigate: NavigateFunction = useNavigate();

	const form = useForm<AuthForm>({
		resolver: zodResolver(authSchema),
		defaultValues: DefaultValues.Login
	});

	const clearInfo = (response: string): void => {
		clearLocalStorage();
		clearIsAuthenticated();
		setErrorMessage(response);
		disableLoading();
	};

	const onSubmit = async (formData: AuthForm): Promise<void> => {
		enableLoading();

		let response: string = "";

		if (formData.email.includes("@ug")) {
			response = await checkDoctor(formData.email);

			if (response !== "") {
				clearInfo(response);

				return;
			}
		}

		response = await signInUser(formData);

		if (response === ErrorMessages.InvalidCredentials || response === ErrorMessages.CouldNotCompleteTask) {
			clearInfo(response);

			return;
		}

		if (formData.email.includes("@ug")) {
			response = await getCurrentUser(response);
		} else {
			response = await getCurrentPatient(response);
		}

		if (response !== "") {
			await signOutUser();
			clearInfo(response);

			return;
		}

		disableLoading();

		navigate(`/${localStorage.getItem(LocalStorageKeys.Role)!}/dashboard`);

		return;
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
		<div className="flex min-h-screen w-full items-center justify-center overflow-y-auto bg-[url('/src/assets/images/background-login.jpg')] bg-cover bg-center bg-no-repeat p-8">
			<div className="mx-5 rounded bg-blue-900/75 p-5 text-gray-100 landscape:my-10">
				<h3 className="mb-11 text-center text-5xl font-bold">Inicio de sesión</h3>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						{authFieldObjects.map(
							({ fieldName, label, type }: AuthFieldObjects): React.ReactNode => (
								<FormField key={fieldName} control={form.control} name={fieldName} render={({ field }): React.ReactElement => <InputFloatingLabel<AuthFields> field={field} label={label} type={type} />} />
							)
						)}

						<Button type="submit" size={"lg"} className="h-11 w-full text-lg" disabled={isLoading}>
							{isLoading ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando
								</>
							) : (
								<>Iniciar sesión</>
							)}
						</Button>
					</form>
				</Form>
			</div>
		</div>
	);
}
