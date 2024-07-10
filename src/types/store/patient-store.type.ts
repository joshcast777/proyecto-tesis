import { Appointment, Patient, PatientData } from "../patient.type";

export type PatientStore = {
	currentAppointment: Appointment;
	currentPatient: Patient;
	patients: Patient[];
	clearCurrentAppointment: () => void;
	clearCurrentPatient: () => void;
	clearPatients: () => void;
	editPatient: (newPatient: Patient) => Promise<string>;
	getAppointment: () => Promise<void>;
	getPatient: (id: string) => Promise<string>;
	getPatients: () => Promise<void>;
	savePatient: (newPatient: PatientData) => Promise<string>;
};
