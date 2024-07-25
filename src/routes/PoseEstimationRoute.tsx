import { Loader } from "@/components/ui";
import { LocalStorageKeys } from "@/enums";
import { authStore, globalStore } from "@/store";
import { Auth } from "@/views";
import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AdminRoutes, DoctorRoutes, PatientRoutes, PrivateRoute, PublicRoute } from "./components";

export default function PoseEstimationRoute(): React.ReactNode {
	const { currentUser, isAuthenticated, clearIsAuthenticated, getCurrentUser } = authStore();
	const { isLoading, enableLoading, disableLoading } = globalStore();

	const asyncFunction = async (): Promise<void> => {
		enableLoading();

		if (!isAuthenticated) {
			localStorage.removeItem(LocalStorageKeys.Id);
			localStorage.removeItem(LocalStorageKeys.Role);

			clearIsAuthenticated();

			disableLoading();

			return;
		}

		const response: string = await getCurrentUser(localStorage.getItem(LocalStorageKeys.Id)!);

		if (response !== "") {
			localStorage.removeItem(LocalStorageKeys.Id);
			localStorage.removeItem(LocalStorageKeys.Role);

			clearIsAuthenticated();

			disableLoading();

			return;
		}

		disableLoading();
	};

	useEffect((): void => {
		asyncFunction();
	}, []);

	return (
		<>
			{currentUser.id === "" && isLoading && <Loader />}

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

								<Route path="patient/*" element={<PatientRoutes />} />
							</Routes>
						</PrivateRoute>
					}
				/>

				<Route path="" element={<Navigate to={`/${localStorage.getItem(LocalStorageKeys.Role)}/dashboard`} />} />
			</Routes>
		</>
	);
}
