// Enums & Types
import { Sex } from "@/enums";
import { Appointment, AuthForm, Doctor, DoctorForm, Patient, PatientForm } from "@/types";

type DefaultValue = {
	Appointment: Appointment;
	Doctor: Doctor;
	DoctorForm: DoctorForm;
	Login: AuthForm;
	Patient: Patient;
	PatientForm: PatientForm;
};

export const DefaultValues: DefaultValue = {
	Appointment: {
		id: "",
		data: {
			date: new Date(),
			idDoctor: "",
			nameDoctor: "",
			summary: "",
			estimatedImageLink: "",
			uploadedImageLink: ""
		}
	},
	Doctor: {
		id: "",
		data: {
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
		}
	},
	DoctorForm: {
		birthDate: "",
		dni: "",
		email: "",
		firstName: "",
		lastName: "",
		locationAddress: "",
		phone: "",
		sex: Sex.Male
	},
	Login: {
		email: "",
		password: ""
	},
	Patient: {
		id: "",
		data: {
			lastAppointmentDate: new Date(),
			birthDate: new Date(),
			creationDate: new Date(),
			dni: "",
			firstName: "",
			lastName: "",
			nameDoctorCreation: "",
			idDoctorCreation: "",
			locationAddress: "",
			phone: "",
			sex: Sex.Male
		}
	},
	PatientForm: {
		birthDate: "",
		dni: "",
		firstName: "",
		lastName: "",
		locationAddress: "",
		phone: "",
		sex: Sex.Male
	}
};
