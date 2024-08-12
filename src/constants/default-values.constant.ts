// Enums & Types
import { Sex } from "@/enums";
import { Angles, Appointment, AuthForm, Doctor, DoctorForm, Patient, PatientForm } from "@/types";

type DefaultValue = {
	Angles: Angles;
	Appointment: Appointment;
	Doctor: Doctor;
	DoctorForm: DoctorForm;
	Login: AuthForm;
	Patient: Patient;
	PatientForm: PatientForm;
};

export const DefaultValues: DefaultValue = {
	Angles: {
		elbow: {
			left: 0,
			right: 0
		}
	},
	Appointment: {
		id: "",
		data: {
			date: new Date(),
			idDoctor: "",
			nameDoctor: "",
			angles: {
				elbow: {
					left: 0,
					right: 0
				}
			},
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
			role: "",
			email: "",
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
		email: "",
		locationAddress: "",
		phone: "",
		sex: Sex.Male
	}
};
