// React
import { useEffect, useState } from "react";

// React Router Dom
import { NavigateFunction, useNavigate, useParams } from "react-router-dom";

// React Hook Form
import { SubmitHandler, useForm } from "react-hook-form";

// Components
import { Button, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormTitle, Input, InputMask, Loader, RadioGroup, RadioGroupLayout } from "@/components/ui";

// Constants
import { DefaultValues, ErrorMessages } from "@/constants";
import { ToastIcons } from "@/constants/ui";

// Schemas
import { doctorSchema } from "@/schemas";

// Stores
import { authStore, doctorStore, globalStore } from "@/store";
import { zodResolver } from "@hookform/resolvers/zod";

// Enums & Types
import { DoctorFormFields, Roles, ToastTitles, ToastTypes } from "@/enums";
import { DoctorData, DoctorForm, SexData } from "@/types";

// Libraries
import { sex } from "@/data";
import { cn, showToast } from "@/lib";
import { format, parse } from "date-fns";

const { VITE_ADMIN_EMAIL } = import.meta.env;

/**
 * Form page for doctor.
 *
 * @export
 * @returns {React.ReactNode} The rendered form page for doctor.
 */
export default function FormDoctor(): React.ReactNode {
	const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

	const { signInUser, signOutUser, signUpUser } = authStore();
	const {
		doctor: { data },
		getDoctor,
		saveDoctor
	} = doctorStore();
	const { clearLocalStorage, errorMessage, isLoading, clearErrorMessage, enableLoading, disableLoading, setErrorMessage } = globalStore();

	const navigate: NavigateFunction = useNavigate();

	const { idParam } = useParams();

	const form = useForm<DoctorForm>({
		resolver: zodResolver(doctorSchema),
		defaultValues: DefaultValues.DoctorForm
	});

	let newId: string = "";

	const registerDoctor = async (email: string): Promise<boolean> => {
		const response: string = await signUpUser({
			email: email,
			password: email.split("@")[0]
		});

		if (response === ErrorMessages.CouldNotCompleteTask) {
			setErrorMessage(response);

			disableLoading();

			return false;
		}

		await signOutUser();

		clearLocalStorage();

		await signInUser({
			email: VITE_ADMIN_EMAIL,
			password: VITE_ADMIN_EMAIL.split("@")[0]
		});

		newId = response;

		return true;
	};

	const updateDoctor = async (formData: DoctorForm): Promise<boolean> => {
		const newDoctor: DoctorData = {
			...structuredClone(formData),
			birthDate: Boolean(idParam) ? data.birthDate : parse(formData.birthDate, "dd/MM/yyyy", new Date()),
			role: Roles.Doctor,
			creationDate: Boolean(idParam) ? data.creationDate : new Date(),
			status: true,
			updateDate: new Date()
		};

		const response: string = await saveDoctor(Boolean(idParam) ? idParam! : newId, newDoctor);

		if (response !== "") {
			setErrorMessage(response);

			disableLoading();

			return false;
		}

		disableLoading();

		return true;
	};

	const onSubmit: SubmitHandler<DoctorForm> = async (formData: DoctorForm): Promise<void> => {
		enableLoading();

		if (!Boolean(idParam)) {
			const value: boolean = await registerDoctor(formData.email);

			if (!value) {
				return;
			}
		}

		const value: boolean = await updateDoctor(formData);

		if (!value) {
			return;
		}

		setIsSubmitted(true);

		setTimeout((): void => {
			navigate("/admin/dashboard");
		}, 3000);

		showToast({
			type: ToastTypes.Success,
			title: ToastTitles.Success,
			message: "Doctor registrado, será redireccionado",
			icon: ToastIcons.Success
		});
	};

	const getDoctorById = async (id: string): Promise<void> => {
		enableLoading();

		const response: string = await getDoctor(id);

		if (response !== "") {
			setErrorMessage(response);

			disableLoading();

			return;
		}

		form.reset({
			...data,
			birthDate: format(data.birthDate, "dd/MM/yyyy")
		});

		disableLoading();
	};

	useEffect((): void => {
		if (idParam !== undefined) {
			getDoctorById(idParam);
		}
	}, []);

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

	if (isLoading) {
		return <Loader />;
	}

	return (
		<div className="flex min-h-screen w-full items-center justify-center overflow-y-auto bg-[url('/src/assets/images/background-doctor.webp')] bg-cover bg-center bg-no-repeat p-8">
			<div className="container rounded bg-blue-100/75 p-5 text-gray-900 lg:max-w-[1024px]">
				<FormTitle>{idParam === undefined ? "Ingreso de doctor" : "Editar doctor"}</FormTitle>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="mt-10 space-y-5">
						<div className="sm:grid sm:grid-cols-2 sm:gap-5">
							<FormField
								control={form.control}
								name={DoctorFormFields.Dni}
								render={({ field }): React.ReactElement => (
									<FormItem>
										<FormLabel className="text-lg">Cédula</FormLabel>

										<FormControl>
											<Input
												{...field}
												type="text"
												placeholder="0000000000"
												className={cn("text-base placeholder:text-base disabled:text-gray-900 disabled:opacity-75 md:h-12", {
													"shake-animation border-red-500 outline-red-500": Boolean(form.formState.errors.dni)
												})}
												disabled={idParam !== undefined}
											/>
										</FormControl>

										<div className="h-5">
											<FormMessage />
										</div>
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name={DoctorFormFields.FirstName}
								render={({ field }): React.ReactElement => (
									<FormItem>
										<FormLabel className="text-lg">Nombre</FormLabel>

										<FormControl>
											<Input
												{...field}
												type="text"
												placeholder="Víctor"
												className={cn("text-base placeholder:text-base disabled:text-gray-900 disabled:opacity-75 md:h-12", {
													"shake-animation border-red-500 outline-red-500": Boolean(form.formState.errors.firstName)
												})}
												disabled={idParam !== undefined}
											/>
										</FormControl>

										<div className="h-5">
											<FormMessage />
										</div>
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name={DoctorFormFields.LastName}
								render={({ field }): React.ReactElement => (
									<FormItem>
										<FormLabel className="text-lg">Apellido</FormLabel>

										<FormControl>
											<Input
												{...field}
												type="text"
												placeholder="Varas"
												className={cn("text-base placeholder:text-base disabled:text-gray-900 disabled:opacity-75 md:h-12", {
													"shake-animation border-red-500 outline-red-500": Boolean(form.formState.errors.lastName)
												})}
												disabled={idParam !== undefined}
											/>
										</FormControl>

										<div className="h-5">
											<FormMessage />
										</div>
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name={DoctorFormFields.BirthDate}
								render={({ field }): React.ReactElement => (
									<FormItem>
										<FormLabel className="text-lg">Fecha de nacimiento</FormLabel>

										<FormControl>
											<InputMask
												mask="99/99/9999"
												className={cn("flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-base placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 md:h-12", {
													"shake-animation border-red-500 outline-red-500": Boolean(form.formState.errors.birthDate)
												})}
												onChange={field.onChange}
												onBlur={field.onBlur}
												value={field.value}
												ref={field.ref}
												name={field.name}
												disabled={idParam !== undefined}
											/>
										</FormControl>

										<div className="h-5">
											<FormMessage />
										</div>
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name={DoctorFormFields.Sex}
								render={({ field }): React.ReactElement => (
									<FormItem>
										<FormLabel className="text-lg">Sexo</FormLabel>

										<FormControl>
											<RadioGroup onValueChange={field.onChange} defaultValue={field.value} value={field.value} className="flex h-10 w-56 justify-between md:h-12">
												{sex.map(
													(s: SexData): React.ReactNode => (
														<RadioGroupLayout key={s.value} sexData={s} disable={idParam !== undefined} />
													)
												)}
											</RadioGroup>
										</FormControl>

										<div className="h-5">
											<FormMessage />
										</div>
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name={DoctorFormFields.Email}
								render={({ field }): React.ReactElement => (
									<FormItem>
										<FormLabel className="text-lg">Correo</FormLabel>

										<FormControl>
											<Input
												{...field}
												type="email"
												placeholder="example@ug.edu.ec"
												className={cn("text-base placeholder:text-base disabled:text-gray-900 disabled:opacity-75 md:h-12", {
													"shake-animation border-red-500 outline-red-500": Boolean(form.formState.errors.email)
												})}
												disabled={idParam !== undefined}
											/>
										</FormControl>

										<div className="h-5">
											<FormMessage />
										</div>
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name={DoctorFormFields.Phone}
								render={({ field }): React.ReactElement => (
									<FormItem>
										<FormLabel className="text-lg">Celular</FormLabel>

										<FormControl>
											<Input
												{...field}
												type="phone"
												placeholder="0000000000"
												className={cn("text-base placeholder:text-base disabled:text-gray-900 disabled:opacity-75 md:h-12", {
													"shake-animation border-red-500 outline-red-500": Boolean(form.formState.errors.phone)
												})}
												disabled={idParam !== undefined}
											/>
										</FormControl>

										<div className="h-5">
											<FormMessage />
										</div>
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name={DoctorFormFields.LocationAddress}
								render={({ field }): React.ReactElement => (
									<FormItem>
										<FormLabel className="text-lg">Dirección</FormLabel>

										<FormControl>
											<Input
												{...field}
												type="text"
												placeholder="Guayaquil, Av. 9 de Octubre"
												className={cn("text-base placeholder:text-base disabled:text-gray-900 disabled:opacity-75 md:h-12", {
													"shake-animation border-red-500 outline-red-500": Boolean(form.formState.errors.locationAddress)
												})}
												disabled={idParam !== undefined}
											/>
										</FormControl>

										<div className="h-5">
											<FormMessage />
										</div>
									</FormItem>
								)}
							/>
						</div>

						<div className="mt-5 flex items-center justify-between sm:justify-end sm:gap-5">
							<Button
								type="reset"
								variant="outline"
								disabled={isSubmitted}
								className="w-28 border-blue-700 text-blue-700 hover:bg-blue-50 hover:text-blue-700 lg:text-lg"
								onClick={(): void => {
									form.reset();

									navigate("/admin/dashboard");
								}}
							>
								Volver
							</Button>

							<Button type="submit" disabled={isSubmitted} className="min-w-28 bg-blue-700 hover:bg-blue-800 lg:text-lg">
								Guardar
							</Button>
						</div>
					</form>
				</Form>
			</div>
		</div>
	);
}
