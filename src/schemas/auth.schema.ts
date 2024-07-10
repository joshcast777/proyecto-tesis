import { ErrorFields } from "@/constants";
import { z } from "zod";

const mailValidation = (value: string): boolean => {
	const regex1: RegExp = /^[a-zA-Z]+\.[a-zA-Z]+@ug\.edu\.ec$/;
	const email2: string = "admin@admin.com";

	return regex1.test(value) || value === email2;
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
