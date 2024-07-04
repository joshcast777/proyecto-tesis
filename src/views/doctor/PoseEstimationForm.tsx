import { Button, Loader, Textarea } from "@/components/ui";
import { globalStore } from "@/store";
import { useState } from "react";

export default function PoseEstimationForm(): React.ReactNode {
	const [textValue, setTextValue] = useState<string>("");

	const { isLoading } = globalStore();

	return (
		<>
			{isLoading && <Loader />}

			<div className="flex min-h-screen w-full items-center justify-center overflow-y-auto bg-[url('/src/assets/images/background-patient.webp')] bg-cover bg-center bg-no-repeat p-8">
				<div className="container rounded bg-blue-300/75 p-5 text-gray-900 lg:max-w-[1024px]">
					<h2 className="text-center text-3xl font-bold uppercase xl:text-5xl">Estimación de pose</h2>

					<div className="mt-10 flex space-x-10">
						<div className="h-[600px] w-full rounded border border-black"></div>

						<div className="h-[600px] w-full rounded border border-black"></div>
					</div>

					<div className="mt-10">
						<Textarea
							onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
								setTextValue(event.target.value);
							}}
							className="h-[300px] text-base file:text-sm file:font-medium"
							value={textValue}
						/>
					</div>

					<div className="mt-5 flex items-center justify-between sm:justify-end sm:gap-5">
						<Button type="reset" variant="outline" className="w-28 lg:text-lg">
							Cancelar
						</Button>

						<Button type="submit" className="min-w-28 lg:text-lg">
							Guardar
						</Button>
					</div>
				</div>
			</div>
		</>
	);
}
