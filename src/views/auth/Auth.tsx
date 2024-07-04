import { InputFloatingLabel } from "@/components/auth";
import { Button, Form, FormField, FormItem } from "@/components/ui";
import { DefaultValues, ErrorMessages, LocalStorageKeys } from "@/constants";
import { ToastIcons } from "@/constants/ui";
import { AuthFields, ToastTitles, ToastTypes } from "@/enums";
import { showToast } from "@/lib";
import { formSchema } from "@/schemas";
import { authStore, doctorStore, globalStore } from "@/store";
import { AuthForm, AuthUser, Doctor } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { NavigateFunction, useNavigate } from "react-router-dom";

export default function Auth(): React.ReactNode {
	const { clearIsAuthenticated, setIsAuthenticated, signInDoctor: signInUser, signOutDoctor: signOutUser } = authStore();
	const { checkDoctor, getDoctor } = doctorStore();
	const { errorMessage, isLoading, clearErrorMessage, enableLoading, disableLoading, setErrorMessage } = globalStore();

	const navigate: NavigateFunction = useNavigate();

	const authFieldLabels = {
		[AuthFields.Email]: "Correo",
		[AuthFields.Password]: "Contraseña"
	};

	const authTypes = {
		[AuthFields.Email]: "email",
		[AuthFields.Password]: "password"
	};

	const authFieldObjects = Object.values(AuthFields).map((fieldName) => ({
		fieldName,
		label: authFieldLabels[fieldName],
		type: authTypes[fieldName]
	}));

	const form = useForm<AuthForm>({
		resolver: zodResolver(formSchema),
		defaultValues: DefaultValues.Login
	});

	const onSubmit = async (formData: AuthUser): Promise<void> => {
		enableLoading();

		let response: string = await checkDoctor(formData.email);

		if (response !== "") {
			localStorage.removeItem(LocalStorageKeys.Id);
			localStorage.removeItem(LocalStorageKeys.Role);

			clearIsAuthenticated();
			setErrorMessage(response);
			disableLoading();

			return;
		}

		const authUser: AuthUser = structuredClone(formData);

		response = await signInUser(authUser);

		if (response === ErrorMessages.InvalidCredentials || response === ErrorMessages.CouldNotCompleteTask) {
			localStorage.removeItem(LocalStorageKeys.Id);
			localStorage.removeItem(LocalStorageKeys.Role);

			clearIsAuthenticated();
			setErrorMessage(response);
			disableLoading();

			return;
		}

		const doctorResponse: Doctor | string = await getDoctor(response);

		if (typeof doctorResponse === "string") {
			localStorage.removeItem(LocalStorageKeys.Id);
			localStorage.removeItem(LocalStorageKeys.Role);

			signOutUser();
			clearIsAuthenticated();
			setErrorMessage(doctorResponse);
			disableLoading();

			return;
		}

		localStorage.setItem(LocalStorageKeys.Id, doctorResponse.id);
		localStorage.setItem(LocalStorageKeys.Role, doctorResponse.role);

		setIsAuthenticated(doctorResponse);

		disableLoading();

		navigate(`/${doctorResponse.role}/dashboard`);

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
							({ fieldName, label, type }: { fieldName: AuthFields; label: string; type: string }): React.ReactNode => (
								<FormField
									key={fieldName}
									control={form.control}
									name={fieldName}
									render={({ field }) => (
										<FormItem className="text-center">
											<InputFloatingLabel<AuthFields> field={field} label={label} type={type} />
										</FormItem>
									)}
								/>
							)
						)}

						<Button type="submit" size={"lg"} className="h-11 w-full text-lg" disabled={isLoading}>
							{isLoading ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" /> Por favor, espere...
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
