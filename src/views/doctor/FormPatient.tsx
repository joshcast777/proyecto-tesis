import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";

import PatientPdf from "@/components/doctor/patient-pdf";
import { LastAppointmentSummary } from "@/components/patient";
import { Button, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormTitle, Input, InputMask, Loader, RadioGroup, RadioGroupLayout, Separator } from "@/components/ui";
import { DefaultValues, ErrorMessages } from "@/constants";
import { ToastIcons } from "@/constants/ui";
import { sex } from "@/data";
import { LocalStorageKeys, PatientFormFields, ToastTitles, ToastTypes } from "@/enums";
import { cn, showToast } from "@/lib";
import { patientSchema } from "@/schemas";
import { authStore, globalStore, patientStore } from "@/store";
import { Patient, PatientForm, SexData } from "@/types";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { format, parse } from "date-fns";
import { FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { NavigateFunction, useNavigate, useParams } from "react-router-dom";

export default function FormPatient(): React.ReactNode {
	const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

	const { currentUser, signInUser, signUpUser } = authStore();
	const {
		currentPatient: { id: idPatient, data: dataPatient },
		currentAppointment: { id: idAppointment, data: dataAppointment },
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
		if (idParam !== undefined && !form.formState.isDirty) {
			navigate(`/doctor/appointment/pose-estimation/${idParam}`);

			return;
		}

		enableLoading();

		let response: string = "";

		const newPatient: Patient = {
			id: response,
			data: {
				...structuredClone(formData),
				role: "patient",
				lastAppointmentDate: Boolean(idParam) ? dataPatient.lastAppointmentDate : null,
				birthDate: Boolean(idParam) ? dataPatient.birthDate : parse(formData.birthDate, "dd/MM/yyyy", new Date()),
				creationDate: Boolean(idParam) ? dataPatient.creationDate : new Date(),
				nameDoctorCreation: Boolean(idParam) ? dataPatient.nameDoctorCreation : `${currentUser.data.firstName} ${currentUser.data.lastName}`,
				idDoctorCreation: Boolean(idParam) ? dataPatient.idDoctorCreation : localStorage.getItem(LocalStorageKeys.Id)!
			}
		};

		if (idParam === undefined) {
			response = await signUpUser({
				email: formData.email,
				password: formData.email.split("@")[0]
			});

			if (response === ErrorMessages.CouldNotCompleteTask) {
				setErrorMessage(response);

				disableLoading();

				return;
			}

			await signInUser({
				email: currentUser.data.email,
				password: currentUser.data.email.split("@")[0]
			});

			newPatient.id = response;

			response = await savePatient(newPatient);
		} else {
			response = await editPatient({
				id: idParam,
				data: newPatient.data
			});
		}

		if (response !== "") {
			setErrorMessage(response);

			disableLoading();

			return;
		}

		disableLoading();
		setIsSubmitted(true);

		setTimeout(() => {
			navigate(`/doctor/appointment/pose-estimation/${idParam !== undefined ? idParam : newPatient.id}`);
		}, 3000);

		showToast({
			type: ToastTypes.Success,
			title: ToastTitles.Success,
			message: "Paciente guardado, será redireccionado",
			icon: ToastIcons.Success,
			onDismissAndOnAutoCloseFunctions: clearErrorMessage
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

	useEffect((): (() => void) => {
		if (idParam !== undefined) {
			getPatientData();
		}

		return (): void => {
			clearCurrentAppointment();
		};
	}, []);

	useEffect((): void => {
		if (idPatient !== "") {
			form.reset({
				...dataPatient,
				birthDate: format(dataPatient.birthDate, "dd/MM/yyyy")
			});

			getAppointmentData();
		}
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

	if (isLoading) {
		return <Loader />;
	}

	return (
		<div className="flex min-h-screen w-full items-center justify-center overflow-y-auto bg-[url('/src/assets/images/background-patient.webp')] bg-cover bg-center bg-no-repeat p-8">
			<div className="container rounded bg-blue-300/75 p-5 text-gray-900 lg:max-w-[1024px]">
				<FormTitle>Información del paciente</FormTitle>

				<div className="my-10 flex justify-end">
					<PDFDownloadLink
						document={<PatientPdf patientData={dataPatient} appointmentData={dataAppointment} />}
						fileName={`paciente-${format(new Date(), "dd-MM-yyyy")}`}
						className={cn({
							hidden: idAppointment === "",
							flex: idAppointment !== ""
						})}
					>
						<Button className="w-full bg-purple-700 hover:bg-purple-800 sm:w-auto lg:text-lg">
							<FileText className="mr-3" /> Imprimir cita previa
						</Button>
					</PDFDownloadLink>
				</div>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="mt-10">
						<div className="space-5 sm:grid sm:grid-cols-2 sm:gap-5">
							<FormField
								control={form.control}
								name={PatientFormFields.Dni}
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
								name={PatientFormFields.FirstName}
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
								name={PatientFormFields.LastName}
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
								name={PatientFormFields.BirthDate}
								render={({ field }): React.ReactElement => (
									<FormItem>
										<FormLabel className="text-lg">Fecha de nacimiento</FormLabel>

										<FormControl>
											<InputMask
												mask="99/99/9999"
												className={cn("flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-base placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:text-gray-900 disabled:opacity-50 md:h-12", {
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
								name={PatientFormFields.Sex}
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
								name={PatientFormFields.Phone}
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
								name={PatientFormFields.LocationAddress}
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

							<FormField
								control={form.control}
								name={PatientFormFields.Email}
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
						</div>

						{idParam === undefined ? (
							<div className="mt-5 flex items-center justify-between sm:justify-end sm:gap-5">
								<Button
									type="reset"
									variant="outline"
									disabled={isSubmitted}
									className="w-28 border-blue-700 text-blue-700 hover:bg-blue-50 hover:text-blue-700 lg:text-lg"
									onClick={(): void => {
										form.reset();

										navigate("/doctor/dashboard");
									}}
								>
									Volver
								</Button>

								<Button type="submit" disabled={isSubmitted} className="min-w-28 bg-blue-700 hover:bg-blue-800 lg:text-lg">
									Guardar
								</Button>
							</div>
						) : (
							<>
								<Separator className="mb-6" />

								<FormTitle>Resumen de la consulta previa</FormTitle>

								<LastAppointmentSummary />

								<div className="mt-5 flex items-center justify-between sm:justify-end sm:gap-5">
									<Button
										type="reset"
										variant="outline"
										disabled={isSubmitted}
										className="w-28 border-blue-700 text-blue-700 hover:bg-blue-50 hover:text-blue-700 lg:text-lg"
										onClick={(): void => {
											form.reset();

											clearCurrentPatient();
											clearCurrentAppointment();

											navigate("/doctor/dashboard");
										}}
									>
										Volver
									</Button>

									<Button type="submit" disabled={isSubmitted} className="min-w-28 bg-blue-700 hover:bg-blue-800 lg:text-lg">
										Continuar
									</Button>
								</div>
							</>
						)}
					</form>
				</Form>
			</div>
		</div>
	);
}
