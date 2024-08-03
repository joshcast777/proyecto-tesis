import { DataTable, Header, Loader } from "@/components/ui";
import { columns } from "./data";
import { globalStore, patientStore } from "@/store";
import { useEffect } from "react";
import { Appointment, AppointmentTable } from "@/types";
import { DashboardLayout, TableLayout } from "@/layouts";

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

			<DashboardLayout>
				<h2 className="container mt-16 text-center text-5xl">Lista de consultas</h2>

				<TableLayout>
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
					/>
				</TableLayout>
			</DashboardLayout>
		</>
	);
}
