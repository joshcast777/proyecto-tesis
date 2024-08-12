import { DefaultValues, ErrorMessages } from "@/constants";
import { firebaseCheckDoctor, firebaseDeleteDoctor, firebaseGetDoctor, firebaseGetDoctors, firebaseSaveDoctor } from "@/firebase/services/database";
import { ApiResponse, Doctor, DoctorData } from "@/types";
import { DoctorStore } from "@/types/store";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

export const doctorStore = create<DoctorStore>()(
	devtools((set, get) => ({
		doctor: DefaultValues.Doctor,
		doctors: [],
		checkDoctor: async (email: string): Promise<string> => {
			const apiResponse: ApiResponse<null> = await firebaseCheckDoctor(email);

			if (!apiResponse.success) {
				return apiResponse.message;
			}

			return "";
		},
		clearDoctors: (): void => {
			set(
				{
					doctors: []
				},
				false,
				"CLEAR_DOCTORS"
			);
		},
		deleteDoctor: async (id: string): Promise<string> => {
			const { doctors } = get();

			const doctor: Doctor | undefined = doctors.find((doctor: Doctor): boolean => doctor.id === id);

			doctor!.data.status = false;

			const apiResponse: ApiResponse<null> = await firebaseDeleteDoctor(doctor!);

			if (!apiResponse.success) {
				return ErrorMessages.CouldNotCompleteTask;
			}

			return "";
		},
		restoreDoctor: async (id: string): Promise<string> => {
			const { doctors } = get();

			const doctor: Doctor | undefined = doctors.find((doctor: Doctor): boolean => doctor.id === id);

			doctor!.data.status = true;

			const apiResponse: ApiResponse<null> = await firebaseDeleteDoctor(doctor!);

			if (!apiResponse.success) {
				return ErrorMessages.CouldNotCompleteTask;
			}

			return "";
		},
		getDoctor: async (id: string): Promise<string> => {
			const apiResponse: ApiResponse<Doctor> = await firebaseGetDoctor(id);

			if (!apiResponse.success) {
				return apiResponse.message;
			}

			set(
				{
					doctor: apiResponse.data!
				},
				false,
				"SET_DOCTOR"
			);

			return "";
		},
		getDoctors: async (): Promise<void> => {
			const apiResponse: ApiResponse<Doctor[]> = await firebaseGetDoctors();

			if (!apiResponse.success) {
				return;
			}

			set(
				{
					doctors: apiResponse.data!
				},
				false,
				"SET_DOCTORS"
			);
		},
		saveDoctor: async (id: string, doctor: DoctorData): Promise<string> => {
			const apiResponse: ApiResponse<null> = await firebaseSaveDoctor(id, doctor);

			if (apiResponse.message !== "") {
				return ErrorMessages.CouldNotCompleteTask;
			}

			return "";
		}
	}))
);
