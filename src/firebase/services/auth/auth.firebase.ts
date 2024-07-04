/* eslint-disable @typescript-eslint/no-explicit-any */

import { errorApiResponse, successApiResponse } from "@/lib";
import { ApiResponse, AuthUser } from "@/types";
import { Auth, User, UserCredential, createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { app } from "../../firebase";

const firebaseAuth: Auth = getAuth(app);

export async function firebaseSignInDoctor({ email, password }: AuthUser): Promise<ApiResponse<string>> {
	try {
		const userCredential: UserCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);

		return successApiResponse<string>({
			data: userCredential.user.uid
		});
	} catch (error: any) {
		console.error(error);

		return errorApiResponse<string>({
			message: error.code
		});
	}
}

export async function firebaseSignOutDoctor(): Promise<ApiResponse<null>> {
	try {
		await signOut(firebaseAuth);

		return successApiResponse<null>();
	} catch (error: any) {
		console.error(error);

		return errorApiResponse({
			message: error.code
		});
	}
}

export async function firebaseSignUpDoctor({ email, password }: AuthUser): Promise<ApiResponse<string>> {
	try {
		const userCredential: UserCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);

		return successApiResponse<string>({
			data: userCredential.user.uid
		});
	} catch (error: any) {
		console.error(error);

		return errorApiResponse<string>({
			message: error.code
		});
	}
}

export async function firebaseGetAuthenticatedDoctor(): Promise<void> {
	onAuthStateChanged(
		firebaseAuth,
		(user: User | null) => {
			console.log(firebaseAuth);

			if (Boolean(user)) {
				console.log(user);
			} else {
				console.log("Error");
			}
		},
		(error: any) => {
			console.error(error);
		}
	);
}
