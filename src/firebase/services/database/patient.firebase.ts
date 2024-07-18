/* eslint-disable @typescript-eslint/no-explicit-any */

import { ErrorMessages } from "@/constants";
import { AppointmentFields, Collections, LocalStorageKeys, PatientFields, QueryOperator } from "@/enums";
import { app } from "@/firebase/firebase";
import { errorApiResponse, successApiResponse } from "@/lib";
import { ApiResponse, Appointment, AppointmentData, Patient, PatientData, PatientReferences } from "@/types";
import { CollectionReference, DocumentData, DocumentReference, DocumentSnapshot, Firestore, Query, QueryDocumentSnapshot, QueryFieldFilterConstraint, QueryOrderByConstraint, QuerySnapshot, Timestamp, addDoc, collection, doc, getDoc, getDocs, getFirestore, limit, orderBy, query, setDoc, where } from "firebase/firestore";

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

export async function firebaseGetAppointment(patientId: string): Promise<ApiResponse<Appointment>> {
	try {
		const appointmentsRef: CollectionReference = collection(database, `${Collections.Patients}/${patientId}/${Collections.Appointments}`);

		const orderStatement: QueryOrderByConstraint = orderBy(AppointmentFields.Date, "desc");

		const appointmentQuery: Query = query(appointmentsRef, orderStatement, limit(1));

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
					lastAppointmentDate: Boolean(patientData[PatientFields.LastAppointmentDate]) ? (patientData[PatientFields.LastAppointmentDate] as Timestamp).toDate() : null,
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

export async function firebaseGetPatients(): Promise<ApiResponse<PatientReferences>> {
	try {
		const patientsRef: CollectionReference = collection(database, Collections.Patients);

		const orderStatement: QueryOrderByConstraint = orderBy(PatientFields.LastAppointmentDate, "desc");

		const whereStatement: QueryFieldFilterConstraint = where(PatientFields.IdDoctorCreation, QueryOperator.EqualTo, localStorage.getItem(LocalStorageKeys.Id)!);

		// let patientQuery: Query;

		// if (direction === "NEXT" && lastPatientDocumentSnapshot !== null) {
		// 	patientQuery = query(patientsRef, orderStatement, startAfter(lastPatientDocumentSnapshot), limit(size));
		// } else if (direction === "PREVIOUS" && firstPatientDocumentSnapshot !== null) {
		// 	patientQuery = query(patientsRef, orderStatement, endBefore(firstPatientDocumentSnapshot), limit(size));
		// } else {
		// 	patientQuery = query(patientsRef, orderStatement, limit(size));
		// }

		const patientQuery: Query = query(patientsRef, whereStatement, orderStatement);

		const patientsSnapshot: QuerySnapshot = await getDocs(patientQuery);

		if (patientsSnapshot.size === 0) {
			return successApiResponse<PatientReferences>({
				data: {
					firstPatientDocumentSnapshot: null,
					lastPatientDocumentSnapshot: null,
					patients: []
				}
			});
		}

		const patients: Patient[] = patientsSnapshot.docs.map((patient: QueryDocumentSnapshot): Patient => {
			const patientData: DocumentData = patient.data();

			return {
				id: patient.id,
				data: {
					...(patientData as PatientData),
					lastAppointmentDate: Boolean(patientData[PatientFields.LastAppointmentDate]) ? (patientData[PatientFields.LastAppointmentDate] as Timestamp).toDate() : null,
					birthDate: (patientData[PatientFields.BirthDate] as Timestamp).toDate(),
					creationDate: (patientData[PatientFields.CreationDate] as Timestamp).toDate()
				}
			};
		});

		return successApiResponse<PatientReferences>({
			data: {
				firstPatientDocumentSnapshot: patientsSnapshot.docs[0],
				lastPatientDocumentSnapshot: patientsSnapshot.docs[patientsSnapshot.docs.length - 1],
				patients
			}
		});
	} catch (error: any) {
		console.error(error);

		return errorApiResponse<PatientReferences>({
			message: error.code
		});
	}
}

export async function firebaseSaveAppointment(newAppointment: AppointmentData, patientId: string): Promise<ApiResponse<Appointment>> {
	try {
		const appointmentRef: DocumentReference = await addDoc(collection(database, `${Collections.Patients}/${patientId}/${Collections.Appointments}`), newAppointment);

		return successApiResponse<Appointment>({
			data: {
				id: appointmentRef.id,
				data: newAppointment
			}
		});
	} catch (error: any) {
		console.error(error);

		return errorApiResponse<Appointment>({
			message: error.code
		});
	}
}

export async function firebaseSavePatient(newPatient: PatientData): Promise<ApiResponse<Patient>> {
	try {
		const patientRef: DocumentReference = await addDoc(collection(database, Collections.Patients), newPatient);

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
