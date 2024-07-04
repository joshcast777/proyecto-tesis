/* eslint-disable @typescript-eslint/no-explicit-any */

import { ErrorMessages } from "@/constants";
import { Collections, DoctorFields, QueryOperator, Roles } from "@/enums";
import { ApiResponse, Doctor, DoctorCreate } from "@/types";
import { parse } from "date-fns";
import { CollectionReference, DocumentSnapshot, Firestore, Query, QueryDocumentSnapshot, QueryFieldFilterConstraint, QuerySnapshot, Timestamp, and, collection, doc, getDoc, getDocs, getFirestore, or, query, setDoc, where } from "firebase/firestore";
import { app } from "../../firebase";
import { errorApiResponse, successApiResponse } from "@/lib";

const database: Firestore = getFirestore(app);

export async function firebaseCheckDoctor(email: string): Promise<ApiResponse<null>> {
	try {
		const doctorsRef: CollectionReference = collection(database, Collections.Doctors);

		const adminWhereStatement: QueryFieldFilterConstraint = where(DoctorFields.Role, QueryOperator.EqualTo, Roles.Admin);
		const emailWhereStatement: QueryFieldFilterConstraint = where(DoctorFields.Email, QueryOperator.EqualTo, email);
		const doctorWhereStatement: QueryFieldFilterConstraint = where(DoctorFields.Role, QueryOperator.EqualTo, Roles.Doctor);
		const statusWhereStatement: QueryFieldFilterConstraint = where(DoctorFields.Status, QueryOperator.EqualTo, true);

		const doctorsQuery: Query = query(doctorsRef, and(emailWhereStatement, statusWhereStatement, or(adminWhereStatement, doctorWhereStatement)));

		const doctorsSnapshot: QuerySnapshot = await getDocs(doctorsQuery);

		if (doctorsSnapshot.size === 0) {
			return errorApiResponse<null>({
				message: `${ErrorMessages.DataNotFound} o eliminado`
			});
		}

		return successApiResponse<null>();
	} catch (error: any) {
		console.error(error);

		return errorApiResponse<null>({
			message: error.code
		});
	}
}

export async function firebaseDeleteDoctor(doctor: Doctor): Promise<ApiResponse<null>> {
	try {
		const { id, ...newDoctor } = doctor;

		await setDoc(doc(database, Collections.Doctors, id), newDoctor);

		return successApiResponse<null>();
	} catch (error: any) {
		console.error(error);

		return errorApiResponse({
			message: error.code
		});
	}
}

export async function firebaseGetDoctor(id: string): Promise<ApiResponse<Doctor>> {
	try {
		const doctorSnapshot: DocumentSnapshot = await getDoc(doc(database, Collections.Doctors, id));

		if (!doctorSnapshot.exists()) {
			return errorApiResponse<Doctor>({
				message: ErrorMessages.DataNotFound
			});
		}

		return successApiResponse<Doctor>({
			data: {
				...(doctorSnapshot.data() as Doctor),
				id: doctorSnapshot.id,
				birthDate: (doctorSnapshot.data()[DoctorFields.BirthDate] as Timestamp).toDate(),
				updateDate: (doctorSnapshot.data()[DoctorFields.UpdateDate] as Timestamp).toDate(),
				creationDate: (doctorSnapshot.data()[DoctorFields.CreationDate] as Timestamp).toDate()
			}
		});
	} catch (error: any) {
		console.error(error);

		return errorApiResponse<Doctor>({
			message: error.code
		});
	}
}

export async function firebaseGetDoctors(): Promise<ApiResponse<Doctor[]>> {
	try {
		const doctorsRef: CollectionReference = collection(database, Collections.Doctors);

		const whereStatement: QueryFieldFilterConstraint = where(DoctorFields.Role, QueryOperator.EqualTo, Roles.Doctor);

		const doctorsQuery: Query = query(doctorsRef, whereStatement);

		const doctorsSnapshot: QuerySnapshot = await getDocs(doctorsQuery);

		let doctors: Doctor[] = [];

		if (doctorsSnapshot.size === 0) {
			return successApiResponse<Doctor[]>({
				data: structuredClone(doctors)
			});
		}

		doctors = doctorsSnapshot.docs.map(
			(doctor: QueryDocumentSnapshot): Doctor => ({
				...(doctor.data() as Doctor),
				birthDate: (doctor.data()[DoctorFields.BirthDate] as Timestamp).toDate(),
				updateDate: (doctor.data()[DoctorFields.UpdateDate] as Timestamp).toDate(),
				creationDate: (doctor.data()[DoctorFields.CreationDate] as Timestamp).toDate(),
				id: doctor.id
			})
		);

		return successApiResponse<Doctor[]>({
			data: structuredClone(doctors)
		});
	} catch (error: any) {
		console.error(error);

		return errorApiResponse<Doctor[]>({
			message: error.code
		});
	}
}

export async function firebaseSaveDoctor(id: string, newDoctor: DoctorCreate): Promise<ApiResponse<null>> {
	try {
		await setDoc(doc(database, Collections.Doctors, id), {
			...newDoctor,
			birthDate: parse(newDoctor.birthDate, "dd/MM/yyyy", new Date())
		});

		return successApiResponse<null>();
	} catch (error: any) {
		console.error(error);

		return errorApiResponse<null>({
			message: error.code
		});
	}
}
