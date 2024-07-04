import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";

import { Button, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input, InputMask, Label, Loader, RadioGroup, RadioGroupLayout, Separator, Textarea } from "@/components/ui";
import { DefaultValues } from "@/constants";
import { ToastIcons } from "@/constants/ui";
import { sex } from "@/data";
import { DoctorFields, ToastTitles, ToastTypes } from "@/enums";
import { cn, showToast } from "@/lib";
import { patientSchema } from "@/schemas";
import { authStore, globalStore, patientStore } from "@/store";
import { PatientCreate, SexData } from "@/types";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { NavigateFunction, useNavigate, useParams } from "react-router-dom";

export default function PatientForm(): React.ReactNode {
	const [disable, setDisable] = useState<boolean>(false);

	const { currentDoctor } = authStore();
	const { currentAppointment, currentPatient, clearCurrentPatient, clearCurrentAppointment, editPatient, getCurrentAppointment, getPatient, savePatient } = patientStore();
	const { errorMessage, isLoading, clearErrorMessage, enableLoading, disableLoading, setErrorMessage } = globalStore();

	const navigate: NavigateFunction = useNavigate();

	const { id } = useParams();

	const form = useForm<PatientCreate>({
		resolver: zodResolver(patientSchema),
		defaultValues: DefaultValues.PatientCreate
	});

	const onSubmit: SubmitHandler<PatientCreate> = async (formData: PatientCreate): Promise<void> => {
		setDisable(true);
		enableLoading();

		formData.creationDate = id === undefined ? new Date() : currentPatient.creationDate;
		formData.doctorNameCreation = id === undefined ? `${currentDoctor.firstName} ${currentDoctor.lastName}` : currentPatient.doctorNameCreation;

		let response: string = "";

		if (id === undefined) {
			response = await savePatient(formData);
		} else if (form.formState.isDirty) {
			response = await editPatient({
				...formData,
				id,
				birthDate: currentPatient.birthDate
			});
		}

		if (response !== "") {
			setErrorMessage(response);

			disableLoading();
			setDisable(false);

			return;
		}

		disableLoading();

		if (form.formState.isDirty) {
			showToast({
				type: ToastTypes.Success,
				title: ToastTitles.Success,
				message: "Paciente registrado, será redireccionado",
				icon: ToastIcons.Success,
				onDismissAndOnAutoCloseFunctions: (): void => {
					navigate(`/doctor/appointment/pose-estimation/${id === undefined ? response : id}`, {
						replace: true
					});
				}
			});
		} else {
			navigate(`/doctor/appointment/pose-estimation/${id === undefined ? currentPatient.id : id}`, {
				replace: true
			});
		}
	};

	const getPatientData = async (id: string): Promise<void> => {
		enableLoading();

		const response: string = await getPatient(id);

		if (response !== "") {
			setErrorMessage(response);

			disableLoading();

			return;
		}
	};

	const getAppointmentData = async (): Promise<void> => {
		const response: string = await getCurrentAppointment();

		if (response === "") {
			setErrorMessage(response);

			disableLoading();

			return;
		}

		disableLoading();
	};

	useEffect((): void => {
		if (id !== undefined) {
			getPatientData(id);
		}
	}, []);

	useEffect((): void => {
		if (currentPatient.id !== "") {
			form.reset({
				...currentPatient,
				birthDate: format(currentPatient.birthDate, "dd/MM/yyyy")
			});

			getAppointmentData();
		}
	}, [currentPatient.id]);

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

	useEffect((): (() => void) => {
		return (): void => {
			clearCurrentPatient();
			clearCurrentAppointment();
		};
	}, []);

	return (
		<>
			{isLoading && <Loader />}

			<div className="flex min-h-screen w-full items-center justify-center overflow-y-auto bg-[url('/src/assets/images/background-patient.webp')] bg-cover bg-center bg-no-repeat p-8">
				<div className="container rounded bg-blue-300/75 p-5 text-gray-900 lg:max-w-[1024px]">
					<h2 className="text-center text-3xl font-bold uppercase xl:text-5xl">Información del paciente</h2>

					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="mt-10">
							<div className="space-5 sm:grid sm:grid-cols-2 sm:gap-5">
								<FormField
									control={form.control}
									name={DoctorFields.Dni}
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-lg">Cédula</FormLabel>

											<FormControl>
												<Input
													{...field}
													placeholder="Cédula"
													className={cn("text-base placeholder:text-base disabled:text-gray-900 disabled:opacity-50 md:h-12", {
														"shake-animation border-red-500 outline-red-500": Boolean(form.formState.errors.dni)
													})}
													disabled={id !== undefined}
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
									name={DoctorFields.FirstName}
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-lg">Nombre</FormLabel>

											<FormControl>
												<Input
													{...field}
													placeholder="Nombre"
													className={cn("text-base placeholder:text-base md:h-12", {
														"shake-animation border-red-500 outline-red-500": Boolean(form.formState.errors.firstName)
													})}
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
									name={DoctorFields.LastName}
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-lg">Apellido</FormLabel>

											<FormControl>
												<Input
													{...field}
													placeholder="Apellido"
													className={cn("text-base placeholder:text-base md:h-12", {
														"shake-animation border-red-500 outline-red-500": Boolean(form.formState.errors.lastName)
													})}
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
									name={DoctorFields.BirthDate}
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-lg">Fecha de nacimiento</FormLabel>

											<FormControl>
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
													disabled={id !== undefined}
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
									name={DoctorFields.Sex}
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-lg">Sexo</FormLabel>

											<FormControl>
												<RadioGroup onValueChange={field.onChange} defaultValue={field.value} value={field.value} className="flex h-10 w-56 justify-between md:h-12">
													{sex.map(
														(s: SexData): React.ReactNode => (
															<RadioGroupLayout key={s.value} sexData={s} disable={id !== undefined} />
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
									name={DoctorFields.Phone}
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-lg">Celular</FormLabel>

											<FormControl>
												<Input
													{...field}
													placeholder="Celular"
													className={cn("text-base placeholder:text-base md:h-12", {
														"shake-animation border-red-500 outline-red-500": Boolean(form.formState.errors.phone)
													})}
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
									name={DoctorFields.LocationAddress}
									render={({ field }) => (
										<FormItem className="space-y-2">
											<FormLabel className="text-lg">Dirección domiciliaria</FormLabel>

											<FormControl>
												<Input
													{...field}
													placeholder="Dirección domiciliaria"
													className={cn("text-base placeholder:text-base md:h-12", {
														"shake-animation border-red-500 outline-red-500": Boolean(form.formState.errors.locationAddress)
													})}
												/>
											</FormControl>

											<div className="h-5">
												<FormMessage />
											</div>
										</FormItem>
									)}
								/>
							</div>

							{id === undefined ? (
								<div className="mt-5 flex items-center justify-between sm:justify-end sm:gap-5">
									<Button
										type="reset"
										variant="outline"
										disabled={disable}
										onClick={(): void => {
											form.reset();

											navigate("/doctor/dashboard", {
												replace: true
											});
										}}
										className="w-28 lg:text-lg"
									>
										Cancelar
									</Button>

									<Button type="submit" disabled={disable} className="min-w-28 lg:text-lg">
										{isLoading ? (
											<>
												<Loader2 className="mr-2 h-4 w-4 animate-spin" /> Por favor, espere...
											</>
										) : (
											"Continuar"
										)}
									</Button>
								</div>
							) : (
								<>
									<Separator />

									<h2 className="my-5 text-center text-3xl font-bold uppercase xl:text-5xl">Resumen de la consulta previa</h2>

									<div className="space-5">
										<div className="space-5 lg:grid lg:grid-cols-2 lg:gap-5">
											<div className="space-5 sm:grid sm:grid-cols-2 sm:gap-5 lg:grid-cols-1">
												<div className="space-y-2">
													<Label className="text-lg">Última cita</Label>

													<Input className="text-base placeholder:text-base disabled:text-gray-900 disabled:opacity-50 md:h-12" disabled value={currentAppointment.id === "" ? "Sin citas previas" : format(currentAppointment.date, "dd/MM/yyyy")} />

													<div className="h-5"></div>
												</div>

												<div className="space-y-2">
													<Label className="text-lg">Doctor que atendió</Label>

													<Input className="text-base placeholder:text-base disabled:text-gray-900 disabled:opacity-50 md:h-12" disabled value={currentAppointment.id === "" ? "Sin citas previas" : currentAppointment.doctorName} />

													<div className="h-5"></div>
												</div>
											</div>

											<div className="space-y-2">
												<Label className="text-lg">Comentarios</Label>

												<Textarea className="h-48 text-base file:text-sm file:font-medium disabled:text-gray-900 disabled:opacity-50 xs:h-40 md:h-[180px]" disabled value={currentAppointment.id === "" ? "Sin citas previas" : currentAppointment.summary} />

												<div className="h-5"></div>
											</div>
										</div>
									</div>

									<div className="mt-5 flex items-center justify-between sm:justify-end sm:gap-5">
										<Button
											type="reset"
											variant="outline"
											disabled={disable}
											onClick={(): void => {
												form.reset();

												navigate("/doctor/dashboard", {
													replace: true
												});
											}}
											className="w-28 lg:text-lg"
										>
											Cancelar
										</Button>

										<Button type="submit" disabled={disable} className="min-w-28 lg:text-lg">
											{isLoading ? (
												<>
													<Loader2 className="mr-2 h-4 w-4 animate-spin" /> Por favor, espere...
												</>
											) : (
												"Continuar"
											)}
										</Button>
									</div>
								</>
							)}
						</form>
					</Form>
				</div>
			</div>
		</>
	);
}
