import { Aperture, ImageUp, SendHorizontal } from "lucide-react";
import { Button, DialogLayout } from "../ui";
import { useRef, useState } from "react";
import { cn } from "@/lib";
import { Camera, CameraType } from "react-camera-pro";

export default function ImageUpload(): React.ReactNode {
	const [image, setImage] = useState<string | ArrayBuffer | null>(null);

	const fileInputRef = useRef<HTMLInputElement | null>(null);
	const cameraRef = useRef<CameraType>(null);

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
		const file: File | undefined = event.target.files?.[0];

		if (Boolean(file)) {
			const reader = new FileReader();

			reader.onloadend = (): void => {
				setImage(reader.result);
			};

			reader.readAsDataURL(file!);
		}
	};

	const uploadFile = (): void => {
		fileInputRef.current?.click();
	};

	return (
		<div className="w-full">
			<div className="flex aspect-[9/16] items-center justify-center rounded border border-gray-500">
				<img
					className={cn("aspect-[9/6] h-full w-full rounded", {
						"object-contain": Boolean(image),
						"object-cover": !Boolean(image)
					})}
					src={Boolean(image) ? (image as string) : "/src/assets/images/no-image.png"}
					alt="Selected"
				/>
			</div>

			<input className="hidden" type="file" accept="image/*" onChange={handleFileChange} ref={fileInputRef} />

			<div className="mt-5 flex justify-between gap-5">
				<Button className="h-16 w-full shrink bg-purple-800" onClick={uploadFile}>
					<ImageUp />
				</Button>

				<DialogLayout
					content={(): React.ReactNode => (
						<div>
							<Camera
								ref={cameraRef}
								aspectRatio={9 / 16}
								errorMessages={{
									noCameraAccessible: "No camera device accessible. Please connect your camera or try a different browser.",
									permissionDenied: "Permission denied. Please refresh and give camera permission.",
									switchCamera: "It is not possible to switch camera to different one because there is only one video device accessible.",
									canvas: "Canvas is not supported."
								}}
							/>
						</div>
					)}
					triggerContent={(): React.ReactNode => (
						<Button className="h-16 w-full shrink bg-blue-700">
							<Aperture />
						</Button>
					)}
					dialogCloseContent={(): React.ReactNode => (
						<Button
							className="w-full gap-3"
							onClick={(): void => {
								setImage(cameraRef.current?.takePhoto() as string);
							}}
						>
							<Aperture /> Tomar foto
						</Button>
					)}
				/>

				<Button className="h-16 w-full shrink bg-green-800">
					<SendHorizontal />
				</Button>
			</div>
		</div>
	);
}
