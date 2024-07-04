import { Sex } from "@/enums";

export type Patient = {
	id: string;
	birthDate: Date;
	creationDate: Date;
	dni: string;
	firstName: string;
	lastName: string;
	doctorNameCreation: string;
	locationAddress: string;
	phone: string;
	sex: Sex;
};

export type PatientCreate = {
	birthDate: string;
	creationDate: Date;
	dni: string;
	firstName: string;
	lastName: string;
	doctorNameCreation: string;
	locationAddress: string;
	phone: string;
	sex: Sex;
};

export type Appointment = {
	id: string;
	date: Date;
	doctorName: string;
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
