/* eslint-disable @typescript-eslint/no-explicit-any */

import { ErrorMessages } from "@/constants";
import { AppointmentFields, Collections, PatientFields } from "@/enums";
import { app } from "@/firebase/firebase";
import { errorApiResponse, successApiResponse } from "@/lib";
import { ApiResponse, Appointment, AppointmentData, Patient, PatientData } from "@/types";
import { CollectionReference, DocumentData, DocumentSnapshot, Firestore, Query, QueryDocumentSnapshot, QueryOrderByConstraint, QuerySnapshot, Timestamp, addDoc, collection, doc, getDoc, getDocs, getFirestore, limit, orderBy, query, setDoc } from "firebase/firestore";

const database: Firestore = getFirestore(app);

export async function firebaseEditPatient({ id, data }: Patient): Promise<ApiResponse<Patient>> {
	try {
		await setDoc(doc(database, Collections.Patients, id), data);

		return successApiResponse<Patient>({
			data: {
				id,
				data
			}
		});
	} catch (error: any) {
		console.error(error);

		return errorApiResponse<Patient>({
			message: error.code
		});
	}
}

export async function firebaseGetAppointment(id: string): Promise<ApiResponse<Appointment>> {
	try {
		const patientsRef: CollectionReference = collection(database, `${Collections.Patients}/${id}/${Collections.Appointments}`);

		const orderStatement: QueryOrderByConstraint = orderBy(AppointmentFields.Date, "desc");

		const appointmentQuery: Query = query(patientsRef, orderStatement, limit(1));

		const appointmentSnapshot: QuerySnapshot = await getDocs(appointmentQuery);

		if (appointmentSnapshot.size === 0) {
			return errorApiResponse<Appointment>({
				message: ErrorMessages.DataNotFound
			});
		}

		const appointment: QueryDocumentSnapshot = appointmentSnapshot.docs[0];

		return successApiResponse<Appointment>({
			data: {
				id: appointment.id,
				data: {
					...(appointment.data() as AppointmentData),
					date: (appointment.data()[AppointmentFields.Date] as Timestamp).toDate()
				}
			}
		});
	} catch (error: any) {
		console.error(error);

		return errorApiResponse<Appointment>({
			message: error.code
		});
	}
}

export async function firebaseGetPatient(id: string): Promise<ApiResponse<Patient>> {
	try {
		const patientSnapshot: DocumentSnapshot = await getDoc(doc(database, Collections.Patients, id));

		if (!patientSnapshot.exists()) {
			return errorApiResponse<Patient>({
				message: ErrorMessages.DataNotFound
			});
		}

		const patientData: DocumentData = patientSnapshot.data();

		return successApiResponse<Patient>({
			data: {
				id: patientSnapshot.id,
				data: {
					...(patientData as PatientData),
					birthDate: (patientData[PatientFields.BirthDate] as Timestamp).toDate(),
					creationDate: (patientData[PatientFields.CreationDate] as Timestamp).toDate()
				}
			}
		});
	} catch (error: any) {
		console.error(error);

		return errorApiResponse<Patient>({
			message: error.code
		});
	}
}

export async function firebaseGetPatients(): Promise<ApiResponse<Patient[]>> {
	try {
		const patientsSnapshot: QuerySnapshot = await getDocs(collection(database, Collections.Patients));

		if (patientsSnapshot.size === 0) {
			return successApiResponse<Patient[]>({
				data: []
			});
		}

		const patients: Patient[] = patientsSnapshot.docs.map((patient: QueryDocumentSnapshot): Patient => {
			const patientData: DocumentData = patient.data();

			return {
				id: patient.id,
				data: {
					...(patientData as PatientData),
					birthDate: (patientData[PatientFields.BirthDate] as Timestamp).toDate(),
					creationDate: (patientData[PatientFields.CreationDate] as Timestamp).toDate()
				}
			};
		});

		return successApiResponse<Patient[]>({
			data: patients
		});
	} catch (error: any) {
		console.error(error);

		return errorApiResponse<Patient[]>({
			message: error.code
		});
	}
}

export async function firebaseSavePatient(newPatient: PatientData): Promise<ApiResponse<Patient>> {
	try {
		const patientRef = await addDoc(collection(database, Collections.Patients), newPatient);

		return successApiResponse<Patient>({
			data: {
				id: patientRef.id,
				data: newPatient
			}
		});
	} catch (error: any) {
		console.error(error);

		return errorApiResponse<Patient>({
			message: error.code,
			data: null
		});
	}
}
