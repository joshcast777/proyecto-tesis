import { DataTable, Header, Input, Loader, NewRecordButton, SelectLayout } from "@/components/ui";
import { globalStore, patientStore } from "@/store";
import { Patient, PatientTable, SelectValues } from "@/types";
import { Table } from "@tanstack/react-table";
import { differenceInYears } from "date-fns";
import { useEffect } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { columns } from "./data";

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
			key: "M",
			label: "Hombre"
		},
		{
			key: "F",
			label: "Mujer"
		}
	]
];

export default function DoctorDashboard(): React.ReactNode {
	const { isLoading, disableLoading, enableLoading } = globalStore();
	const { patients, tablePage, tableSize, clearPatients, getPatients } = patientStore();

	const navigate: NavigateFunction = useNavigate();

	const handleClickNew = (): void => {
		navigate("/doctor/appointment/form");
	};

	useEffect((): (() => void) => {
		const execAsync = async (): Promise<void> => {
			enableLoading();

			await getPatients();

			disableLoading();
		};

		execAsync();

		return (): void => {
			clearPatients();
		};
	}, []);

	return (
		<>
			{isLoading && <Loader />}

			<Header />

			<h2 className="container mt-16 text-center text-5xl">Lista de pacientes</h2>

			<NewRecordButton newButtonLabel="Nueva consulta" newButtonClick={handleClickNew} />

			<div className="container mb-10 mt-5">
				<DataTable
					columns={columns}
					data={patients.map(
						(patient: Patient, index: number): PatientTable => ({
							...patient.data,
							id: patient.id,
							index: tablePage * tableSize - (tableSize - 1) + index,
							fullName: `${patient.data.firstName} ${patient.data.lastName}`,
							age: differenceInYears(new Date(), patient.data.birthDate),
							actions: <></>
						})
					)}
					filterComponent={(table: Table<PatientTable>) => (
						<div className="flex items-center gap-5 py-4">
							<Input placeholder="Filtrar cédula..." value={table.getColumn("dni")?.getFilterValue() as string} onChange={(event: React.ChangeEvent<HTMLInputElement>): void | undefined => table.getColumn("dni")?.setFilterValue(event.target.value)} className="max-w-40" />

							<Input placeholder="Filtrar nombres..." value={table.getColumn("fullName")?.getFilterValue() as string} onChange={(event: React.ChangeEvent<HTMLInputElement>): void | undefined => table.getColumn("fullName")?.setFilterValue(event.target.value)} className="max-w-sm" />

							<SelectLayout
								placeholder="Seleccione sexo..."
								values={selectValues}
								defaultValue={table.getColumn("sex")?.getFilterValue() as string}
								onValueChange={(event: string) => {
									if (event === "ALL") {
										table.getColumn("sex")?.setFilterValue(undefined);

										return;
									}

									table.getColumn("sex")?.setFilterValue(event);
								}}
							/>
						</div>
					)}
				/>
			</div>
		</>
	);
}
