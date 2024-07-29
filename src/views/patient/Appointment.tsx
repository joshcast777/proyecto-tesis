import PatientPdf from "@/components/doctor/patient-pdf";
import { Button, FormTitle, Label, Loader, Separator } from "@/components/ui";
import { Sex } from "@/enums";
import { authStore, globalStore, patientStore } from "@/store";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { format } from "date-fns";
import { ArrowLeft, FileText } from "lucide-react";
import { NavigateFunction, useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";

export default function Appointment(): React.ReactNode {
	const { currentPatient } = authStore();
	const {
		currentAppointment: { data: dataAppointment },
		getCurrentAppointment
	} = patientStore();
	const { isLoading, disableLoading, enableLoading } = globalStore();

	const navigate: NavigateFunction = useNavigate();

	const { id: idParam } = useParams();

	const getAppointmentData = async (): Promise<void> => {
		enableLoading();

		await getCurrentAppointment(idParam!);

		disableLoading();
	};

	useEffect((): void => {
		if (idParam !== undefined) {
			getAppointmentData();
		}
	}, []);

	if (isLoading) {
		return <Loader />;
	}

	return (
		<div className="flex min-h-screen w-full items-center justify-center overflow-y-auto bg-[url('/src/assets/images/background-patient.webp')] bg-cover bg-center bg-no-repeat p-8">
			<div className="container rounded bg-blue-300/75 p-5 text-gray-900 lg:max-w-[1024px]">
				<FormTitle>Información del paciente</FormTitle>

				<div className="my-10 space-y-5 sm:flex sm:justify-between sm:space-y-0">
					<Button
						variant="outline"
						className="w-full sm:w-auto"
						onClick={(): void => {
							navigate("/patient/dashboard");
						}}
					>
						<ArrowLeft className="mr-3" /> Volver
					</Button>

					<PDFDownloadLink document={<PatientPdf patientData={currentPatient.data} appointmentData={dataAppointment} />} fileName={`paciente-${format(new Date(), "dd-MM-yyyy")}`}>
						<Button className="w-full bg-purple-700 hover:bg-purple-800 sm:w-auto lg:text-lg">
							<FileText className="mr-3" /> Imprimir cita
						</Button>
					</PDFDownloadLink>
				</div>

				<div className="mt-10">
					<div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
						<div className="space-y-2">
							<Label className="text-lg">Cédula</Label>

							<p className="flex h-10 w-full items-center rounded border border-gray-500 bg-gray-100/25 px-3 py-2 text-base font-medium md:h-12">{currentPatient.data.dni}</p>
						</div>

						<div className="space-y-2">
							<Label className="text-lg">Nombre</Label>

							<p className="flex h-10 w-full items-center rounded border border-gray-500 bg-gray-100/25 px-3 py-2 text-base font-medium md:h-12">{currentPatient.data.firstName}</p>
						</div>

						<div className="space-y-2">
							<Label className="text-lg">Apellido</Label>

							<p className="flex h-10 w-full items-center rounded border border-gray-500 bg-gray-100/25 px-3 py-2 text-base font-medium md:h-12">{currentPatient.data.lastName}</p>
						</div>

						<div className="space-y-2">
							<Label className="text-lg">Fecha de nacimiento</Label>

							<p className="flex h-10 w-full items-center rounded border border-gray-500 bg-gray-100/25 px-3 py-2 text-base font-medium md:h-12">{format(currentPatient.data.birthDate, "dd/MM/yyyy")}</p>
						</div>

						<div className="space-y-2">
							<Label className="text-lg">Sexo</Label>

							<p className="flex h-10 w-full items-center rounded border border-gray-500 bg-gray-100/25 px-3 py-2 text-base font-medium md:h-12">{currentPatient.data.sex === Sex.Male ? "Hombre" : "Mujer"}</p>
						</div>

						<div className="space-y-2">
							<Label className="text-lg">Celular</Label>

							<p className="flex h-10 w-full items-center rounded border border-gray-500 bg-gray-100/25 px-3 py-2 text-base font-medium md:h-12">{currentPatient.data.phone}</p>
						</div>

						<div className="space-y-2">
							<Label className="text-lg">Dirección</Label>

							<p className="flex h-10 w-full items-center rounded border border-gray-500 bg-gray-100/25 px-3 py-2 text-base font-medium md:h-12">{currentPatient.data.locationAddress}</p>
						</div>

						<div className="space-y-2">
							<Label className="text-lg">Correo</Label>

							<p className="flex h-10 w-full items-center rounded border border-gray-500 bg-gray-100/25 px-3 py-2 text-base font-medium md:h-12">{currentPatient.data.email}</p>
						</div>
					</div>

					<Separator className="my-6" />

					<FormTitle>Resumen de la consulta</FormTitle>

					<div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
						<div className="space-y-2">
							<Label className="text-lg">Fecha de la cita</Label>

							<p className="flex h-10 w-full items-center rounded border border-gray-500 bg-gray-100/25 px-3 py-2 text-base font-medium md:h-12">{format(dataAppointment.date, "dd/MM/yyyy")}</p>
						</div>

						<div className="space-y-2">
							<Label className="text-lg">Nombre del doctor</Label>

							<p className="flex h-10 w-full items-center rounded border border-gray-500 bg-gray-100/25 px-3 py-2 text-base font-medium md:h-12">{dataAppointment.nameDoctor}</p>
						</div>

						<div className="space-y-2 sm:col-span-2">
							<Label className="text-lg">Comentarios del doctor</Label>

							<p className="flex h-52 w-full items-start overflow-y-auto rounded border border-gray-500 bg-gray-100/25 px-3 py-2 text-base font-medium">{dataAppointment.summary}</p>
						</div>

						<div className="space-y-2 sm:col-span-2 lg:col-span-1">
							<Label className="text-lg">Imagen original</Label>

							<img className="h-96 w-full rounded border border-gray-500 object-contain sm:h-[800px] md:h-[900px] lg:h-[700px]" src={dataAppointment.uploadedImageLink} alt="original-image" />
							{/* <p className="flex h-52 w-full items-start overflow-y-auto rounded border border-gray-500 px-3 py-2 text-base font-medium md:h-12">{dataAppointment.uploadedImageLink}</p> */}
						</div>

						<div className="space-y-2 sm:col-span-2 lg:col-span-1">
							<Label className="text-lg">Imagen estimada</Label>

							<img className="h-96 w-full rounded border border-gray-500 object-contain sm:h-[800px] md:h-[900px] lg:h-[700px]" src={dataAppointment.estimatedImageLink} alt="original-image" />
							{/* <p className="flex h-52 w-full items-start overflow-y-auto rounded border border-gray-500 px-3 py-2 text-base font-medium md:h-12">{dataAppointment.uploadedImageLink}</p> */}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
