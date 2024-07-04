import { Appointment, Patient, PatientCreate } from "../patient.type";

export type PatientStore = {
	currentAppointment: Appointment;
	currentPatient: Patient;
	patients: Patient[];
	clearCurrentAppointment: () => void;
	clearCurrentPatient: () => void;
	clearPatients: () => void;
	editPatient: (newPatient: Patient) => Promise<string>;
	getCurrentAppointment: () => Promise<string>;
	getPatient: (id: string) => Promise<string>;
	getPatients: () => Promise<void>;
	savePatient: (newPatient: PatientCreate) => Promise<string>;
};
