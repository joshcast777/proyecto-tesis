import { Aperture, Camera, ImageMinus, ImageUp, SendHorizontal } from "lucide-react";
import { Button, DialogLayout } from "../ui";
import Webcam from "react-webcam";
import { useCallback, useRef } from "react";

type ImageButtonsProps = {
	disabledRemoveButton?: boolean;
	disabledSendButton?: boolean;
	uploadImage: (uploadedImageSrc: string) => void;
	removeImageFunction: () => void;
	sendButtonFunction: () => void;
};

export default function ImageButtons({ disabledRemoveButton = false, disabledSendButton = false, uploadImage, removeImageFunction, sendButtonFunction }: ImageButtonsProps): React.ReactNode {
	const webcamRef = useRef<Webcam>(null);
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

	const handleTakeShoot = useCallback(() => {
		uploadImage(webcamRef.current?.getScreenshot() as string);
	}, [webcamRef]);

	const handleSendImage = (): void => {
		sendButtonFunction();
	};

	return (
		<div className="mt-5 space-y-3 sm:flex sm:justify-between sm:gap-5 sm:space-y-0">
			<Button className="w-full shrink bg-red-800 hover:bg-red-900" onClick={handleRemoveFile} disabled={disabledRemoveButton}>
				<span className="mr-3 sm:hidden lg:inline">Eliminar imagen</span> <ImageMinus />
			</Button>

			<input className="hidden" type="file" accept="image/*" onChange={handleFileChange} ref={fileInputRef} />

			<Button className="w-full shrink bg-purple-800 hover:bg-purple-900" onClick={handleUploadFile}>
				<span className="mr-3 sm:hidden lg:inline">Subir imagen</span> <ImageUp />
			</Button>

			<DialogLayout
				content={<Webcam forceScreenshotSourceSize={true} audio={false} height={720} width={1280} ref={webcamRef} screenshotFormat="image/jpeg" />}
				triggerContent={
					<Button className="w-full shrink bg-blue-700 hover:bg-blue-800">
						<span className="mr-3 sm:hidden lg:inline">Usar cámara</span> <Camera />
					</Button>
				}
				dialogCloseContent={
					<Button className="w-full gap-3" onClick={handleTakeShoot}>
						<Aperture /> Tomar foto
					</Button>
				}
			/>

			<Button className="w-full shrink bg-green-800 hover:bg-green-900" onClick={handleSendImage} disabled={disabledSendButton}>
				<span className="mr-3 sm:hidden lg:inline">Enviar imagen</span> <SendHorizontal />
			</Button>
		</div>
	);
}
