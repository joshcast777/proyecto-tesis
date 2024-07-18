/* eslint-disable @typescript-eslint/no-explicit-any */

import { ErrorMessages } from "@/constants";
import { Collections, DoctorFields, QueryOperator, Roles } from "@/enums";
import { ApiResponse, Doctor, DoctorData } from "@/types";
import { CollectionReference, DocumentData, DocumentSnapshot, Firestore, Query, QueryDocumentSnapshot, QueryFieldFilterConstraint, QuerySnapshot, and, collection, doc, getDoc, getDocs, getFirestore, or, query, setDoc, where } from "firebase/firestore";
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
		const { id, data } = doctor;

		await setDoc(doc(database, Collections.Doctors, id), data);

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

		const doctorData: DocumentData = doctorSnapshot.data();

		return successApiResponse<Doctor>({
			data: {
				id: doctorSnapshot.id,
				data: {
					...(doctorData as DoctorData),
					birthDate: doctorData[DoctorFields.BirthDate].toDate(),
					updateDate: doctorData[DoctorFields.UpdateDate].toDate(),
					creationDate: doctorData[DoctorFields.CreationDate].toDate()
				}
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

		if (doctorsSnapshot.size === 0) {
			return successApiResponse<Doctor[]>({
				data: []
			});
		}

		const doctors: Doctor[] = doctorsSnapshot.docs.map((doctor: QueryDocumentSnapshot): Doctor => {
			const doctorData: DocumentData = doctor.data();

			return {
				id: doctor.id,
				data: {
					...(doctorData as DoctorData),
					birthDate: doctorData[DoctorFields.BirthDate].toDate(),
					updateDate: doctorData[DoctorFields.UpdateDate].toDate(),
					creationDate: doctorData[DoctorFields.CreationDate].toDate()
				}
			};
		});

		return successApiResponse<Doctor[]>({
			data: doctors
		});
	} catch (error: any) {
		console.error(error);

		return errorApiResponse<Doctor[]>({
			message: error.code
		});
	}
}

export async function firebaseSaveDoctor(id: string, newDoctor: DoctorData): Promise<ApiResponse<null>> {
	try {
		await setDoc(doc(database, Collections.Doctors, id), newDoctor);

		return successApiResponse<null>();
	} catch (error: any) {
		console.error(error);

		return errorApiResponse<null>({
			message: error.code
		});
	}
}
