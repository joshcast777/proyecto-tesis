/* eslint-disable @typescript-eslint/no-explicit-any */

import { StoragePath } from "@/enums";
import { errorApiResponse, successApiResponse } from "@/lib";
import { ApiResponse, ImagesBlob, ImagesDownloadLink } from "@/types";
import { format } from "date-fns";

const { VITE_CLOUDINARY_CLOUD_NAME, VITE_CLOUDINARY_UPLOAD_PRESSET } = import.meta.env;

export async function cloudinaryUploadImages(filesInfo: ImagesBlob[], idPatient: string, type: string): Promise<ApiResponse<ImagesDownloadLink[]>> {
	try {
		const currentDate: Date = new Date();

		const downloadLinks: ImagesDownloadLink[] = await Promise.all(
			filesInfo.map(async (fileInfo: ImagesBlob): Promise<ImagesDownloadLink> => {
				const formData = new FormData();

				formData.append("file", fileInfo.image);
				formData.append("upload_preset", VITE_CLOUDINARY_UPLOAD_PRESSET);
				formData.append("folder", `${StoragePath.PoseEstimation}/${idPatient}/${format(currentDate, "yyyy-MM-dd_HH:mm:ss")}/`);
				formData.append("public_id", fileInfo.type === "U" ? "uploaded" : "estimated");

				try {
					const response = await fetch(`https://api.cloudinary.com/v1_1/${VITE_CLOUDINARY_CLOUD_NAME}/${type}/upload`, {
						method: "POST",
						body: formData
					});

					const data = await response.json();

					if (response.ok) {
						return {
							type: fileInfo.type,
							downloadLink: data.secure_url
						};
					} else {
						throw new Error(data.error.message);
					}
				} catch (error) {
					console.error("Error al subir la imagen:", error);

					return {
						type: "E",
						downloadLink: ""
					};
				}
			})
		);

		return successApiResponse<ImagesDownloadLink[]>({
			data: downloadLinks
		});
	} catch (error: any) {
		console.error(error);

		return errorApiResponse<ImagesDownloadLink[]>({
			message: error.code
		});
	}
}
