// React
import { useEffect, useState } from "react";

// React Router Dom
import { NavigateFunction, useNavigate, useParams } from "react-router-dom";

// React Hook Form
import { SubmitHandler, useForm } from "react-hook-form";

// Components
import { DoctorFormControl } from "@/components/doctor";
import { Form, FormButtons, FormField, FormTitle, InputMask, Loader, RadioGroup, RadioGroupLayout } from "@/components/ui";
import { Loader2 } from "lucide-react";

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
import { DoctorForm, DoctorData, SexData } from "@/types";

// Libraries
import { format, parse } from "date-fns";
import { cn, showToast } from "@/lib";
import { sex } from "@/data";

// /**
//  * Type representing the authentication fields.
//  */
// type DoctorFieldObjects = {
// 	fieldName: DoctorFormFields;
// 	label: string;
// 	type: string;
// 	placeholder: string;
// };

// /**
//  * Object representing the labels of the authentication form.
//  *
//  * @type {DoctorForm}
//  */
// const doctorFieldLabels: Omit<DoctorForm, "sex"> & { sex: string } = {
// 	[DoctorFormFields.Dni]: "Cédula",
// 	[DoctorFormFields.FirstName]: "Nombre",
// 	[DoctorFormFields.LastName]: "Apellido",
// 	[DoctorFormFields.BirthDate]: "Fecha de nacimiento",
// 	[DoctorFormFields.Email]: "Correo",
// 	[DoctorFormFields.Sex]: "Sexo",
// 	[DoctorFormFields.Phone]: "Celular",
// 	[DoctorFormFields.LocationAddress]: "Dirección domiciliaria"
// };

// /**
//  * Object representing the type of the authentication form.
//  *
//  * @type {DoctorForm}
//  */
// const doctorTypes: Omit<DoctorForm, "sex"> & { sex: string } = {
// 	[DoctorFormFields.Dni]: "text",
// 	[DoctorFormFields.FirstName]: "text",
// 	[DoctorFormFields.LastName]: "text",
// 	[DoctorFormFields.BirthDate]: "text",
// 	[DoctorFormFields.Email]: "text",
// 	[DoctorFormFields.Sex]: "radio",
// 	[DoctorFormFields.Phone]: "text",
// 	[DoctorFormFields.LocationAddress]: "text"
// };

// /**
//  * Object representing the type of the authentication form.
//  *
//  * @type {DoctorForm}
//  */
// const doctorPlaceholders: Omit<DoctorForm, "sex"> & { sex: string } = {
// 	[DoctorFormFields.Dni]: "Cédula",
// 	[DoctorFormFields.FirstName]: "Nombre",
// 	[DoctorFormFields.LastName]: "Apellido",
// 	[DoctorFormFields.BirthDate]: "Fecha de nacimiento",
// 	[DoctorFormFields.Email]: "Correo",
// 	[DoctorFormFields.Sex]: "sexo",
// 	[DoctorFormFields.Phone]: "Celular",
// 	[DoctorFormFields.LocationAddress]: "Dirección domiciliaria"
// };

// /**
//  * Object representing the type of the authentication form.
//  *
//  * @type {DoctorForm}
//  */
// const doctorChildren: { [key in DoctorFormFields]: React.ReactNode } = {
// 	[DoctorFormFields.Dni]: null,
// 	[DoctorFormFields.FirstName]: null,
// 	[DoctorFormFields.LastName]: null,
// 	[DoctorFormFields.BirthDate]: null,
// 	[DoctorFormFields.Email]: null,
// 	[DoctorFormFields.Sex]: null,
// 	[DoctorFormFields.Phone]: null,
// 	[DoctorFormFields.LocationAddress]: null
// };

// /**
//  * Array of authentication field objects.
//  *
//  * @type {DoctorFieldObjects[]}
//  */
// const doctorFieldObjects: DoctorFieldObjects[] = Object.values(DoctorFormFields).map(
// 	(fieldName: DoctorFormFields): DoctorFieldObjects => ({
// 		fieldName,
// 		label: doctorFieldLabels[fieldName],
// 		placeholder: doctorPlaceholders[fieldName],
// 		type: doctorTypes[fieldName]
// 	})
// );

/**
 * Form page for doctor.
 *
 * @export
 * @returns {React.ReactNode} The rendered form page for doctor.
 */
export default function FormDoctor(): React.ReactNode {
	const [disabled, setDisabled] = useState<boolean>(false);

	const { signInDoctor, signOutDoctor, signUpDoctor } = authStore();
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
		const response: string = await signUpDoctor({
			email: email,
			password: email.split("@")[0]
		});

		if (response === ErrorMessages.CouldNotCompleteTask) {
			setErrorMessage(response);

			setDisabled(false);
			disableLoading();

			return false;
		}

		await signOutDoctor();

		clearLocalStorage();

		const { VITE_ADMIN_EMAIL } = import.meta.env;

		await signInDoctor({
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

			setDisabled(false);
			disableLoading();

			return false;
		}

		disableLoading();

		return true;
	};

	const onSubmit: SubmitHandler<DoctorForm> = async (formData: DoctorForm): Promise<void> => {
		setDisabled(true);
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

		showToast({
			type: ToastTypes.Success,
			title: ToastTitles.Success,
			message: "Doctor registrado, será redireccionado",
			icon: ToastIcons.Success,
			onDismissAndOnAutoCloseFunctions: (): void => {
				navigate("/admin/dashboard", {
					replace: true
				});
			}
		});
	};

	const getDoctorById = async (id: string): Promise<void> => {
		enableLoading();

		const response: string = await getDoctor(id);

		if (response !== "") {
			// clearLocalStorage();
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
				onDismissAndOnAutoCloseFunctions: clearErrorMessage
			});
		}
	}, [errorMessage]);

	return (
		<>
			{isLoading && <Loader />}

			<div className="flex min-h-screen w-full items-center justify-center overflow-y-auto bg-[url('/src/assets/images/background-doctor.webp')] bg-cover bg-center bg-no-repeat p-8">
				<div className="container rounded bg-blue-100/75 p-5 text-gray-900 lg:max-w-[1024px]">
					<FormTitle>{idParam === undefined ? "Ingreso de doctor" : "Editar doctor"}</FormTitle>

					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="mt-10 space-y-5">
							<div className="sm:grid sm:grid-cols-2 sm:gap-5">
								<FormField control={form.control} name={DoctorFormFields.Dni} render={({ field }): React.ReactElement => <DoctorFormControl<DoctorFormFields> controlState={Boolean(form.formState.errors.dni)} disabled={idParam !== undefined} field={field} label="Cédula" placeholder="Cédula" type="text" />} />

								<FormField control={form.control} name={DoctorFormFields.FirstName} render={({ field }): React.ReactElement => <DoctorFormControl<DoctorFormFields> controlState={Boolean(form.formState.errors.firstName)} disabled={idParam !== undefined} field={field} label="Nombre" placeholder="Nombre" type="text" />} />

								<FormField control={form.control} name={DoctorFormFields.LastName} render={({ field }): React.ReactElement => <DoctorFormControl<DoctorFormFields> controlState={Boolean(form.formState.errors.lastName)} disabled={idParam !== undefined} field={field} label="Apellido" placeholder="Apellido" type="text" />} />

								<FormField
									control={form.control}
									name={DoctorFormFields.BirthDate}
									render={({ field }): React.ReactElement => (
										<DoctorFormControl<DoctorFormFields> controlState={Boolean(form.formState.errors.birthDate)} disabled={idParam !== undefined} field={field} label="Fecha de nacimiento" placeholder="Fecha de nacimiento" type="text">
											<InputMask
												mask="99/99/9999"
												className={cn("flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-base placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 md:h-12", {
													"shake-animation border-red-500 outline-red-500": Boolean(form.formState.errors.lastName)
												})}
												onChange={field.onChange}
												onBlur={field.onBlur}
												value={field.value}
												ref={field.ref}
												name={field.name}
												disabled={idParam !== undefined}
											/>
										</DoctorFormControl>
									)}
								/>

								<FormField
									control={form.control}
									name={DoctorFormFields.Sex}
									render={({ field }): React.ReactElement => (
										<DoctorFormControl<DoctorFormFields> controlState={Boolean(form.formState.errors.birthDate)} disabled={idParam !== undefined} field={field} label="Fecha de nacimiento" placeholder="Sexo" type="text">
											<RadioGroup onValueChange={field.onChange} defaultValue={field.value} value={field.value} className="flex h-10 w-56 justify-between md:h-12">
												{sex.map(
													(s: SexData): React.ReactNode => (
														<RadioGroupLayout key={s.value} sexData={s} disable={idParam !== undefined} />
													)
												)}
											</RadioGroup>
										</DoctorFormControl>
									)}
								/>

								<FormField control={form.control} name={DoctorFormFields.Email} render={({ field }): React.ReactElement => <DoctorFormControl<DoctorFormFields> controlState={Boolean(form.formState.errors.email)} disabled={idParam !== undefined} field={field} label="Correo" placeholder="Correo" type="text" />} />

								<FormField control={form.control} name={DoctorFormFields.Phone} render={({ field }): React.ReactElement => <DoctorFormControl<DoctorFormFields> controlState={Boolean(form.formState.errors.phone)} field={field} label="Celular" placeholder="Celular" type="text" />} />

								<FormField control={form.control} name={DoctorFormFields.LocationAddress} render={({ field }): React.ReactElement => <DoctorFormControl<DoctorFormFields> controlState={Boolean(form.formState.errors.locationAddress)} field={field} label="Dirección" placeholder="Dirección" type="text" />} />
							</div>

							<FormButtons
								disabled={disabled}
								resetButtonLabel="Cancelar"
								resetFunction={form.reset}
								route="/admin/dashboard"
								saveButtonLabel="Guardar"
								waitingButtonLabel={
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" /> Por favor, espere...
									</>
								}
							/>
						</form>
					</Form>
				</div>
			</div>
		</>
	);
}
