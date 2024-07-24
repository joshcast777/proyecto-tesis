import { ErrorFields } from "@/constants";
import { z } from "zod";

const mailValidation = (value: string): boolean => {
	const emailPattern: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

	return emailPattern.test(value);
};

export const authSchema = z
	.object({
		email: z
			.string({
				required_error: "Camp requerido"
			})
			.refine(mailValidation, {
				message: "Formato de correo incorrecto"
			}),
		password: z
			.string({
				required_error: ErrorFields.Required
			})
			.min(1, ErrorFields.Required)
	})
	.required();
