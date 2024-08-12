import { Doctor, DoctorData } from "../doctor.type";

export type DoctorStore = {
	doctor: Doctor;
	doctors: Doctor[];
	checkDoctor: (email: string) => Promise<string>;
	clearDoctors: () => void;
	deleteDoctor: (id: string) => Promise<string>;
	restoreDoctor: (id: string) => Promise<string>;
	getDoctor: (id: string) => Promise<string>;
	getDoctors: () => Promise<void>;
	saveDoctor: (id: string, doctor: DoctorData) => Promise<string>;
};
