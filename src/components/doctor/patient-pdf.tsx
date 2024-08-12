import { UgLogo } from "@/assets/images";
import { Sex } from "@/enums";
import { Angles, AppointmentData, PatientData } from "@/types";
import { Document, Image, Page, Styles, StyleSheet, Text, View } from "@react-pdf/renderer";
import { differenceInYears, format } from "date-fns";

const styles: Styles = StyleSheet.create({
	page: {
		paddingHorizontal: "25px",
		paddingVertical: "15px",
		flexDirection: "column",
		gap: "6px"
	},
	boxView: {
		padding: "10px",
		borderRadius: "10px",
		border: "1px solid black"
	},
	separator: {
		borderTop: "1px solid black",
		marginVertical: "10px"
	},
	header: {
		height: "10vh",
		flexDirection: "row",
		justifyContent: "space-between"
	},
	headerTitle: {
		textTransform: "uppercase",
		fontSize: "20px",
		fontWeight: "extrabold"
	},
	headerDate: {
		fontSize: "10px"
	},
	title: {
		fontWeight: "black",
		textAlign: "center",
		marginVertical: "10px"
	},
	dataView: {
		flexDirection: "row",
		gap: "5px"
	},
	label: {
		fontWeight: 800,
		fontSize: "14px"
	},
	data: {
		fontSize: "14px"
	},
	rowView: {
		flexDirection: "row",
		marginVertical: "10px"
	},
	dniStyle: {
		width: "40%"
	},
	ageStyle: {
		width: "30%"
	},
	phoneStyle: {
		width: "30%",
		justifyContent: "flex-end"
	},
	firstNameStyle: {
		width: "40%"
	},
	lastNameStyle: {
		width: "40%"
	},
	sexStyle: {
		width: "20%",
		justifyContent: "flex-end"
	},
	locationAddressStyle: {
		width: "100%"
	},
	doctorNameStyle: {
		width: "70%"
	},
	lastAppointmentDateStyle: {
		width: "30%",
		justifyContent: "flex-end"
	},
	summaryStyle: {
		flexDirection: "column",
		gap: "5px"
	},
	userImage: {
		maxHeight: "700px",
		maxWidth: "100%"
	},
	jointAngles: {
		flexDirection: "row",
		gap: "5px"
	},
	jointAngle: {
		width: "100%"
	}
});

type PatientPdfProps = {
	appointmentData: AppointmentData;
	patientData: PatientData;
};

type BoxViewProps = {
	children?: React.ReactNode;
	title?: string;
};

type RowViewProps = {
	children: React.ReactNode;
};

type DataViewProps = {
	labelText: string;
	value: string;
	style?: string;
};

type AnglesViewProps = {
	angles: Angles;
};

type PatientDataProps = {
	patientData: PatientData;
};

type AppointmentDataProps = {
	appointmentData: AppointmentData;
};

function Separator(): React.ReactNode {
	const { separator } = styles;

	return <View style={separator}></View>;
}

function BoxView({ children, title }: BoxViewProps): React.ReactNode {
	const { boxView } = styles;

	if (children === undefined) {
		return <View style={boxView}></View>;
	}

	return (
		<View style={boxView}>
			<Text>{title}</Text>

			<Separator />

			{children}
		</View>
	);
}

function RowView({ children }: RowViewProps): React.ReactNode {
	const { rowView } = styles;

	return <View style={rowView}>{children}</View>;
}

function DataView({ labelText, value, style }: DataViewProps): React.ReactNode {
	const { data, dataView, label } = styles;

	const stringValues = [dataView];

	if (style !== undefined) {
		stringValues.push(styles[style]);
	}

	return (
		<View style={stringValues}>
			<Text style={label}>{labelText}</Text>

			<Text style={data}>{value}</Text>
		</View>
	);
}

function Header(): React.ReactNode {
	const { header, headerDate, headerTitle } = styles;

	return (
		<View style={header}>
			<Image src={UgLogo} />

			<View>
				<Text style={headerTitle}>Universidad</Text>

				<Text style={headerTitle}>de Guayaquil</Text>
			</View>

			<Text style={headerDate}>{format(new Date(), "dd-MM-yyyy")}</Text>
		</View>
	);
}

function PatientView({ patientData: { birthDate, dni, firstName, lastName, locationAddress, phone, sex } }: PatientDataProps): React.ReactNode {
	return (
		<BoxView>
			<Text>Datos Generales</Text>

			<Separator />

			<View>
				<RowView>
					<DataView style="dniStyle" labelText="Cédula:" value={`CC: ${dni}`} />

					<DataView style="ageStyle" labelText="Edad:" value={`${differenceInYears(new Date(), birthDate).toString()} años`} />

					<DataView style="phoneStyle" labelText="Celular:" value={phone} />
				</RowView>

				<RowView>
					<DataView style="firstNameStyle" labelText="Nombres:" value={firstName} />

					<DataView style="lastNameStyle" labelText="Apellidos:" value={lastName} />

					<DataView style="sexStyle" labelText="Sexo:" value={sex === Sex.Male ? "Hombre" : "Mujer"} />
				</RowView>

				<RowView>
					<DataView style="locationAddressStyle" labelText="Dirección domiciliaria:" value={locationAddress} />
				</RowView>
			</View>
		</BoxView>
	);
}

function AppointmentView({ appointmentData: { date, nameDoctor, summary } }: AppointmentDataProps): React.ReactNode {
	return (
		<BoxView title="Datos de la Cita">
			<View>
				<RowView>
					<DataView style="doctorNameStyle" labelText="Doctor:" value={nameDoctor} />

					<DataView style="lastAppointmentDateStyle" labelText="Fecha cita:" value={format(date, "dd/MM/yyyy")} />
				</RowView>

				<DataView style="summaryStyle" labelText="Comentarios:" value={summary} />
			</View>
		</BoxView>
	);
}

function AnglesView({ angles: { elbow } }: AnglesViewProps): React.ReactNode {
	const { jointAngle, jointAngles } = styles;

	return (
		<BoxView title="Ángulos">
			<View style={jointAngles}>
				<View style={jointAngle}>
					<BoxView title="Codo">
						<DataView labelText="Derecho:" value={`${elbow.right}°`} />

						<DataView labelText="Izquierdo:" value={`${elbow.left}°`} />
					</BoxView>
				</View>
			</View>
		</BoxView>
	);
}

export default function PatientPdf({ appointmentData, patientData }: PatientPdfProps): React.ReactNode {
	const { page, title, userImage } = styles;

	return (
		<Document>
			<Page size="A4" style={page}>
				<BoxView>
					<Header />
				</BoxView>

				<Text style={title}>Reporte del paciente</Text>

				<PatientView patientData={patientData} />

				<BoxView />

				<AppointmentView appointmentData={appointmentData} />

				{appointmentData.angles !== undefined && <AnglesView angles={appointmentData.angles} />}
			</Page>

			<Page size="A4" style={page}>
				<BoxView title="Imagen original">
					<Image style={userImage} src={appointmentData.uploadedImageLink} />
				</BoxView>
			</Page>

			<Page size="A4" style={page}>
				<BoxView title="Imagen con estimaciones">
					<Image style={userImage} src={appointmentData.estimatedImageLink} />
				</BoxView>
			</Page>
		</Document>
	);
}
