import { ApiResponse } from "@/types";

type ApiResponseType<T> = {
	message?: string;
	data?: T | null;
};

export function successApiResponse<T>({ message = "", data = null }: ApiResponseType<T> = {}): ApiResponse<T> {
	return {
		success: true,
		message: message,
		data: data
	};
}

export function errorApiResponse<T>({ message = "", data = null }: ApiResponseType<T> = {}): ApiResponse<T> {
	if (data !== null) {
		data = null;
	}

	return {
		success: false,
		message: message,
		data: data as null
	};
}
