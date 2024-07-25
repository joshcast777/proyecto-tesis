import { Appointment, PatientDashboard } from "@/views";
import { Route, Routes } from "react-router-dom";

export default function PatientRoutes(): React.ReactNode {
	return (
		<Routes>
			<Route path="dashboard" element={<PatientDashboard />} />

			<Route path="appointment/:id" element={<Appointment />} />
		</Routes>
	);
}
