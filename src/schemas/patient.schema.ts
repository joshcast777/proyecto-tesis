import { ErrorFields } from "@/constants";
import { Sex } from "@/enums";
import { z } from "zod";

export const patientSchema = z
	.object({
		dni: z
			.string({
				required_error: ErrorFields.Required
			})
			.regex(/^\d{10}$/, "La cédula debe ser de 10 dígitos"),
		firstName: z
			.string({
				required_error: ErrorFields.Required
			})
			.min(1, ErrorFields.Required),
		lastName: z
			.string({
				required_error: ErrorFields.Required
			})
			.min(1, ErrorFields.Required),
		birthDate: z
			.string({
				required_error: ErrorFields.Required
			})
			.min(1, ErrorFields.Required)
			.regex(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/, "Formato de fecha incorrecto"),
		sex: z.nativeEnum(Sex),
		locationAddress: z
			.string({
				required_error: ErrorFields.Required
			})
			.min(1, ErrorFields.Required),
		phone: z
			.string({
				required_error: ErrorFields.Required
			})
			.regex(/^\d{10}$/, "El celular debe ser de 10 dígitos"),
		email: z
			.string({
				required_error: ErrorFields.Required
			})
			.regex(/^[\w.%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/, "Formato de correo incorrecto")
	})
	.required();
