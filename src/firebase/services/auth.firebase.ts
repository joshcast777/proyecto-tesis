/* eslint-disable @typescript-eslint/no-explicit-any */

import { ErrorResponse } from "@/constants";
import { ApiResponse, AuthUser } from "@/models";
import { User, UserCredential, getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "../firebase";

const firebaseAuth = getAuth(app);

export async function firebaseSignInUser({ email, password }: AuthUser): Promise<ApiResponse<string>> {
	try {
		const userCredentials: UserCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
		const user: User = { ...userCredentials.user };

		return {
			success: true,
			message: "",
			data: user.uid
		};
	} catch (error: any) {
		return {
			success: false,
			message: `${ErrorResponse}${error.code}`
		};
	}
}

// signInWithEmailAndPassword(auth, email, password)
// 	.then((userCredential) => {
// 		// Signed in
// 		const user = userCredential.user;
// 		// ...
// 	})
// 	.catch((error) => {
// 		const errorCode = error.code;
// 		const errorMessage = error.message;
// 	});
