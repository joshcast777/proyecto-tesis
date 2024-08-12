import { Global } from "./global.type";
import { Sex } from "@/enums";

export type Doctor = Global & {
	data: DoctorData;
};

export type DoctorData = {
	birthDate: Date;
	creationDate: Date;
	dni: string;
	email: string;
	firstName: string;
	lastName: string;
	locationAddress: string;
	phone: string;
	role: string;
	sex: Sex;
	status: boolean;
	updateDate: Date;
};

export type DoctorForm = {
	birthDate: string;
	dni: string;
	email: string;
	firstName: string;
	lastName: string;
	locationAddress: string;
	phone: string;
	sex: Sex;
};

export type DoctorCreate = {
	birthDate: string;
	creationDate: Date;
	dni: string;
	email: string;
	firstName: string;
	lastName: string;
	locationAddress: string;
	phone: string;
	role: string;
	sex: Sex;
	status: boolean;
	updateDate: Date;
};

export type DoctorTable = {
	id: string;
	index: number;
	dni: string;
	email: string;
	fullName: string;
	phone: string;
	status: boolean;
	updateDate: string;
	actions: React.ReactNode;
};

export type PoseEstimationValue = {
	uploadedImage: string;
	estimatedImage: string;
	summary: string;
	isValid: () => boolean;
};
