import { Doctor, DoctorCreate } from "../doctor.type";

export type DoctorStore = {
	doctors: Doctor[];
	checkDoctor: (email: string) => Promise<string>;
	clearDoctors: () => void;
	deleteDoctor: (id: string) => Promise<string>;
	getDoctor: (id: string) => Promise<Doctor | string>;
	getDoctors: () => Promise<void>;
	saveDoctor: (id: string, doctor: DoctorCreate) => Promise<string>;
};
