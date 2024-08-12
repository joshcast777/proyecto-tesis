import { ImageMinus, ImageUp, SendHorizontal } from "lucide-react";
import { useRef } from "react";
import { Button } from "../ui";

type ImageButtonsProps = {
	disabledRemoveButton?: boolean;
	disabledSendButton?: boolean;
	uploadImage: (uploadedImageSrc: string) => void;
	removeImageFunction: () => void;
	sendButtonFunction: () => void;
};

export default function VideoButtons({ disabledRemoveButton = false, disabledSendButton = false, uploadImage, removeImageFunction, sendButtonFunction }: ImageButtonsProps): React.ReactNode {
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

	// const handleTakeShoot = useCallback(() => {
	// 	uploadImage(webcamRef.current?.getScreenshot() as string);
	// }, [webcamRef]);

	const handleSendImage = (): void => {
		sendButtonFunction();
	};

	return (
		<div className="mt-5 space-y-3 sm:flex sm:justify-between sm:gap-5 sm:space-y-0">
			<Button className="w-full shrink bg-red-800 hover:bg-red-900" onClick={handleRemoveFile} disabled={disabledRemoveButton}>
				<span className="mr-3 sm:hidden lg:inline">Eliminar vídeo</span> <ImageMinus />
			</Button>

			<input className="hidden" type="file" accept="video/*" onChange={handleFileChange} ref={fileInputRef} />

			<Button className="w-full shrink bg-purple-800 hover:bg-purple-900" onClick={handleUploadFile}>
				<span className="mr-3 sm:hidden lg:inline">Subir vídeo</span> <ImageUp />
			</Button>

			<Button className="w-full shrink bg-green-800 hover:bg-green-900" onClick={handleSendImage} disabled={disabledSendButton}>
				<span className="mr-3 sm:hidden lg:inline">Enviar vídeo</span> <SendHorizontal />
			</Button>
		</div>
	);
}
