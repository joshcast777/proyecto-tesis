import { DoctorDashboard } from "@/views";
import { PatientForm, PoseEstimationForm } from "@/views/doctor";
import { Route, Routes } from "react-router-dom";

export default function DoctorRoutes(): React.ReactNode {
	return (
		<Routes>
			<Route path="dashboard" element={<DoctorDashboard />} />

			<Route path="appointment/*">
				<Route path="form/*">
					<Route path="" element={<PatientForm />} />

					<Route path=":id" element={<PatientForm />} />
				</Route>

				<Route path="pose-estimation/:id" element={<PoseEstimationForm />} />
			</Route>
		</Routes>
	);
}
