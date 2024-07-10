import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";

import { Form, FormButtons, FormField, FormTitle, InputMask, Loader, RadioGroup, RadioGroupLayout, Separator } from "@/components/ui";
import { DefaultValues } from "@/constants";
import { ToastIcons } from "@/constants/ui";
import { sex } from "@/data";
import { PatientFormFields, ToastTitles, ToastTypes } from "@/enums";
import { cn, showToast } from "@/lib";
import { patientSchema } from "@/schemas";
import { authStore, globalStore, patientStore } from "@/store";
import { PatientData, PatientForm, SexData } from "@/types";
import { format, parse } from "date-fns";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { NavigateFunction, useNavigate, useParams } from "react-router-dom";
import { LastAppointmentSummary, PatientFormControl } from "@/components/patient";

export default function FormPatient(): React.ReactNode {
	const [disabled, setDisabled] = useState<boolean>(false);

	const { currentDoctor } = authStore();
	const {
		currentPatient: { id: idPatient, data: dataPatient },
		clearCurrentPatient,
		clearCurrentAppointment,
		editPatient,
		getAppointment,
		getPatient,
		savePatient
	} = patientStore();
	const { errorMessage, isLoading, clearErrorMessage, enableLoading, disableLoading, setErrorMessage } = globalStore();

	const navigate: NavigateFunction = useNavigate();

	const { id: idParam } = useParams();

	const form = useForm<PatientForm>({
		resolver: zodResolver(patientSchema),
		defaultValues: DefaultValues.PatientForm
	});

	const onSubmit: SubmitHandler<PatientForm> = async (formData: PatientForm): Promise<void> => {
		if (!form.formState.isDirty) {
			navigate(`/doctor/appointment/pose-estimation/${idParam}`, {
				replace: true
			});

			return;
		}

		setDisabled(true);
		enableLoading();

		const newPatient: PatientData = {
			...structuredClone(formData),
			birthDate: Boolean(idParam) ? dataPatient.birthDate : parse(formData.birthDate, "dd/MM/yyyy", new Date()),
			creationDate: Boolean(idParam) ? dataPatient.creationDate : new Date(),
			nameDoctorCreation: Boolean(idParam) ? dataPatient.nameDoctorCreation : `${currentDoctor.data.firstName} ${currentDoctor.data.lastName}`,
			idDoctorCreation: Boolean(idParam) ? dataPatient.idDoctorCreation : currentDoctor.id
		};

		let response: string = "";

		if (idParam === undefined) {
			response = await savePatient(newPatient);
		} else {
			response = await editPatient({
				id: idParam,
				data: newPatient
			});
		}

		if (response !== "") {
			setErrorMessage(response);

			disableLoading();
			setDisabled(false);

			return;
		}

		disableLoading();

		showToast({
			type: ToastTypes.Success,
			title: ToastTitles.Success,
			message: "Paciente registrado, será redireccionado",
			icon: ToastIcons.Success,
			onDismissAndOnAutoCloseFunctions: (): void => {
				navigate(`/doctor/appointment/pose-estimation/${idParam}`, {
					replace: true
				});
			}
		});
	};

	const getPatientData = async (): Promise<void> => {
		enableLoading();

		const response: string = await getPatient(idParam!);

		if (response !== "") {
			setErrorMessage(response);

			disableLoading();

			return;
		}
	};

	const getAppointmentData = async (): Promise<void> => {
		await getAppointment();

		disableLoading();
	};

	useEffect((): void => {
		if (idParam !== undefined) {
			getPatientData();
		}

		console.log(isLoading);
	}, []);

	useEffect((): void => {
		if (idPatient !== "") {
			form.reset({
				...dataPatient,
				birthDate: format(dataPatient.birthDate, "dd/MM/yyyy")
			});

			getAppointmentData();
		}

		console.log(isLoading);
	}, [idPatient]);

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

			<div className="flex min-h-screen w-full items-center justify-center overflow-y-auto bg-[url('/src/assets/images/background-patient.webp')] bg-cover bg-center bg-no-repeat p-8">
				<div className="container rounded bg-blue-300/75 p-5 text-gray-900 lg:max-w-[1024px]">
					<FormTitle>Información del paciente</FormTitle>

					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="mt-10">
							<div className="space-5 sm:grid sm:grid-cols-2 sm:gap-5">
								<FormField control={form.control} name={PatientFormFields.Dni} render={({ field }): React.ReactElement => <PatientFormControl<PatientFormFields> controlState={Boolean(form.formState.errors.dni)} disabled={idParam !== undefined} field={field} label="Cédula" placeholder="Cédula" type="text" />} />

								<FormField control={form.control} name={PatientFormFields.FirstName} render={({ field }): React.ReactElement => <PatientFormControl<PatientFormFields> controlState={Boolean(form.formState.errors.firstName)} disabled={idParam !== undefined} field={field} label="Nombre" placeholder="Nombre" type="text" />} />

								<FormField control={form.control} name={PatientFormFields.LastName} render={({ field }): React.ReactElement => <PatientFormControl<PatientFormFields> controlState={Boolean(form.formState.errors.lastName)} disabled={idParam !== undefined} field={field} label="Apellido" placeholder="Apellido" type="text" />} />

								<FormField
									control={form.control}
									name={PatientFormFields.BirthDate}
									render={({ field }): React.ReactElement => (
										<PatientFormControl<PatientFormFields> controlState={Boolean(form.formState.errors.birthDate)} disabled={idParam !== undefined} field={field} label="Fecha de nacimiento" placeholder="Fecha de nacimiento" type="text">
											<InputMask
												mask="99/99/9999"
												className={cn("flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-base placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:text-gray-900 disabled:opacity-50 md:h-12", {
													"shake-animation border-red-500 outline-red-500": Boolean(form.formState.errors.lastName)
												})}
												onChange={field.onChange}
												onBlur={field.onBlur}
												value={field.value}
												ref={field.ref}
												name={field.name}
												disabled={idParam !== undefined}
											/>
										</PatientFormControl>
									)}
								/>

								<FormField
									control={form.control}
									name={PatientFormFields.Sex}
									render={({ field }): React.ReactElement => (
										<PatientFormControl<PatientFormFields> controlState={Boolean(form.formState.errors.sex)} disabled={idParam !== undefined} field={field} label="Sexo" placeholder="Sexo" type="radio">
											<RadioGroup onValueChange={field.onChange} defaultValue={field.value} value={field.value} className="flex h-10 w-56 justify-between md:h-12">
												{sex.map(
													(s: SexData): React.ReactNode => (
														<RadioGroupLayout key={s.value} sexData={s} disable={idParam !== undefined} />
													)
												)}
											</RadioGroup>
										</PatientFormControl>
									)}
								/>

								<FormField control={form.control} name={PatientFormFields.Phone} render={({ field }): React.ReactElement => <PatientFormControl<PatientFormFields> controlState={Boolean(form.formState.errors.phone)} field={field} label="Celular" placeholder="Celular" type="text" />} />

								<FormField control={form.control} name={PatientFormFields.LocationAddress} render={({ field }): React.ReactElement => <PatientFormControl<PatientFormFields> controlState={Boolean(form.formState.errors.locationAddress)} field={field} label="Dirección" placeholder="Dirección" type="text" />} />
							</div>

							{idParam === undefined ? (
								<FormButtons
									disabled={disabled}
									resetButtonLabel="Cancelar"
									resetFunction={form.reset}
									route="/doctor/dashboard"
									saveButtonLabel="Continuar"
									waitingButtonLabel={
										<>
											<Loader2 className="mr-2 h-4 w-4 animate-spin" /> Por favor, espere...
										</>
									}
								/>
							) : (
								<>
									<Separator className="mb-6" />

									<FormTitle>Resumen de la consulta previa</FormTitle>

									<LastAppointmentSummary />

									<FormButtons
										disabled={disabled}
										resetButtonLabel="Cancelar"
										resetFunction={(): void => {
											form.reset();
											clearCurrentPatient();
											clearCurrentAppointment();
										}}
										route="/doctor/dashboard"
										saveButtonLabel="Continuar"
										waitingButtonLabel={
											<>
												<Loader2 className="mr-2 h-4 w-4 animate-spin" /> Por favor, espere...
											</>
										}
									/>
								</>
							)}
						</form>
					</Form>
				</div>
			</div>
		</>
	);
}
