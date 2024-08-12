import { ImageFormPoseEstimation, VideoFormPoseEstimation } from "@/components/doctor";
import { FormTitle, TabsLayout } from "@/components/ui";
// import { PoseEstimationValue } from "@/types";

// const { VITE_POSE_ESTIMATION_API } = import.meta.env;

// type ImageData = {
// 	angles: {
// 		elbow: {
// 			right: number;
// 			left: number;
// 		};
// 		shoulder: {
// 			right: number;
// 			left: number;
// 		};
// 		wrist: {
// 			right: number;
// 			left: number;
// 		};
// 	};
// 	image: string;
// };

// const defaultPoseEstimationValue: PoseEstimationValue = {
// 	uploadedImage: "",
// 	estimatedImage: "",
// 	summary: "",
// 	isValid(): boolean {
// 		return this.uploadedImage !== "" && this.estimatedImage !== "" && this.summary !== "";
// 	}
// };

// function createPoseEstimationValue(overrides: Partial<PoseEstimationValue>): PoseEstimationValue {
// 	return {
// 		...defaultPoseEstimationValue,
// 		...overrides
// 	};
// }

export default function FormPoseEstimation(): React.ReactNode {
	return (
		<div className="flex min-h-screen w-full items-center justify-center overflow-y-auto bg-[url('/src/assets/images/background-patient.webp')] bg-cover bg-center bg-no-repeat p-8">
			<div className="container rounded bg-blue-300/75 p-5 text-gray-900 lg:max-w-[1024px]">
				<FormTitle>Estimación de pose</FormTitle>

				<TabsLayout
					defaultValue="image"
					tabs={[
						{
							value: "image",
							tabTrigger: "Imagen",
							tabContent: <ImageFormPoseEstimation />
						},
						{
							value: "video",
							tabTrigger: "Vídeo",
							tabContent: <VideoFormPoseEstimation />
						}
					]}
				/>
			</div>
		</div>
	);

	// const [isImageEstimated, setIsImageEstimated] = useState<boolean>(false);
	// const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
	// const [poseEstimationValue, setPoseEstimationValue] = useState<PoseEstimationValue>(defaultPoseEstimationValue);
	// const [angles, setAngles] = useState<Angles>(DefaultValues.Angles);

	// const buttonRef = useRef<HTMLButtonElement>(null);

	// const {
	// 	currentUser: { data }
	// } = authStore();
	// const { errorMessage, isLoading, clearErrorMessage, disableLoading, enableLoading, setErrorMessage } = globalStore();
	// const { currentAppointment, currentPatient, clearCurrentPatient, clearCurrentAppointment, saveAppointment, editPatient, uploadImages } = patientStore();

	// const navigate: NavigateFunction = useNavigate();

	// const estimatePoseRequest = async (formData: FormData): Promise<void> => {
	// 	const response: Response = await fetch(`${VITE_POSE_ESTIMATION_API}/estimate-pose-image`, {
	// 		method: "POST",
	// 		body: formData
	// 	});

	// 	if (!response.ok) {
	// 		throw new Error("Error en la respuesta del servidor.");
	// 	}

	// 	const data: ImageData = await response.json();

	// 	setAngles(data.angles);

	// 	setPoseEstimationValue(
	// 		(poseEstimation: PoseEstimationValue): PoseEstimationValue =>
	// 			createPoseEstimationValue({
	// 				...poseEstimation,
	// 				estimatedImage: `data:image/png;base64,${data.image}`
	// 			})
	// 	);

	// 	setIsImageEstimated(true);
	// 	disableLoading();
	// };

	// const handleEstimatePose = async (): Promise<void> => {
	// 	enableLoading();

	// 	const response: Response = await fetch(poseEstimationValue.uploadedImage);
	// 	const blob: Blob = await response.blob();
	// 	const formData = new FormData();

	// 	formData.append("file", blob, "photo.jpg");

	// 	await estimatePoseRequest(formData);
	// };

	// const uploadImagesToCloud = async (): Promise<ImagesDownloadLink[]> => {
	// 	const responses: Response[] = await Promise.all([fetch(poseEstimationValue.uploadedImage), fetch(poseEstimationValue.estimatedImage)]);

	// 	const images: ImagesBlob[] = await Promise.all(
	// 		responses.map(
	// 			async (response: Response, index: number): Promise<ImagesBlob> => ({
	// 				type: index === 0 ? "U" : "E",
	// 				image: await response.blob()
	// 			})
	// 		)
	// 	);

	// 	const downloadLinks: ImagesDownloadLink[] = await uploadImages(images);

	// 	return downloadLinks;
	// };

	// const saveAppointmentData = async (downloadLinks: ImagesDownloadLink[]): Promise<boolean> => {
	// 	const appointmentData: AppointmentData = {
	// 		date: new Date(),
	// 		idDoctor: localStorage.getItem(LocalStorageKeys.Id)!,
	// 		nameDoctor: `${data.firstName} ${data.lastName}`,
	// 		summary: poseEstimationValue.summary,
	// 		angles,
	// 		estimatedImageLink: "",
	// 		uploadedImageLink: ""
	// 	};

	// 	downloadLinks.forEach(({ downloadLink, type }: ImagesDownloadLink): void => {
	// 		if (type === "E") {
	// 			appointmentData.estimatedImageLink = downloadLink;
	// 		} else {
	// 			appointmentData.uploadedImageLink = downloadLink;
	// 		}
	// 	});

	// 	const response: string = await saveAppointment(appointmentData);

	// 	if (response !== "") {
	// 		setErrorMessage(response);

	// 		disableLoading();

	// 		return false;
	// 	}

	// 	return true;
	// };

	// const updatePatientData = async (): Promise<boolean> => {
	// 	const newPatient: Patient = structuredClone({
	// 		id: currentPatient.id,
	// 		data: {
	// 			...currentPatient.data,
	// 			lastAppointmentDate: new Date()
	// 		}
	// 	});

	// 	const response: string = await editPatient(newPatient);

	// 	if (response !== "") {
	// 		setErrorMessage(response);

	// 		disableLoading();

	// 		return false;
	// 	}

	// 	return true;
	// };

	// const handleAngleChange = (event: React.ChangeEvent<HTMLInputElement>, angleKey: string): void => {
	// 	const keys: string[] = angleKey.split("-");

	// 	setAngles(
	// 		structuredClone({
	// 			...angles,
	// 			[keys[1]]: {
	// 				[keys[0]]: event.target.value
	// 			}
	// 		})
	// 	);
	// };

	// const handleClickSubmit = async (): Promise<void> => {
	// 	enableLoading();

	// 	const downloadLinks: ImagesDownloadLink[] = await uploadImagesToCloud();

	// 	const successAppointmentSaved: boolean = await saveAppointmentData(downloadLinks);

	// 	if (!successAppointmentSaved) {
	// 		return;
	// 	}

	// 	buttonRef.current?.click();

	// 	const successPatientUpdated: boolean = await updatePatientData();

	// 	if (!successPatientUpdated) {
	// 		return;
	// 	}

	// 	disableLoading();
	// 	setIsSubmitted(true);

	// 	showToast({
	// 		type: ToastTypes.Success,
	// 		title: ToastTitles.Success,
	// 		message: "Datos guardados",
	// 		icon: ToastIcons.Success
	// 	});
	// };

	// useEffect((): void => {
	// 	if (errorMessage !== "") {
	// 		showToast({
	// 			type: ToastTypes.Error,
	// 			title: ToastTitles.Error,
	// 			message: errorMessage,
	// 			icon: ToastIcons.Error,
	// 			onDismissAndOnAutoCloseFunctions: clearErrorMessage
	// 		});
	// 	}
	// }, [errorMessage]);

	// useEffect((): (() => void) => {
	// 	return (): void => {
	// 		window.removeEventListener("beforeunload", () => {
	// 			clearCurrentPatient();
	// 			clearCurrentAppointment();
	// 		});
	// 	};
	// }, []);

	// if (isLoading) {
	// 	return <Loader />;
	// }

	// return (
	// 	<div className="flex min-h-screen w-full items-center justify-center overflow-y-auto bg-[url('/src/assets/images/background-patient.webp')] bg-cover bg-center bg-no-repeat p-8">
	// 		<div className="container rounded bg-blue-300/75 p-5 text-gray-900 lg:max-w-[1024px]">
	// 			<FormTitle>Estimación de pose</FormTitle>

	// 			<div className="mt-10 space-y-10 md:flex md:space-x-5 md:space-y-0">
	// 				<div className="flex aspect-[9/14] items-center justify-center rounded border border-gray-500 md:w-1/2">
	// 					{poseEstimationValue.uploadedImage !== "" && (
	// 						<img
	// 							className={cn("h-full w-full rounded", {
	// 								"object-contain": poseEstimationValue.uploadedImage !== ""
	// 							})}
	// 							src={poseEstimationValue.uploadedImage}
	// 							alt="Uploaded image"
	// 						/>
	// 					)}
	// 				</div>
	// 				{/* <div className="">
	// 				</div> */}

	// 				<div className="flex aspect-[9/14] w-full items-center justify-center rounded border border-gray-500 md:w-1/2">
	// 					{poseEstimationValue.estimatedImage !== "" && (
	// 						<img
	// 							className={cn("cover h-full w-full rounded", {
	// 								"object-contain": poseEstimationValue.estimatedImage !== ""
	// 							})}
	// 							src={poseEstimationValue.estimatedImage}
	// 							alt="Pose estimated"
	// 						/>
	// 					)}
	// 				</div>
	// 			</div>

	// 			<ImageButtons
	// 				disabledRemoveButton={poseEstimationValue.uploadedImage === ""}
	// 				disabledSendButton={poseEstimationValue.uploadedImage === ""}
	// 				uploadImage={(uploadedImageSrc: string): void => {
	// 					setPoseEstimationValue(
	// 						(poseEstimation: PoseEstimationValue): PoseEstimationValue =>
	// 							createPoseEstimationValue({
	// 								...poseEstimation,
	// 								uploadedImage: uploadedImageSrc
	// 							})
	// 					);
	// 				}}
	// 				sendButtonFunction={handleEstimatePose}
	// 				removeImageFunction={(): void => {
	// 					setPoseEstimationValue(
	// 						(poseEstimation: PoseEstimationValue): PoseEstimationValue =>
	// 							createPoseEstimationValue({
	// 								...poseEstimation,
	// 								uploadedImage: ""
	// 							})
	// 					);
	// 				}}
	// 			/>

	// 			<div className="mt-10 space-y-5">
	// 				<Label className="text-2xl font-medium">Ángulos</Label>

	// 				<div className="space-y-3 lg:flex lg:gap-3 lg:space-y-0">
	// 					<div className="space-y-2 rounded border border-gray-300 p-2">
	// 						<Label className="text-center text-xl">Hombro</Label>

	// 						<div className="space-y-2 sm:flex sm:gap-5 sm:space-y-0">
	// 							<div className="w-full space-y-1">
	// 								<Label className="text-lg">Derecho</Label>

	// 								<Input
	// 									type="text"
	// 									className="text-base placeholder:text-base disabled:text-gray-900 disabled:opacity-75 md:h-12"
	// 									placeholder="0000000000"
	// 									value={angles.shoulder.right}
	// 									disabled={!isImageEstimated}
	// 									onChange={(event): void => {
	// 										handleAngleChange(event, "right-shoulder");
	// 									}}
	// 								/>
	// 							</div>

	// 							<div className="w-full space-y-1">
	// 								<Label className="text-lg">Izquierdo</Label>

	// 								<Input
	// 									type="text"
	// 									className="text-base placeholder:text-base disabled:text-gray-900 disabled:opacity-75 md:h-12"
	// 									placeholder="0000000000"
	// 									value={angles.shoulder.left}
	// 									disabled={!isImageEstimated}
	// 									onChange={(event): void => {
	// 										handleAngleChange(event, "left-shoulder");
	// 									}}
	// 								/>
	// 							</div>
	// 						</div>
	// 					</div>

	// 					<div className="space-y-2 rounded border border-gray-300 p-2">
	// 						<Label className="text-center text-xl">Codo</Label>

	// 						<div className="space-y-2 sm:flex sm:gap-5 sm:space-y-0">
	// 							<div className="w-full space-y-1">
	// 								<Label className="text-lg">Derecho</Label>

	// 								<Input
	// 									type="text"
	// 									className="text-base placeholder:text-base disabled:text-gray-900 disabled:opacity-75 md:h-12"
	// 									placeholder="0000000000"
	// 									value={angles.elbow.right}
	// 									disabled={!isImageEstimated}
	// 									onChange={(event): void => {
	// 										handleAngleChange(event, "right-elbow");
	// 									}}
	// 								/>
	// 							</div>

	// 							<div className="w-full space-y-1">
	// 								<Label className="text-lg">Izquierdo</Label>

	// 								<Input
	// 									type="text"
	// 									className="text-base placeholder:text-base disabled:text-gray-900 disabled:opacity-75 md:h-12"
	// 									placeholder="0000000000"
	// 									value={angles.elbow.left}
	// 									disabled={!isImageEstimated}
	// 									onChange={(event): void => {
	// 										handleAngleChange(event, "left-elbow");
	// 									}}
	// 								/>
	// 							</div>
	// 						</div>
	// 					</div>

	// 					<div className="space-y-2 rounded border border-gray-300 p-2">
	// 						<Label className="text-center text-xl">Muñeca</Label>

	// 						<div className="space-y-2 sm:flex sm:gap-5 sm:space-y-0">
	// 							<div className="w-full space-y-1">
	// 								<Label className="text-lg">Derecho</Label>

	// 								<Input
	// 									type="text"
	// 									className="text-base placeholder:text-base disabled:text-gray-900 disabled:opacity-75 md:h-12"
	// 									placeholder="0000000000"
	// 									value={angles.wrist.right}
	// 									disabled={!isImageEstimated}
	// 									onChange={(event): void => {
	// 										handleAngleChange(event, "right-wrist");
	// 									}}
	// 								/>
	// 							</div>

	// 							<div className="w-full space-y-1">
	// 								<Label className="text-lg">Izquierdo</Label>

	// 								<Input
	// 									type="text"
	// 									className="text-base placeholder:text-base disabled:text-gray-900 disabled:opacity-75 md:h-12"
	// 									placeholder="0000000000"
	// 									value={angles.wrist.left}
	// 									disabled={!isImageEstimated}
	// 									onChange={(event): void => {
	// 										handleAngleChange(event, "left-wrist");
	// 									}}
	// 								/>
	// 							</div>
	// 						</div>
	// 					</div>
	// 				</div>

	// 				<div className="space-y-2">
	// 					<Label className="text-center text-xl">Comentarios</Label>

	// 					<Textarea
	// 						onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
	// 							setPoseEstimationValue(
	// 								(poseEstimation: PoseEstimationValue): PoseEstimationValue =>
	// 									createPoseEstimationValue({
	// 										...poseEstimation,
	// 										summary: event.target.value
	// 									})
	// 							);
	// 						}}
	// 						className="h-[300px] text-base file:text-sm file:font-medium"
	// 						value={poseEstimationValue.summary}
	// 					/>
	// 				</div>
	// 			</div>

	// 			<div
	// 				className={cn("sm:flex sm:items-center", {
	// 					"sm:justify-between": isSubmitted,
	// 					"sm:justify-end": !isSubmitted
	// 				})}
	// 			>
	// 				<PDFDownloadLink
	// 					document={<PatientPdf patientData={currentPatient.data} appointmentData={currentAppointment.data} />}
	// 					fileName={`paciente-${format(new Date(), "dd-MM-yyyy")}`}
	// 					className={cn({
	// 						flex: isSubmitted,
	// 						hidden: !isSubmitted
	// 					})}
	// 				>
	// 					<Button
	// 						className="mt-5 w-full bg-purple-700 hover:bg-purple-800 sm:w-auto lg:text-lg"
	// 						onClick={(): void => {
	// 							setTimeout(() => {
	// 								clearCurrentPatient();
	// 								clearCurrentAppointment();

	// 								navigate("/doctor/dashboard");
	// 							}, 3000);
	// 						}}
	// 					>
	// 						<FileText className="mr-3" /> Imprimir cita
	// 					</Button>
	// 				</PDFDownloadLink>

	// 				<div className="mt-5 flex items-center justify-between sm:justify-end sm:gap-5">
	// 					<Button
	// 						type="reset"
	// 						variant="outline"
	// 						className="w-28 border-blue-700 text-blue-700 hover:bg-blue-50 hover:text-blue-700 lg:text-lg"
	// 						onClick={(): void => {
	// 							clearCurrentPatient();
	// 							clearCurrentAppointment();

	// 							navigate("/doctor/dashboard");
	// 						}}
	// 					>
	// 						Volver
	// 					</Button>

	// 					{isSubmitted ? (
	// 						<Button
	// 							type="button"
	// 							className="min-w-28 bg-blue-700 hover:bg-blue-800 lg:text-lg"
	// 							onClick={(): void => {
	// 								clearCurrentPatient();
	// 								clearCurrentAppointment();

	// 								navigate("/doctor/dashboard");
	// 							}}
	// 						>
	// 							Finalizar
	// 						</Button>
	// 					) : (
	// 						<Button type="button" disabled={poseEstimationValue.estimatedImage === "" || poseEstimationValue.summary === ""} className="min-w-28 bg-blue-700 hover:bg-blue-800 lg:text-lg" onClick={handleClickSubmit}>
	// 							Guardar
	// 						</Button>
	// 					)}
	// 				</div>
	// 			</div>
	// 		</div>
	// 	</div>
	// );
}
