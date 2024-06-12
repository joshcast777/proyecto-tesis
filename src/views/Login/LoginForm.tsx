import { Button, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input, Loader } from "@/components/ui";
import { loginDefault } from "@/constants";
import { AuthUser } from "@/models";
import { formSchema } from "@/schemas";
import { authStore } from "@/store";
import { Login } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleX } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

function showToast(clearErrorMessage: () => void): void {
	toast.error("", {
		className: "bg-rose-400 gap-5",
		description: (
			<div>
				<h5 className="text-lg font-semibold">Error</h5>

				<p className="text-base">Credenciales no válidas</p>
			</div>
		),
		icon: <CircleX size={30} />,
		duration: 3000,
		dismissible: false,
		onDismiss: function (): void {
			clearErrorMessage();
		},
		onAutoClose: function (): void {
			clearErrorMessage();
		}
	});
}

export default function LoginForm(): React.ReactNode {
	const { errorMessage, isLoading, clearErrorMessage, signInUser, setIsLoading } = authStore();

	const form = useForm<Login>({
		resolver: zodResolver(formSchema),
		defaultValues: loginDefault
	});

	async function onSubmit(formData: AuthUser): Promise<void> {
		const authUser: AuthUser = structuredClone(formData);

		setIsLoading(true);
		await signInUser(authUser);
		setIsLoading(false);
	}

	useEffect(
		function (): void {
			if (errorMessage.includes("auth/invalid-credential")) {
				showToast(clearErrorMessage);
			}
		},
		[errorMessage]
	);

	return (
		<div className="relative flex h-screen w-full items-center justify-center bg-[url('../assets/background-login.jpg')] bg-cover bg-center bg-no-repeat">
			{isLoading && <Loader />}

			<div className="mx-5 rounded bg-blue-900/75 p-5 text-gray-100">
				<h3 className="mb-11 text-center text-5xl font-bold">Inicio de sesión</h3>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem className="text-center">
									<div className="relative">
										<FormControl>
											<Input {...field} type="email" className="border-b-1 login-input h-12 rounded-none border-transparent border-b-gray-50 bg-transparent text-center text-lg focus:outline-none" placeholder="" />
										</FormControl>

										<FormLabel className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl">Correo</FormLabel>
									</div>

									<div className="h-5">
										<FormMessage />
									</div>
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem className="text-center">
									<div className="relative">
										<FormControl>
											<Input {...field} type="password" className="border-b-1 login-input h-12 rounded-none border-transparent border-b-gray-50 bg-transparent text-center text-lg focus:outline-none" placeholder="" />
										</FormControl>

										<FormLabel className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl">Contraseña</FormLabel>
									</div>

									<div className="h-5">
										<FormMessage />
									</div>
								</FormItem>
							)}
						/>

						<Button type="submit" size={"lg"} className="h-11 w-full text-lg">
							Iniciar sesión
						</Button>
					</form>
				</Form>
			</div>
		</div>
	);
}
