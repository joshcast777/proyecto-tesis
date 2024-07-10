import { AdminDashboard, FormDoctor } from "@/views";
import { Route, Routes } from "react-router-dom";

export default function AdminRoutes(): React.ReactNode {
	return (
		<Routes>
			<Route path="dashboard" element={<AdminDashboard />} />

			<Route path="doctor/form">
				<Route path="" element={<FormDoctor />} />

				<Route path=":id" element={<FormDoctor />} />
			</Route>
		</Routes>
	);
}
