import { StoragePath } from "@/enums";
import { app } from "@/firebase/firebase";
import { ApiResponse, ImagesBlob, ImagesDownloadLink } from "@/types";
import { format } from "date-fns";
import { FirebaseStorage, getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

const storage: FirebaseStorage = getStorage(app);

export async function firebaseUploadImages(filesInfo: ImagesBlob[], idPatient: string): Promise<ApiResponse<ImagesDownloadLink[]>> {
	const currentDate: Date = new Date();

	const downloadLinks: ImagesDownloadLink[] = await Promise.all(
		filesInfo.map(async (fileInfo: ImagesBlob): Promise<ImagesDownloadLink> => {
			const storageRef = ref(storage, `${StoragePath.PoseEstimation}/${idPatient}/${format(currentDate, "yyyy-MM-dd_HH:mm:ss")}/${fileInfo.type === "U" ? "uploaded" : "estimated"}`);

			await uploadBytes(storageRef, fileInfo.image);

			const downloadLink: string = await getDownloadURL(storageRef);

			return {
				type: fileInfo.type,
				downloadLink: downloadLink
			};
		})
	);

	return {
		success: true,
		message: "",
		data: downloadLinks
	};
}
