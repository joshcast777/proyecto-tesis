import { AuthUser, Doctor } from "@/types";

export type AuthStore = {
	isAuthenticated: boolean;
	currentDoctor: Doctor;
	getCurrentDoctor: (uid: string) => Promise<void>;
	clearIsAuthenticated: () => void;
	setIsAuthenticated: (user: Doctor) => void;
	// setSuccessMessage: (successMessage: string) => void;
	// setUserAdmin: (userAdmin: IUserAdmin) => void;
	signInDoctor: ({ email, password }: AuthUser) => Promise<string>;
	signOutDoctor: () => Promise<string>;
	signUpDoctor: ({ email, password }: AuthUser) => Promise<string>;
	// updateUserEmail: (email: string) => Promise<void>;
};
