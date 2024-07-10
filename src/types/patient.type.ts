import { Global } from "./global.type";
import { Sex } from "@/enums";

export type Patient = Global & {
	data: PatientData;
};

export type PatientData = {
	birthDate: Date;
	creationDate: Date;
	dni: string;
	firstName: string;
	lastName: string;
	nameDoctorCreation: string;
	idDoctorCreation: string;
	locationAddress: string;
	phone: string;
	sex: Sex;
};

export type PatientForm = {
	birthDate: string;
	dni: string;
	firstName: string;
	lastName: string;
	locationAddress: string;
	phone: string;
	sex: Sex;
};

export type Appointment = Global & {
	data: AppointmentData;
};

export type AppointmentData = {
	date: Date;
	nameDoctor: string;
	idDoctor: string;
	summary: string;
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
