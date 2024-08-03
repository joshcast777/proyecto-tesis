import { Aperture, ImageMinus, ImageUp, SendHorizontal, SwitchCamera } from "lucide-react";
import { Button, DialogLayout } from "../ui";
import { Camera, CameraType } from "react-camera-pro";
import React, { useRef, useState } from "react";

type ImageButtonsProps = {
	disabledRemoveButton?: boolean;
	disabledSendButton?: boolean;
	uploadImage: (uploadedImageSrc: string) => void;
	removeImageFunction: () => void;
	sendButtonFunction: () => void;
};

export default function ImageButtons({ disabledRemoveButton = false, disabledSendButton = false, uploadImage, removeImageFunction, sendButtonFunction }: ImageButtonsProps): React.ReactNode {
	const [numberOfCameras, setNumberOfCameras] = useState<number>(0);

	const cameraRef = useRef<CameraType>(null);
	const fileInputRef = useRef<HTMLInputElement | null>(null);

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
		const file: File | undefined = event.target.files?.[0];

		if (Boolean(file)) {
			const reader = new FileReader();

			reader.onloadend = (): void => {
				uploadImage(reader.result as string);
			};

			reader.readAsDataURL(file!);
		}
	};

	const handleUploadFile = (): void => {
		fileInputRef.current!.click();
	};

	const handleRemoveFile = (): void => {
		fileInputRef.current!.value = "";

		removeImageFunction();
	};

	const handleTakeShoot = async (): Promise<void> => {
		uploadImage(cameraRef.current?.takePhoto() as string);
	};

	const handleSendImage = (): void => {
		sendButtonFunction();
	};

	return (
		<div className="mt-5 flex justify-between gap-5">
			<Button className="h-16 w-full shrink bg-red-800 hover:bg-red-900" onClick={handleRemoveFile} disabled={disabledRemoveButton}>
				<ImageMinus />
			</Button>

			<input className="hidden" type="file" accept="image/*" onChange={handleFileChange} ref={fileInputRef} />

			<Button className="h-16 w-full shrink bg-purple-800 hover:bg-purple-900" onClick={handleUploadFile}>
				<ImageUp />
			</Button>

			<DialogLayout
				content={
					<div>
						<Camera
							ref={cameraRef}
							aspectRatio={9 / 14}
							numberOfCamerasCallback={setNumberOfCameras}
							facingMode="environment"
							errorMessages={{
								noCameraAccessible: "No camera device accessible. Please connect your camera or try a different browser.",
								permissionDenied: "Permission denied. Please refresh and give camera permission.",
								switchCamera: "It is not possible to switch camera to different one because there is only one video device accessible.",
								canvas: "Canvas is not supported."
							}}
						/>

						<Button
							hidden={numberOfCameras <= 1}
							className="mt-3 w-full gap-3 bg-blue-700 hover:bg-blue-800"
							onClick={(): void => {
								cameraRef.current?.switchCamera();
							}}
						>
							<SwitchCamera /> Cambiar cámara
						</Button>
					</div>
				}
				triggerContent={
					<Button className="h-16 w-full shrink bg-blue-700 hover:bg-blue-800">
						<Aperture />
					</Button>
				}
				dialogCloseContent={
					<Button
						className="w-full gap-3"
						onClick={async (): Promise<void> => {
							await handleTakeShoot();
						}}
					>
						<Aperture /> Tomar foto
					</Button>
				}
			/>

			<Button className="h-16 w-full shrink bg-green-800 hover:bg-green-900" onClick={handleSendImage} disabled={disabledSendButton}>
				<SendHorizontal />
			</Button>
		</div>
	);
}
