/* eslint-disable @typescript-eslint/no-explicit-any */

import { ErrorMessages } from "@/constants";
import { AppointmentFields, Collections, PatientFields } from "@/enums";
import { app } from "@/firebase/firebase";
import { errorApiResponse, successApiResponse } from "@/lib";
import { ApiResponse, Appointment, Patient, PatientCreate } from "@/types";
import { parse } from "date-fns";
import { CollectionReference, DocumentSnapshot, Firestore, Query, QueryDocumentSnapshot, QueryOrderByConstraint, QuerySnapshot, Timestamp, addDoc, collection, doc, getDoc, getDocs, getFirestore, limit, orderBy, query, setDoc } from "firebase/firestore";

const database: Firestore = getFirestore(app);

export async function firebaseEditPatient(newPatient: Patient): Promise<ApiResponse<Patient>> {
	try {
		const { id, ...data } = newPatient;

		await setDoc(doc(database, Collections.Patients, id), {
			...data
		});

		return successApiResponse<Patient>({
			data: {
				...data,
				id
			}
		});
	} catch (error: any) {
		console.error(error);

		return errorApiResponse<Patient>({
			message: error.code
		});
	}
}

export async function firebaseGetCurrentAppointment(id: string): Promise<ApiResponse<Appointment>> {
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
				...(appointment.data() as Appointment),
				id: appointment.id,
				date: (appointment.data()[AppointmentFields.Date] as Timestamp).toDate()
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
		const doctorSnapshot: DocumentSnapshot = await getDoc(doc(database, Collections.Patients, id));

		if (!doctorSnapshot.exists()) {
			return errorApiResponse<Patient>({
				message: ErrorMessages.DataNotFound
			});
		}

		return successApiResponse<Patient>({
			data: {
				...(doctorSnapshot.data() as Patient),
				id: doctorSnapshot.id,
				birthDate: (doctorSnapshot.data()[PatientFields.BirthDate] as Timestamp).toDate(),
				creationDate: (doctorSnapshot.data()[PatientFields.CreationDate] as Timestamp).toDate()
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

		let patients: Patient[] = [];

		if (patientsSnapshot.size === 0) {
			return successApiResponse<Patient[]>({
				data: structuredClone(patients)
			});
		}

		patients = patientsSnapshot.docs.map(
			(patient: QueryDocumentSnapshot): Patient => ({
				...(patient.data() as Patient),
				birthDate: (patient.data()[PatientFields.BirthDate] as Timestamp).toDate(),
				creationDate: (patient.data()[PatientFields.CreationDate] as Timestamp).toDate(),
				id: patient.id
			})
		);

		return successApiResponse<Patient[]>({
			data: structuredClone(patients)
		});
	} catch (error: any) {
		console.error(error);

		return errorApiResponse<Patient[]>({
			message: error.code
		});
	}
}

export async function firebaseSavePatient(newPatient: PatientCreate): Promise<ApiResponse<Patient>> {
	try {
		const patientRef = await addDoc(collection(database, Collections.Patients), {
			...newPatient,
			birthDate: parse(newPatient.birthDate, "dd/MM/yyyy", new Date())
		});

		const patient: PatientCreate = structuredClone(newPatient);

		return successApiResponse<Patient>({
			data: {
				...patient,
				id: patientRef.id,
				birthDate: parse(patient.birthDate, "dd/MM/yyyy", new Date())
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
