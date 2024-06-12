import { firebaseSignInUser } from "@/firebase/services";
import { ApiResponse, AuthUser } from "@/models";
import { AuthStore } from "@/types/store/auth-store.type";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

export const authStore = create<AuthStore>()(
	devtools((set) => ({
		errorMessage: "",
		isAuthenticated: Boolean(localStorage.getItem("uid")) ? true : false,
		isLoading: false,
		clearErrorMessage: (): void => {
			set({ errorMessage: "" }, false, "SET_ERROR_MESSAGE");
		},
		setErrorMessage: (message: string): void => {
			set({ errorMessage: message }, false, "SET_ERROR_MESSAGE");
		},
		setIsAuthenticated: (isAuthenticated: boolean): void => {
			set({ isAuthenticated }, false, "SET_AUTHENTICATED_USER");
		},
		setIsLoading: (isLoading: boolean): void => {
			set({ isLoading }, false, "SET_IS_LOADiNG");
		},
		signInUser: async ({ email, password }: AuthUser): Promise<void> => {
			const signInResponse: ApiResponse<string> = await firebaseSignInUser({ email, password });

			console.log(signInResponse);

			if (signInResponse.message !== "") {
				set({ errorMessage: signInResponse.message }, false, "SET_ERROR_MESSAGE");

				return;
			}

			localStorage.setItem("uid", signInResponse.data!);
			set({ isAuthenticated: true }, false, "SET_IS_AUTHENTICATED");
		}
	}))
);
