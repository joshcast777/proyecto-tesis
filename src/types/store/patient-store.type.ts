import { QueryDocumentSnapshot } from "firebase/firestore";
import { Appointment, AppointmentData, ImagesBlob, ImagesDownloadLink, Patient } from "../patient.type";

export type PatientStore = {
	appointments: Appointment[];
	currentAppointment: Appointment;
	currentPatient: Patient;
	firstPatientDocumentSnapshot: null | QueryDocumentSnapshot;
	lastPatientDocumentSnapshot: null | QueryDocumentSnapshot;
	patients: Patient[];
	tablePage: number;
	tableSize: number;
	clearAppointments: () => void;
	clearCurrentAppointment: () => void;
	clearCurrentPatient: () => void;
	clearPatients: () => void;
	editPatient: (newPatient: Patient) => Promise<string>;
	getCurrentAppointment: (id: string) => Promise<string>;
	getAppointment: () => Promise<void>;
	getAppointments: () => Promise<void>;
	getPatient: (id: string) => Promise<string>;
	getPatients: () => Promise<void>;
	saveAppointment: (newAppointment: AppointmentData) => Promise<string>;
	savePatient: (newPatient: Patient) => Promise<string>;
	setTablePage: (page: number) => void;
	setTableSize: (size: number) => void;
	uploadImages: (images: ImagesBlob[], type: string) => Promise<ImagesDownloadLink[]>;
};
