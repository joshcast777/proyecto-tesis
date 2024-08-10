import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import PoseEstimationRoute from "./routes/PoseEstimationRoute";
import "./styles/styles.scss";

export default function App(): React.ReactNode {
	return (
		<BrowserRouter>
			<PoseEstimationRoute />

			<Toaster expand={true} />
		</BrowserRouter>
	);
}

// import { useRef, useState } from "react";

// export default function App(): React.ReactNode {
// 	const fileInputRef = useRef<HTMLInputElement>(null);
// 	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
// 	const [fileType, setFileType] = useState<"image" | "video" | null>(null);

// 	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
// 		const file = event.target.files?.[0];

// 		if (file) {
// 			const fileType = file.type.startsWith("image/") ? "image" : file.type.startsWith("video/") ? "video" : null;
// 			if (fileType) {
// 				const reader = new FileReader();
// 				reader.onloadend = (): void => {
// 					setPreviewUrl(reader.result as string);
// 					setFileType(fileType);
// 				};
// 				reader.readAsDataURL(file);
// 			} else {
// 				console.error("Tipo de archivo no permitido");
// 				setPreviewUrl(null);
// 				setFileType(null);
// 			}
// 		}
// 	};

// 	return (
// 		<div>
// 			<input className="hidden" type="file" accept="image/*,video/*" onChange={handleFileChange} ref={fileInputRef} />
// 			<button onClick={() => fileInputRef.current?.click()}>Seleccionar Archivo</button>
// 			{previewUrl}
// 			<div>
// 				{previewUrl !== null && fileType === "image" && <img src={previewUrl} alt="Vista previa" style={{ maxWidth: "100%", maxHeight: "400px" }} />}
// 				{previewUrl !== null && fileType === "video" && <video controls src={previewUrl} style={{ maxWidth: "100%", maxHeight: "400px" }} />}
// 			</div>
// 		</div>
// 	);
// }
