/* eslint-disable @typescript-eslint/no-explicit-any */

// Firebase
import { Auth, User, UserCredential, createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { app } from "../../firebase";

// Utils
import { errorApiResponse, successApiResponse } from "@/lib";

// Types
import { ApiResponse, AuthForm } from "@/types";

/**
 * Firebase Authentication instance
 *
 * @type {Auth}
 */
const firebaseAuth: Auth = getAuth(app);

/**
 * Signs in a doctor using Firebase Authentication.
 *
 * @export
 * @async
 * @param {AuthForm} params - The authentication form containing the email and password.
 * @param {string} params.email - The email of the doctor.
 * @param {string} params.password - The password of the doctor.
 * @returns {Promise<ApiResponse<string>>} A promise that resolves with an API response containing a string.
 */
export async function firebaseSignInDoctor({ email, password }: AuthForm): Promise<ApiResponse<string>> {
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

/**
 * Signs out the currently authenticated doctor using Firebase Authentication.
 *
 * @export
 * @async
 * @returns {Promise<ApiResponse<null>>} A promise that resolves with an API response containing null.
 */
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

/**
 * Signs up a new doctor using Firebase Authentication.
 *
 * @export
 * @async
 * @param {AuthForm} params - The parameters for signing up.
 * @param {string} params.email - The email of the doctor.
 * @param {string} params.password - The password of the doctor.
 * @returns {Promise<ApiResponse<string>>} A promise that resolves with an API response containing a string.
 */
export async function firebaseSignUpDoctor({ email, password }: AuthForm): Promise<ApiResponse<string>> {
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

/**
 * Gets the currently authenticated doctor using Firebase Authentication.
 *
 * @export
 * @async
 * @returns {Promise<void>} A promise that resolves with no value.
 */
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
