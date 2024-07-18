import { UgLogo } from "@/assets/images";
import { Document, Image, Page, Styles, StyleSheet, Text, View } from "@react-pdf/renderer";
import { format } from "date-fns";

const styles: Styles = StyleSheet.create({
	page: {
		paddingHorizontal: "25px",
		paddingVertical: "15px"
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
		height: "15vh",
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
	data: {
		flexDirection: "row",
		gap: "5px"
	},
	labelValue: {
		fontWeight: "bold",
		fontSize: "14px"
	},
	dataValue: {
		fontSize: "14px"
	}
});

type BoxViewProps = {
	children: React.ReactNode;
};

type LabelProps = {
	label: string;
};

type ValueProps = {
	value: string;
};

type DataProps = {
	children: React.ReactNode;
};

function BoxView({ children }: BoxViewProps): React.ReactNode {
	const { boxView, header } = styles;

	return <View style={[boxView, header]}>{children}</View>;
}

function Separator(): React.ReactNode {
	const { separator } = styles;

	return <View style={separator}></View>;
}

function Label({ label }: LabelProps): React.ReactNode {
	const { labelValue } = styles;

	return <Text style={labelValue}>{label}</Text>;
}

function Value({ value }: ValueProps): React.ReactNode {
	const { dataValue } = styles;

	return <Text style={dataValue}>{value}</Text>;
}

function Data({ children }: DataProps): React.ReactNode {
	const { data } = styles;

	return <View style={data}>{children}</View>;
}

export default function PatientPdf(): React.ReactNode {
	const { boxView, headerDate, headerTitle, page, title } = styles;

	return (
		<Document>
			<Page size="A4" orientation="landscape" style={page}>
				<BoxView>
					<Image src={UgLogo} />

					<Text style={headerTitle}>Universidad de Guayaquil</Text>

					<Text style={headerDate}>{format(new Date(), "dd-MM-yyyy")}</Text>
				</BoxView>

				<Text style={title}>Reporte del paciente</Text>

				<View style={boxView}>
					<Text>Datos Generales</Text>

					<Separator />

					<View>
						<View>
							<Data>
								<Label label="Cédula:" />

								<Value value="0987654321" />
							</Data>

							<Data>
								<Label label="Nombres:" />

								<Value value="Miguel Joshua" />
							</Data>

							<Data>
								<Label label="Apellidos:" />

								<Value value="Castillo Riofrío" />
							</Data>
						</View>

						<Label label="Fecha de nacimiento:" />

						<Value value="05-10-1999" />

						<Label label="Edad:" />

						<Value value="24" />

						<Label label="Sexo:" />

						<Value value="Hombre" />

						<Label label="Celular:" />

						<Value value="1234567890" />

						<Label label="Dirección:" />

						<Value value="Durán" />
					</View>
				</View>
			</Page>
		</Document>
	);
}
