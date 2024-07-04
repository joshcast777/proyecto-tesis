import { DefaultValues, ErrorMessages } from "@/constants";
import { firebaseEditPatient, firebaseGetCurrentAppointment, firebaseGetPatient, firebaseGetPatients, firebaseSavePatient } from "@/firebase/services/database";
import { ApiResponse, Appointment, Patient, PatientCreate } from "@/types";
import { PatientStore } from "@/types/store";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

export const patientStore = create<PatientStore>()(
	devtools((set, get) => ({
		currentAppointment: DefaultValues.Appointment,
		currentPatient: DefaultValues.Patient,
		patients: [],
		clearCurrentAppointment: (): void => {
			set(
				{
					currentAppointment: DefaultValues.Appointment
				},
				false,
				"CLEAR_CURRENT_PATIENT"
			);
		},
		clearCurrentPatient: (): void => {
			set(
				{
					currentPatient: DefaultValues.Patient
				},
				false,
				"CLEAR_CURRENT_PATIENT"
			);
		},
		clearPatients: (): void => {
			set(
				{
					patients: []
				},
				false,
				"CLEAR_PATIENTS"
			);
		},
		editPatient: async (newPatient: Patient): Promise<string> => {
			const apiResponse: ApiResponse<Patient> = await firebaseEditPatient(newPatient);

			if (!apiResponse.success) {
				return ErrorMessages.CouldNotCompleteTask;
			}

			return "";
		},
		getCurrentAppointment: async (): Promise<string> => {
			const { currentPatient } = get();

			const apiResponse: ApiResponse<Appointment> = await firebaseGetCurrentAppointment(currentPatient.id);

			if (!apiResponse.success) {
				return apiResponse.message;
			}

			set(
				{
					currentAppointment: apiResponse.data!
				},
				false,
				"SET_CURRENT_APPOINTMENT"
			);

			return "";
		},
		getPatient: async (id: string): Promise<string> => {
			const apiResponse: ApiResponse<Patient> = await firebaseGetPatient(id);

			if (!apiResponse.success) {
				return apiResponse.message;
			}

			set(
				{
					currentPatient: apiResponse.data!
				},
				false,
				"SET_CURRENT_PATIENT"
			);

			return "";
		},
		getPatients: async (): Promise<void> => {
			const apiResponse: ApiResponse<Patient[]> = await firebaseGetPatients();

			if (!apiResponse.success) {
				return;
			}

			set(
				{
					patients: apiResponse.data!
				},
				false,
				"SET_PATIENTS"
			);
		},
		savePatient: async (newPatient: PatientCreate): Promise<string> => {
			const apiResponse: ApiResponse<Patient> = await firebaseSavePatient(newPatient);

			if (!apiResponse.success) {
				return ErrorMessages.CouldNotCompleteTask;
			}

			set(
				{
					currentPatient: apiResponse.data!
				},
				false,
				"SET_CURRENT_PATIENT"
			);

			return "";
		}
	}))
);
