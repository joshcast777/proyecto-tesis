import { cloudinaryUploadImages } from "@/cloudinary";
import { DefaultValues, ErrorMessages } from "@/constants";
import { firebaseEditPatient, firebaseGetAppointment, firebaseGetAppointments, firebaseGetCurrentAppointment, firebaseGetPatient, firebaseGetPatients, firebaseSaveAppointment, firebaseSavePatient } from "@/firebase/services/database";
import { ApiResponse, Appointment, AppointmentData, ImagesBlob, ImagesDownloadLink, Patient, PatientReferences } from "@/types";
import { PatientStore } from "@/types/store";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

export const patientStore = create<PatientStore>()(
	devtools((set, get) => ({
		appointments: [],
		currentAppointment: DefaultValues.Appointment,
		currentPatient: DefaultValues.Patient,
		firstPatientDocumentSnapshot: null,
		lastPatientDocumentSnapshot: null,
		patients: [],
		tablePage: 1,
		tableSize: 3,
		clearAppointments: (): void => {
			set(
				{
					appointments: []
				},
				false,
				"CLEAR_APPOINTMENTS"
			);
		},
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
		editPatient: async (patient: Patient): Promise<string> => {
			const apiResponse: ApiResponse<Patient> = await firebaseEditPatient(patient);

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
		},
		getCurrentAppointment: async (id: string): Promise<string> => {
			const apiResponse: ApiResponse<Appointment> = await firebaseGetCurrentAppointment(id);

			if (!apiResponse.success) {
				return apiResponse.message;
			}

			set(
				{
					currentAppointment: apiResponse.data!
				},
				false,
				"SET_CURRENT_PATIENT"
			);

			return "";
		},
		getAppointment: async (): Promise<void> => {
			const {
				currentPatient: { id }
			} = get();

			const apiResponse: ApiResponse<Appointment> = await firebaseGetAppointment(id);

			if (!apiResponse.success) {
				return;
			}

			set(
				{
					currentAppointment: apiResponse.data!
				},
				false,
				"SET_CURRENT_APPOINTMENT"
			);
		},
		getAppointments: async (): Promise<void> => {
			const apiResponse: ApiResponse<Appointment[]> = await firebaseGetAppointments();

			if (!apiResponse.success) {
				return;
			}

			set(
				{
					appointments: apiResponse.data!
				},
				false,
				"SET_APPOINTMENTS"
			);
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
			const apiResponse: ApiResponse<PatientReferences> = await firebaseGetPatients();

			if (!apiResponse.success) {
				return;
			}

			set(
				{
					firstPatientDocumentSnapshot: apiResponse.data!.firstPatientDocumentSnapshot,
					lastPatientDocumentSnapshot: apiResponse.data!.lastPatientDocumentSnapshot,
					patients: apiResponse.data!.patients
				},
				false,
				"SET_PATIENTS"
			);
		},
		saveAppointment: async (newAppointment: AppointmentData): Promise<string> => {
			const {
				currentPatient: { id }
			} = get();

			const apiResponse: ApiResponse<Appointment> = await firebaseSaveAppointment(newAppointment, id);

			if (!apiResponse.success) {
				return ErrorMessages.CouldNotCompleteTask;
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
		savePatient: async (newPatient: Patient): Promise<string> => {
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
		},
		setTablePage: (tablePage: number): void => {
			set(
				{
					tablePage
				},
				false,
				"SET_TABLE_PAGE"
			);
		},
		setTableSize: (tableSize: number): void => {
			set(
				{
					tableSize
				},
				false,
				"SET_TABLE_SIZE"
			);
		},
		uploadImages: async (images: ImagesBlob[], type: string): Promise<ImagesDownloadLink[]> => {
			const { currentPatient } = get();

			const apiResponse: ApiResponse<ImagesDownloadLink[]> = await cloudinaryUploadImages(images, currentPatient.id, type);

			return apiResponse.data!;
		}
	}))
);
