import { Button, DataTable, Header, Loader } from "@/components/ui";
import { globalStore, patientStore } from "@/store";
import { useEffect } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { columns } from "./data";
import { Patient, PatientTable } from "@/types";
import { differenceInYears } from "date-fns";

export default function DoctorDashboard(): React.ReactNode {
	const { isLoading, disableLoading, enableLoading } = globalStore();
	const { patients, clearPatients, getPatients } = patientStore();

	const navigate: NavigateFunction = useNavigate();

	const handleClick = (): void => {
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

			<div className="container mt-16 flex items-center justify-between">
				<Button onClick={handleClick}>Nueva consulta</Button>
			</div>

			<div className="container mt-5">
				<DataTable
					columns={columns}
					data={patients.map(
						(patient: Patient, index: number): PatientTable => ({
							...patient,
							index: index + 1,
							fullName: `${patient.firstName} ${patient.lastName}`,
							age: differenceInYears(new Date(), patient.birthDate),
							actions: <></>
						})
					)}
				/>
			</div>
		</>
	);
}
