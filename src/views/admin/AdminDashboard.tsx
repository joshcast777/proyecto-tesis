// React
import React, { useEffect } from "react";

// React Router Dom
import { NavigateFunction, useNavigate } from "react-router-dom";

// Components
import { DataTable, Header, Input, Loader, NewRecordButton, SelectLayout } from "@/components/ui";

// Stores
import { doctorStore, globalStore } from "@/store";

// Enums & Types
import { Doctor, DoctorTable, SelectValues } from "@/types";
import { Table } from "@tanstack/react-table";

// Data
import { columns } from "./data";

// Libraries
import { DashboardLayout, TableLayout } from "@/layouts";
import { format } from "date-fns";

const selectValues: SelectValues[][] = [
	[
		{
			key: "GroupLabel",
			label: ""
		},
		{
			key: "ALL",
			label: "Todos"
		},
		{
			key: "A",
			label: "Activos"
		},
		{
			key: "I",
			label: "Inactivos"
		}
	]
];

/**
 * A React component that renders the admin dashboard.
 *
 * @export
 * @returns {React.ReactNode} The rendered admin dashboard page.
 */
export default function AdminDashboard(): React.ReactNode {
	const { doctors, clearDoctors, getDoctors } = doctorStore();
	const { isLoading, disableLoading, enableLoading } = globalStore();

	const navigate: NavigateFunction = useNavigate();

	const handleClickNew = (): void => {
		navigate("/admin/doctor/form");
	};

	const execAsync = async (): Promise<void> => {
		enableLoading();

		await getDoctors();

		disableLoading();
	};

	useEffect((): (() => void) => {
		execAsync();

		return (): void => {
			clearDoctors();
		};
	}, []);

	if (isLoading) {
		return <Loader />;
	}

	return (
		<>
			<Header />

			<DashboardLayout>
				<h2 className="container mt-16 text-center text-5xl">Lista de doctores</h2>

				<NewRecordButton newButtonLabel="Agregar doctor" newButtonClick={handleClickNew} />

				<TableLayout>
					<DataTable
						columns={columns}
						data={doctors.map(
							({ id, data }: Doctor, index: number): DoctorTable => ({
								...data,
								id,
								index: index + 1,
								fullName: `${data.firstName} ${data.lastName}`,
								status: data.status,
								updateDate: format(data.updateDate, "dd-MM-yyyy"),
								actions: <></>
							})
						)}
						filterComponent={(table: Table<DoctorTable>) => (
							<div className="mb-5 space-y-3 sm:flex sm:flex-wrap sm:items-center sm:gap-5 sm:space-y-0">
								<Input placeholder="Filtrar cédula..." value={table.getColumn("dni")?.getFilterValue() as string} onChange={(event: React.ChangeEvent<HTMLInputElement>): void | undefined => table.getColumn("dni")?.setFilterValue(event.target.value)} className="w-full sm:w-5/12 lg:w-[200px]" />

								<Input placeholder="Filtrar apellidos..." value={table.getColumn("fullName")?.getFilterValue() as string} onChange={(event: React.ChangeEvent<HTMLInputElement>): void | undefined => table.getColumn("fullName")?.setFilterValue(event.target.value)} className="w-full sm:w-5/12 lg:w-[300px]" />

								<Input placeholder="Filtrar correo..." value={table.getColumn("email")?.getFilterValue() as string} onChange={(event: React.ChangeEvent<HTMLInputElement>): void | undefined => table.getColumn("email")?.setFilterValue(event.target.value)} className="w-full sm:w-5/12 lg:w-[300px]" />

								<SelectLayout
									placeholder="Seleccione estado..."
									values={selectValues}
									className="w-full sm:w-5/12 md:w-52"
									defaultValue={table.getColumn("status")?.getFilterValue() as string}
									onValueChange={(event: string) => {
										if (event === "ALL") {
											table.getColumn("status")?.setFilterValue(undefined);

											return;
										}

										table.getColumn("status")?.setFilterValue(event === "A");
									}}
								/>
							</div>
						)}
					/>
				</TableLayout>
			</DashboardLayout>
		</>
	);
}
