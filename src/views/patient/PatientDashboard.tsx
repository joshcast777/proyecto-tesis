import { DataTable, Header, Loader } from "@/components/ui";
import { columns } from "./data";
import { globalStore, patientStore } from "@/store";
import { useEffect } from "react";
import { Appointment, AppointmentTable } from "@/types";

export default function PatientDashboard(): React.ReactNode {
	const { isLoading, disableLoading, enableLoading } = globalStore();
	const { appointments, tablePage, tableSize, clearAppointments, getAppointments } = patientStore();

	useEffect((): (() => void) => {
		const execAsync = async (): Promise<void> => {
			enableLoading();

			await getAppointments();

			disableLoading();
		};

		execAsync();

		return (): void => {
			clearAppointments();
		};
	}, []);

	if (isLoading) {
		return <Loader />;
	}

	return (
		<>
			<Header />

			<h2 className="container mt-16 text-center text-5xl">Lista de pacientes</h2>

			<div className="container mb-10 mt-16">
				<DataTable
					columns={columns}
					data={appointments.map(
						(appointment: Appointment, index: number): AppointmentTable => ({
							...appointment.data,
							id: appointment.id,
							index: tablePage * tableSize - (tableSize - 1) + index,
							nameDoctor: appointment.data.nameDoctor,
							date: appointment.data.date,
							actions: <></>
						})
					)}
					// filterComponent={(table: Table<PatientTable>) => (
					// 	<div className="flex flex-col gap-5 py-4 md:flex-row xl:items-center">
					// 		<Input placeholder="Filtrar cédula..." value={table.getColumn("dni")?.getFilterValue() as string} onChange={(event: React.ChangeEvent<HTMLInputElement>): void | undefined => table.getColumn("dni")?.setFilterValue(event.target.value)} className="w-full lg:w-44" />

					// 		<Input placeholder="Filtrar nombres..." value={table.getColumn("fullName")?.getFilterValue() as string} onChange={(event: React.ChangeEvent<HTMLInputElement>): void | undefined => table.getColumn("fullName")?.setFilterValue(event.target.value)} className="w-full lg:w-80" />

					// 		<SelectLayout
					// 			className="w-full lg:w-52"
					// 			placeholder="Seleccione sexo..."
					// 			values={selectValues}
					// 			defaultValue={table.getColumn("sex")?.getFilterValue() as string}
					// 			onValueChange={(event: string) => {
					// 				if (event === "ALL") {
					// 					table.getColumn("sex")?.setFilterValue(undefined);

					// 					return;
					// 				}

					// 				table.getColumn("sex")?.setFilterValue(event);
					// 			}}
					// 		/>
					// 	</div>
					// )}
				/>
			</div>
		</>
	);
}
