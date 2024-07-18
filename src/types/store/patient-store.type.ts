import { QueryDocumentSnapshot } from "firebase/firestore";
import { Appointment, AppointmentData, ImagesBlob, ImagesDownloadLink, Patient, PatientData } from "../patient.type";

export type PatientStore = {
	currentAppointment: Appointment;
	currentPatient: Patient;
	firstPatientDocumentSnapshot: null | QueryDocumentSnapshot;
	lastPatientDocumentSnapshot: null | QueryDocumentSnapshot;
	patients: Patient[];
	tablePage: number;
	tableSize: number;
	clearCurrentAppointment: () => void;
	clearCurrentPatient: () => void;
	clearPatients: () => void;
	editPatient: (newPatient: Patient) => Promise<string>;
	getAppointment: () => Promise<void>;
	getPatient: (id: string) => Promise<string>;
	getPatients: () => Promise<void>;
	saveAppointment: (newAppointment: AppointmentData) => Promise<string>;
	savePatient: (newPatient: PatientData) => Promise<string>;
	setTablePage: (page: number) => void;
	setTableSize: (size: number) => void;
	uploadImages: (images: ImagesBlob[]) => Promise<ImagesDownloadLink[]>;
};
