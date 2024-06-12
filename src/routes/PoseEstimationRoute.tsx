/**
 * Cambio
 */

// import { authStore } from "@/store";
import { Navigate, Route, Routes } from "react-router-dom";
// import { PrivateRoute, PublicRoute } from "./components/AccesRoutes";
import { LoginForm } from "@/views";
import AdminDashboard from "@/views/Dashboard/AdminDashboard";

export default function PoseEstimationRoute(): React.ReactNode {
	// const { isAuthenticated } = authStore();

	return (
		<Routes>
			{/* <Route
					path="/auth"
					element={
						<PublicRoute redirectTo="/admin-dashboard" isAuthenticated={isAuthenticated}>
							<LoginForm />
						</PublicRoute>
					}
				/>

				<Route
					path="/*"
					element={
						<PrivateRoute redirectTo="/auth" isAuthenticated={isAuthenticated}>
							<Routes>
								<Route path="admin-dashboard" element={<AdminDashboard />} />
							</Routes>
						</PrivateRoute>
					}
				/> */}

			<Route path="/auth" element={<LoginForm />} />
			<Route path="/admin-dashboard" element={<AdminDashboard />} />

			<Route path="" element={<Navigate to="/admin-dashboard" />} />
			{/* <Route path="/app" element={<Navigate to="/app/dashboard" />} />
				<Route path="/dashboard" element={<Navigate to="/app/dashboard" />} />
				<Route path="/companies" element={<Navigate to="/app/companies" />} />

				<Route path="/" element={<Navigate to="/auth" />} /> */}
		</Routes>
	);
}
