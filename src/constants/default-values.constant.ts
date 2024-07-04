import { Sex } from "@/enums";
import { Appointment, AuthForm, Doctor, DoctorCreate, Patient, PatientCreate } from "@/types";

type DefaultValue = {
	Appointment: Appointment;
	Doctor: Doctor;
	DoctorCreate: DoctorCreate;
	Login: AuthForm;
	Patient: Patient;
	PatientCreate: PatientCreate;
};

export const DefaultValues: DefaultValue = {
	Appointment: {
		id: "",
		date: new Date(),
		doctorName: "",
		summary: ""
	},
	Doctor: {
		id: "",
		birthDate: new Date(),
		creationDate: new Date(),
		dni: "",
		email: "",
		firstName: "",
		lastName: "",
		locationAddress: "",
		phone: "",
		role: "",
		sex: Sex.Male,
		status: true,
		updateDate: new Date()
	},
	DoctorCreate: {
		birthDate: "",
		creationDate: new Date(),
		dni: "",
		email: "",
		firstName: "",
		lastName: "",
		locationAddress: "",
		phone: "",
		role: "",
		sex: Sex.Male,
		status: true,
		updateDate: new Date()
	},
	Login: {
		email: "",
		password: ""
	},
	Patient: {
		id: "",
		birthDate: new Date(),
		creationDate: new Date(),
		dni: "",
		firstName: "",
		lastName: "",
		doctorNameCreation: "",
		locationAddress: "",
		phone: "",
		sex: Sex.Male
	},
	PatientCreate: {
		birthDate: "",
		creationDate: new Date(),
		dni: "",
		firstName: "",
		lastName: "",
		doctorNameCreation: "",
		locationAddress: "",
		phone: "",
		sex: Sex.Male
	}
};
