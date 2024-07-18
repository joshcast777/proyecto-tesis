import { ImageButtons, ImageUpload } from "@/components/doctor";
import { FormButtons, FormTitle, Loader, Separator, Textarea } from "@/components/ui";
import { ToastIcons } from "@/constants/ui";
import { LocalStorageKeys, ToastTitles, ToastTypes } from "@/enums";
import { showToast } from "@/lib";
import { authStore, globalStore, patientStore } from "@/store";
import { AppointmentData, ImagesBlob, ImagesDownloadLink, Patient } from "@/types";
import { useEffect, useState } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";

const { VITE_POSE_ESTIMATION_API } = import.meta.env;

type PoseEstimationValue = {
	uploadedImage: string;
	estimatedImage: string;
	summary: string;
	isValid: () => boolean;
};

const defaultPoseEstimationValue: PoseEstimationValue = {
	uploadedImage: "/src/assets/images/no-image.png",
	estimatedImage: "/src/assets/images/no-image.png",
	summary: "",
	isValid(): boolean {
		return this.uploadedImage !== "" && this.estimatedImage !== "" && this.summary !== "";
	}
};

function createPoseEstimationValue(overrides: Partial<PoseEstimationValue>): PoseEstimationValue {
	return {
		...defaultPoseEstimationValue,
		...overrides
	};
}

export default function FormPoseEstimation(): React.ReactNode {
	const [buttonsDisabled, setButtonsDisabled] = useState<boolean>(false);
	const [poseEstimationValue, setPoseEstimationValue] = useState<PoseEstimationValue>(defaultPoseEstimationValue);

	const {
		currentDoctor: { data }
	} = authStore();
	const { errorMessage, isLoading, clearErrorMessage, disableLoading, enableLoading, setErrorMessage } = globalStore();
	const { currentPatient, clearCurrentPatient, clearCurrentAppointment, saveAppointment, editPatient, uploadImages } = patientStore();

	const navigate: NavigateFunction = useNavigate();

	const estimatePoseRequest = async (formData: FormData): Promise<void> => {
		const response: Response = await fetch(`${VITE_POSE_ESTIMATION_API}estimate-pose`, {
			method: "POST",
			body: formData
		});

		if (!response.ok) {
			throw new Error("Error en la respuesta del servidor.");
		}

		const estimatedImage: Blob = await response.blob();

		setPoseEstimationValue(
			(poseEstimation: PoseEstimationValue): PoseEstimationValue =>
				createPoseEstimationValue({
					...poseEstimation,
					estimatedImage: URL.createObjectURL(estimatedImage)
				})
		);

		disableLoading();
	};

	const handleEstimatePose = async (): Promise<void> => {
		enableLoading();

		const response: Response = await fetch(poseEstimationValue.uploadedImage);
		const blob: Blob = await response.blob();
		const formData = new FormData();

		formData.append("file", blob, "photo.jpg");

		await estimatePoseRequest(formData);
	};

	const uploadImagesToFirebase = async (): Promise<ImagesDownloadLink[]> => {
		const responses: Response[] = await Promise.all([fetch(poseEstimationValue.uploadedImage), fetch(poseEstimationValue.estimatedImage)]);

		const images: ImagesBlob[] = await Promise.all(
			responses.map(
				async (response: Response, index: number): Promise<ImagesBlob> => ({
					type: index === 0 ? "U" : "E",
					image: await response.blob()
				})
			)
		);

		const downloadLinks: ImagesDownloadLink[] = await uploadImages(images);

		return downloadLinks;
	};

	const saveAppointmentData = async (downloadLinks: ImagesDownloadLink[]): Promise<boolean> => {
		const appointmentData: AppointmentData = {
			date: new Date(),
			idDoctor: localStorage.getItem(LocalStorageKeys.Id)!,
			nameDoctor: data.firstName,
			summary: poseEstimationValue.summary,
			estimatedImageLink: "",
			uploadedImageLink: ""
		};

		downloadLinks.forEach(({ downloadLink, type }: ImagesDownloadLink): void => {
			if (type === "E") {
				appointmentData.estimatedImageLink = downloadLink;
			} else {
				appointmentData.uploadedImageLink = downloadLink;
			}
		});

		const response: string = await saveAppointment(appointmentData);

		if (response !== "") {
			setErrorMessage(response);

			disableLoading();
			setButtonsDisabled(false);

			return false;
		}

		return true;
	};

	const updatePatientData = async (): Promise<boolean> => {
		const newPatient: Patient = structuredClone({
			id: currentPatient.id,
			data: {
				...currentPatient.data,
				lastAppointmentDate: new Date()
			}
		});

		const response: string = await editPatient(newPatient);

		if (response !== "") {
			setErrorMessage(response);

			disableLoading();
			setButtonsDisabled(false);

			return false;
		}

		return true;
	};

	const handleClickSubmit = async (): Promise<void> => {
		enableLoading();
		setButtonsDisabled(true);

		const downloadLinks: ImagesDownloadLink[] = await uploadImagesToFirebase();

		const successAppointmentSaved: boolean = await saveAppointmentData(downloadLinks);

		if (!successAppointmentSaved) {
			return;
		}

		const successPatientUpdated: boolean = await updatePatientData();

		if (!successPatientUpdated) {
			return;
		}

		disableLoading();

		showToast({
			type: ToastTypes.Success,
			title: ToastTitles.Success,
			message: "Datos guardados, será redireccionado",
			icon: ToastIcons.Success,
			onDismissAndOnAutoCloseFunctions: (): void => {
				navigate("/doctor/dashboard", {
					replace: true
				});
			}
		});
	};

	useEffect((): (() => void) => {
		if (errorMessage !== "") {
			showToast({
				type: ToastTypes.Error,
				title: ToastTitles.Error,
				message: errorMessage,
				icon: ToastIcons.Error,
				onDismissAndOnAutoCloseFunctions: clearErrorMessage
			});
		}

		return (): void => {
			clearCurrentPatient();
			clearCurrentAppointment();
		};
	}, [errorMessage]);

	return (
		<>
			{isLoading && <Loader />}

			<div className="flex min-h-screen w-full items-center justify-center overflow-y-auto bg-[url('/src/assets/images/background-patient.webp')] bg-cover bg-center bg-no-repeat p-8">
				<div className="container rounded bg-blue-300/75 p-5 text-gray-900 lg:max-w-[1024px]">
					<FormTitle>Estimación de pose</FormTitle>

					<div className="mt-10 space-y-10 md:flex md:space-x-5 md:space-y-0">
						<div className="md:w-1/2">
							<ImageUpload uploadedImageSrc={poseEstimationValue.uploadedImage} />

							<ImageButtons
								disabledRemoveButton={poseEstimationValue.uploadedImage.includes("no-image")}
								disabledSendButton={poseEstimationValue.uploadedImage.includes("no-image")}
								uploadImage={(uploadedImageSrc: string): void => {
									setPoseEstimationValue(
										(poseEstimation: PoseEstimationValue): PoseEstimationValue =>
											createPoseEstimationValue({
												...poseEstimation,
												uploadedImage: uploadedImageSrc
											})
									);
								}}
								sendButtonFunction={handleEstimatePose}
								removeImageFunction={(): void => {
									setPoseEstimationValue(
										(poseEstimation: PoseEstimationValue): PoseEstimationValue =>
											createPoseEstimationValue({
												...poseEstimation,
												uploadedImage: "/src/assets/images/no-image.png"
											})
									);
								}}
							/>
						</div>

						<Separator className="md:hidden" />

						<div className="flex aspect-[9/14] w-full items-center justify-center rounded border border-gray-500 md:w-1/2">
							<img className="cover h-full w-full rounded object-cover" src={poseEstimationValue.estimatedImage} alt="Pose estimated" />
						</div>
					</div>

					<div className="mt-10">
						<Textarea
							onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
								setPoseEstimationValue(
									(poseEstimation: PoseEstimationValue): PoseEstimationValue =>
										createPoseEstimationValue({
											...poseEstimation,
											summary: event.target.value
										})
								);
							}}
							className="h-[300px] text-base file:text-sm file:font-medium"
							value={poseEstimationValue.summary}
						/>
					</div>

					<FormButtons
						disabled={buttonsDisabled}
						disabledSaveButton={poseEstimationValue.estimatedImage.includes("no-image") || poseEstimationValue.summary === ""}
						resetButtonLabel="Cancelar"
						resetFunction={(): void => {
							clearCurrentPatient();
							clearCurrentAppointment();
						}}
						saveFunction={handleClickSubmit}
						saveButtonType="button"
						resetRoute="/doctor/dashboard"
						saveButtonLabel="Guardar"
						waitingButtonLabel="Por favor, espere..."
					/>
				</div>
			</div>
		</>
	);
}
