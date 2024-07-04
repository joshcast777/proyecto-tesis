import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";

import { Button, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input, InputMask, Loader, RadioGroup, RadioGroupLayout } from "@/components/ui";
import { DefaultValues, ErrorMessages } from "@/constants";
import { cn, showToast } from "@/lib";
import { doctorSchema } from "@/schemas";
import { authStore, doctorStore, globalStore } from "@/store";
import { Doctor, DoctorCreate, SexData } from "@/types";
import { ToastIcons } from "@/constants/ui";
import { DoctorFields, Roles, ToastTitles, ToastTypes } from "@/enums";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { NavigateFunction, useNavigate, useParams } from "react-router-dom";
import { sex } from "@/data";

export default function DoctorForm(): React.ReactNode {
	const [disable, setDisable] = useState<boolean>(false);

	const { signInDoctor, signOutDoctor, signUpDoctor } = authStore();
	const { getDoctor, saveDoctor } = doctorStore();
	const { errorMessage, isLoading, clearErrorMessage, enableLoading, disableLoading, setErrorMessage } = globalStore();

	const navigate: NavigateFunction = useNavigate();

	const { id } = useParams();

	const form = useForm<DoctorCreate>({
		resolver: zodResolver(doctorSchema),
		defaultValues: DefaultValues.DoctorCreate
	});

	const onSubmit: SubmitHandler<DoctorCreate> = async (formData: DoctorCreate): Promise<void> => {
		setDisable(true);
		enableLoading();

		let response: string = "";

		if (!Boolean(id)) {
			response = await signUpDoctor({
				email: formData.email,
				password: formData.email.split("@")[0]
			});

			if (response === ErrorMessages.CouldNotCompleteTask) {
				setErrorMessage(response);

				setDisable(false);
				disableLoading();

				return;
			}

			await signOutDoctor();

			const { VITE_ADMIN_EMAIL } = import.meta.env;

			await signInDoctor({
				email: VITE_ADMIN_EMAIL,
				password: VITE_ADMIN_EMAIL.split("@")[0]
			});
		}

		const newDoctor: DoctorCreate = structuredClone(formData);

		const currentDate = new Date();

		newDoctor.role = id === undefined ? Roles.Doctor : form.getValues("role");
		newDoctor.creationDate = id === undefined ? currentDate : form.getValues("creationDate");
		newDoctor.updateDate = currentDate;
		newDoctor.status = true;

		response = await saveDoctor(Boolean(id) ? id! : response, newDoctor);

		if (response !== "") {
			setErrorMessage(response);

			setDisable(false);
			disableLoading();

			return;
		}

		disableLoading();

		showToast({
			type: ToastTypes.Success,
			title: ToastTitles.Success,
			message: "Doctor registrado, será redireccionado",
			icon: ToastIcons.Success,
			onDismissAndOnAutoCloseFunctions: (): void => {
				navigate("/doctor/dashboard", {
					replace: true
				});
			}
		});
	};

	const getDoctorById = async (id: string): Promise<void> => {
		enableLoading();

		const doctor: Doctor | string = await getDoctor(id);

		if (typeof doctor === "string") {
			setErrorMessage(doctor);

			disableLoading();

			return;
		}

		form.reset({
			...doctor,
			birthDate: format(doctor.birthDate, "dd/MM/yyyy")
		});

		disableLoading();
	};

	useEffect((): void => {
		if (id !== undefined) {
			getDoctorById(id);
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
					<h2 className="text-center text-3xl font-bold uppercase xl:text-5xl">{id === undefined ? "Ingreso de doctor" : "Editar doctor"}</h2>

					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="mt-10 space-y-5">
							<div className="sm:grid sm:grid-cols-2 sm:gap-5">
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
													className={cn("text-base placeholder:text-base disabled:text-gray-900 disabled:opacity-75 md:h-12", {
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
													className={cn("flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-base placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 md:h-12", {
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
															<RadioGroupLayout sexData={s} disable={id !== undefined} />
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
									name={DoctorFields.Email}
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-lg">Correo</FormLabel>

											<FormControl>
												<Input
													{...field}
													placeholder="Correo"
													className={cn("text-base placeholder:text-base disabled:text-gray-900 disabled:opacity-75 md:h-12", {
														"shake-animation border-red-500 outline-red-500": Boolean(form.formState.errors.email)
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
									name={DoctorFields.LocationAddress}
									render={({ field }) => (
										<FormItem>
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

							<div className="mt-5 flex items-center justify-between sm:justify-end sm:gap-5">
								<Button
									type="reset"
									variant="outline"
									disabled={disable}
									onClick={(): void => {
										form.reset();

										navigate("/admin/dashboard", {
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
										"Guardar"
									)}
								</Button>
							</div>
						</form>
					</Form>
				</div>
			</div>
		</>
	);
}
