// React
import React, { useEffect } from "react";

// React Router Dom
import { NavigateFunction, useNavigate } from "react-router-dom";

// Components
import { Button, DataTable, Header, Loader } from "@/components/ui";

// Stores
import { doctorStore, globalStore } from "@/store";

// Enums & Types
import { Doctor, DoctorTable } from "@/types";

// Data
import { columns } from "./data";

// Libraries
import { format } from "date-fns";

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

	const handleClick = (): void => {
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

	return (
		<>
			{isLoading && <Loader />}

			<Header />

			<h2 className="container mt-16 text-center text-5xl">Lista de doctores</h2>

			<div className="container mt-16 flex items-center justify-between">
				<Button onClick={handleClick}>Agregar doctor</Button>
			</div>

			<div className="container mt-5">
				<DataTable
					columns={columns}
					data={doctors.map(
						({ id, data }: Doctor, index: number): DoctorTable => ({
							...data,
							id,
							index: index + 1,
							status: data.status,
							updateDate: format(data.updateDate, "dd/MM/yyyy"),
							actions: <></>
						})
					)}
				/>
			</div>
		</>
	);
}
