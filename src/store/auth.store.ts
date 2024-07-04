import { DefaultValues, ErrorMessages, LocalStorageKeys } from "@/constants";
import { firebaseSignInDoctor, firebaseSignOutDoctor, firebaseSignUpDoctor } from "@/firebase/services/auth";
import { firebaseGetDoctor } from "@/firebase/services/database";
import { ApiResponse, AuthUser, Doctor } from "@/types";
import { AuthStore } from "@/types/store";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

export const authStore = create<AuthStore>()(
	devtools((set) => ({
		isAuthenticated: Boolean(localStorage.getItem(LocalStorageKeys.Id)) && Boolean(localStorage.getItem(LocalStorageKeys.Role)) && localStorage.getItem(LocalStorageKeys.Id) !== "" && localStorage.getItem(LocalStorageKeys.Role) !== "",
		currentDoctor: DefaultValues.Doctor,
		clearIsAuthenticated: (): void => {
			set(
				{
					isAuthenticated: false,
					currentDoctor: DefaultValues.Doctor
				},
				false,
				"CLEAR_ERROR_MESSAGE"
			);
		},
		getCurrentDoctor: async (id: string): Promise<void> => {
			const apiResponse: ApiResponse<Doctor> = await firebaseGetDoctor(id);

			if (!apiResponse.success) {
				set(
					{
						currentDoctor: DefaultValues.Doctor,
						isAuthenticated: false
					},
					false,
					"SET_ERROR_MESSAGE"
				);

				return;
			}

			localStorage.setItem(LocalStorageKeys.Id, apiResponse.data!.id);
			localStorage.setItem(LocalStorageKeys.Role, apiResponse.data!.role);

			set(
				{
					currentDoctor: apiResponse.data!,
					isAuthenticated: true
				},
				false,
				"SET_CURRENT_USER"
			);
		},
		setIsAuthenticated: (user: Doctor): void => {
			set(
				{
					isAuthenticated: true,
					currentDoctor: user
				},
				false,
				"SET_AUTHENTICATED_USER"
			);
		},
		signInDoctor: async ({ email, password }: AuthUser): Promise<string> => {
			const apiResponse: ApiResponse<string> = await firebaseSignInDoctor({
				email,
				password
			});

			if (!apiResponse.success) {
				if (apiResponse.message === ErrorMessages.InvalidCredentials) {
					return ErrorMessages.InvalidCredentials;
				} else {
					return ErrorMessages.CouldNotCompleteTask;
				}
			}

			localStorage.setItem(LocalStorageKeys.Id, apiResponse.data!);

			return apiResponse.data!;
		},
		signOutDoctor: async (): Promise<string> => {
			const apiResponse: ApiResponse<null> = await firebaseSignOutDoctor();
			console.log(apiResponse);

			if (!apiResponse.success) {
				return ErrorMessages.CouldNotCompleteTask;
			}

			localStorage.removeItem(LocalStorageKeys.Id);
			localStorage.removeItem(LocalStorageKeys.Role);

			return "";
		},
		signUpDoctor: async ({ email, password }: AuthUser): Promise<string> => {
			const apiResponse: ApiResponse<string> = await firebaseSignUpDoctor({
				email,
				password
			});
			console.log(apiResponse);

			if (!apiResponse.success) {
				return ErrorMessages.CouldNotCompleteTask;
			}

			return apiResponse.data!;
		}
	}))
);
