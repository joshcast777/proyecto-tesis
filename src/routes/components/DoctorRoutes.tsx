import { LocalStorageKeys } from "@/enums";
import { patientStore } from "@/store";
import { DoctorDashboard } from "@/views";
import { FormPatient, FormPoseEstimation } from "@/views/doctor";
import { Navigate, Route, Routes } from "react-router-dom";

export default function DoctorRoutes(): React.ReactNode {
	const { currentPatient } = patientStore();

	return (
		<Routes>
			<Route path="dashboard" element={<DoctorDashboard />} />

			<Route path="appointment/*">
				<Route path="form/*">
					<Route path="" element={<FormPatient />} />

					<Route path=":id" element={<FormPatient />} />
				</Route>

				<Route path="pose-estimation/:id" element={currentPatient.id !== "" ? <FormPoseEstimation /> : <Navigate to={`/${localStorage.getItem(LocalStorageKeys.Role)}/dashboard`} />} />
			</Route>
		</Routes>
	);
}
