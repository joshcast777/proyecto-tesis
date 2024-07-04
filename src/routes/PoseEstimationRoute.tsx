import { LocalStorageKeys } from "@/constants";
import { authStore, doctorStore, globalStore } from "@/store";
import { Auth } from "@/views";
import { useEffect } from "react";
import { Doctor } from "@/types";
import { Navigate, Route, Routes } from "react-router-dom";
import { PrivateRoute, PublicRoute } from "./components";
import AdminRoutes from "./components/AdminRoutes";
import DoctorRoutes from "./components/DoctorRoutes";

export default function PoseEstimationRoute(): React.ReactNode {
	const { isAuthenticated, clearIsAuthenticated, setIsAuthenticated } = authStore();
	const { getDoctor } = doctorStore();
	const { enableLoading, disableLoading } = globalStore();

	const asyncFunction = async (): Promise<void> => {
		enableLoading();

		if (!isAuthenticated) {
			localStorage.removeItem(LocalStorageKeys.Id);
			localStorage.removeItem(LocalStorageKeys.Role);

			clearIsAuthenticated();

			disableLoading();

			return;
		}

		const response: Doctor | string = await getDoctor(localStorage.getItem(LocalStorageKeys.Id)!);

		if (typeof response === "string") {
			localStorage.removeItem(LocalStorageKeys.Id);
			localStorage.removeItem(LocalStorageKeys.Role);

			clearIsAuthenticated();

			disableLoading();

			return;
		}

		setIsAuthenticated(response);

		disableLoading();
	};

	useEffect((): void => {
		asyncFunction();
	}, []);

	return (
		<Routes>
			<Route
				path="/auth"
				element={
					<PublicRoute redirectTo={`/${localStorage.getItem(LocalStorageKeys.Role)}/dashboard`} isAuthenticated={isAuthenticated}>
						<Auth />
					</PublicRoute>
				}
			/>

			<Route
				path="/*"
				element={
					<PrivateRoute redirectTo="/auth" isAuthenticated={isAuthenticated}>
						<Routes>
							<Route path="admin/*" element={<AdminRoutes />} />

							<Route path="doctor/*" element={<DoctorRoutes />} />
						</Routes>
					</PrivateRoute>
				}
			/>

			<Route path="" element={<Navigate to={`/${localStorage.getItem(LocalStorageKeys.Role)}/dashboard`} />} />
		</Routes>
	);
}
