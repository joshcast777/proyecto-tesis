import { format } from "date-fns";
import { Label } from "../ui";
import { patientStore } from "@/store";

export default function LastAppointmentSummary(): React.ReactNode {
	const {
		currentAppointment: { id: idAppointment, data: dataAppointment }
	} = patientStore();

	return (
		<div className="space-5 mt-10">
			<div className="space-5 lg:grid lg:grid-cols-2 lg:gap-5">
				<div className="space-5 sm:grid sm:grid-cols-2 sm:gap-5 lg:grid-cols-1">
					<div className="space-y-2">
						<Label className="text-lg">Última cita</Label>

						<p className="flex h-10 w-full items-center px-3 py-2 text-sm font-medium md:h-12">{idAppointment === "" ? "Sin citas previas" : format(dataAppointment.date, "dd/MM/yyyy")}</p>

						<div className="h-5"></div>
					</div>

					<div className="space-y-2">
						<Label className="text-lg">Doctor que atendió</Label>

						<p className="flex h-10 w-full items-center px-3 py-2 text-sm font-medium md:h-12">{idAppointment === "" ? "Sin citas previas" : dataAppointment.nameDoctor}</p>

						<div className="h-5"></div>
					</div>
				</div>

				<div className="space-y-2">
					<Label className="text-lg">Comentarios</Label>

					<p className="h-48 w-full overflow-y-auto px-3 py-2 text-base font-medium md:h-[180px]">{idAppointment === "" ? "Sin citas previas" : dataAppointment.summary}</p>

					<div className="h-5"></div>
				</div>
			</div>
		</div>
	);
}
