import { Sex } from "@/enums";
import { QueryDocumentSnapshot } from "firebase/firestore";
import { Angles } from "./angles.type";
import { Global } from "./global.type";

export type PatientReferences = {
	firstPatientDocumentSnapshot: null | QueryDocumentSnapshot;
	lastPatientDocumentSnapshot: null | QueryDocumentSnapshot;
	patients: Patient[];
};

export type Patient = Global & {
	data: PatientData;
};

export type PatientData = {
	birthDate: Date;
	creationDate: Date;
	dni: string;
	firstName: string;
	lastName: string;
	email: string;
	role: string;
	nameDoctorCreation: string;
	idDoctorCreation: string;
	lastAppointmentDate: null | Date;
	locationAddress: string;
	phone: string;
	sex: Sex;
};

export type PatientForm = {
	birthDate: string;
	dni: string;
	firstName: string;
	lastName: string;
	email: string;
	locationAddress: string;
	phone: string;
	sex: Sex;
};

export type Appointment = Global & {
	data: AppointmentData;
};

export type AppointmentData = {
	angles?: Angles;
	date: Date;
	estimatedImageLink: string;
	idDoctor: string;
	nameDoctor: string;
	summary: string;
	uploadedImageLink: string;
};

export type ImagesBlob = {
	type: "U" | "E";
	image: Blob;
};

export type ImagesDownloadLink = {
	type: "U" | "E";
	downloadLink: string;
};

export type PatientTable = {
	id: string;
	index: number;
	dni: string;
	fullName: string;
	age: number;
	sex: Sex;
	actions: React.ReactNode;
};

export type AppointmentTable = {
	id: string;
	index: number;
	date: Date;
	nameDoctor: string;
	actions: React.ReactNode;
};
