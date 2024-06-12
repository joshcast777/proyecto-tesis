import { z } from "zod";

export const formSchema = z
	.object({
		email: z
			.string()
			.nonempty("Correo requerido")
			.regex(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, "Formato de correo incorrecto"),
		password: z.string().nonempty("Contraseña requerida")
	})
	.required();
