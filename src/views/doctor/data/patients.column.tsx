import { Button } from "@/components/ui";
import { Sex } from "@/enums";
import { cn } from "@/lib";
import { PatientTable } from "@/types";
import { CellContext, ColumnDef, HeaderContext } from "@tanstack/react-table";
import { format } from "date-fns";
import { ArrowUpDown, CircleUserRound, Eye } from "lucide-react";
import { NavigateFunction, useNavigate } from "react-router-dom";

export const columns: ColumnDef<PatientTable>[] = [
	{
		accessorKey: "index",
		header: (): React.ReactNode => <div className="text-center font-semibold text-white">N°</div>,
		cell: ({ row }: CellContext<PatientTable, unknown>): React.ReactNode => {
			const index: number = parseInt(row.getValue("index"));

			return <div className="text-center">{index}</div>;
		}
	},
	{
		id: "id",
		accessorKey: "id",
		header: (): React.ReactNode => <div className="text-center">Identificador</div>,
		cell: ({ row }: CellContext<PatientTable, unknown>): React.ReactNode => {
			const id: string = row.getValue("id");

			return <div className="text-center">{id}</div>;
		}
	},
	{
		accessorKey: "dni",
		header: (): React.ReactNode => <div className="text-center font-semibold text-white">Cédula</div>,
		cell: ({ row }: CellContext<PatientTable, unknown>): React.ReactNode => {
			const dni: string = row.getValue("dni");

			return <div className="text-center">{dni}</div>;
		}
	},
	{
		accessorKey: "fullName",
		header: ({ column }: HeaderContext<PatientTable, unknown>): React.ReactNode => (
			<Button
				variant="ghost"
				className="w-full text-center font-semibold text-white hover:bg-gray-100/20 hover:text-white"
				onClick={(): void => {
					column.toggleSorting(column.getIsSorted() === "asc");
				}}
			>
				Nombres y apellidos <ArrowUpDown className="ml-2 h-4 w-4" />
			</Button>
		),
		cell: ({ row }: CellContext<PatientTable, unknown>): React.ReactNode => {
			const fullName: string = row.getValue("fullName");

			return <div className="text-center">{fullName}</div>;
		}
	},
	{
		accessorKey: "age",
		header: ({ column }: HeaderContext<PatientTable, unknown>): React.ReactNode => (
			<Button
				variant="ghost"
				className="w-full text-center font-semibold text-white hover:bg-gray-100/20 hover:text-white"
				onClick={(): void => {
					column.toggleSorting(column.getIsSorted() === "asc");
				}}
			>
				Edad <ArrowUpDown className="ml-2 h-4 w-4" />
			</Button>
		),
		cell: ({ row }: CellContext<PatientTable, unknown>): React.ReactNode => {
			const age: number = row.getValue("age");

			return <div className="text-center">{age}</div>;
		}
	},
	{
		accessorKey: "sex",
		filterFn: "includesString",
		header: (): React.ReactNode => <div className="text-center font-semibold text-white">Sexo</div>,
		cell: ({ row }: CellContext<PatientTable, unknown>): React.ReactNode => {
			const sex: Sex = row.getValue("sex");

			return (
				<div className="mx-auto flex h-6 w-6 items-center justify-center rounded-full bg-gray-300">
					<CircleUserRound
						className={cn("h-4 w-4", {
							"text-blue-500": sex === Sex.Male,
							"text-pink-500": sex === Sex.Female
						})}
					/>
				</div>
			);
		}
	},
	{
		accessorKey: "lastAppointmentDate",
		header: ({ column }: HeaderContext<PatientTable, unknown>): React.ReactNode => (
			<Button
				variant="ghost"
				className="w-full text-center font-semibold text-white hover:bg-gray-100/20 hover:text-white"
				onClick={(): void => {
					column.toggleSorting(column.getIsSorted() === "asc");
				}}
			>
				Fecha de la última estimación <ArrowUpDown className="ml-2 h-4 w-4" />
			</Button>
		),
		cell: ({ row }: CellContext<PatientTable, unknown>): React.ReactNode => {
			const lastAppointmentDate: null | Date = row.getValue("lastAppointmentDate");

			return <div className="text-center">{lastAppointmentDate === null ? "Sin estimaciones previas" : format(lastAppointmentDate, "dd-MM-yyyy HH:mm:ss")}</div>;
		}
	},
	{
		accessorKey: "actions",
		header: () => <div className="text-center font-semibold text-white">Acciones</div>,
		cell: ({ row }: CellContext<PatientTable, unknown>): React.ReactNode => {
			const id: string = row.getValue("id");

			const navigate: NavigateFunction = useNavigate();

			return (
				<div className="flex items-center justify-center gap-2">
					<Button
						size="icon"
						className="bg-blue-700 hover:bg-blue-600"
						onClick={(): void => {
							navigate(`/doctor/appointment/form/${id}`);
						}}
					>
						<Eye className="h-4 w-4" />
					</Button>
				</div>
			);
		}
	}
];
