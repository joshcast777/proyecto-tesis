import { LocalStorageKeys } from "@/enums";
import { GlobalStore } from "@/types/store";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

export const globalStore = create<GlobalStore>()(
	devtools((set) => ({
		errorMessage: "",
		isLoading: false,
		clearErrorMessage: (): void => {
			set(
				{
					errorMessage: ""
				},
				false,
				"CLEAR_ERROR_MESSAGE"
			);
		},
		clearLocalStorage: (): void => {
			Object.values(LocalStorageKeys).forEach((value: string) => {
				localStorage.removeItem(value);
			});
		},
		enableLoading: (): void => {
			set(
				{
					isLoading: true
				},
				false,
				"ENABLE_IS_LOADING"
			);
		},
		disableLoading: (): void => {
			set(
				{
					isLoading: false
				},
				false,
				"DISABLE_IS_LOADING"
			);
		},
		setErrorMessage: (errorMessage: string): void => {
			set(
				{
					errorMessage
				},
				false,
				"SET_ERROR_MESSAGE"
			);
		}
	}))
);
