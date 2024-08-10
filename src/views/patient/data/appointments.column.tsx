import { Button } from "@/components/ui";
import { AppointmentTable } from "@/types";
import { CellContext, ColumnDef, HeaderContext } from "@tanstack/react-table";
import { format } from "date-fns";
import { ArrowUpDown, Eye } from "lucide-react";
import { NavigateFunction, useNavigate } from "react-router-dom";

export const columns: ColumnDef<AppointmentTable>[] = [
	{
		accessorKey: "index",
		header: (): React.ReactNode => <div className="text-center font-semibold">N°</div>,
		cell: ({ row }: CellContext<AppointmentTable, unknown>): React.ReactNode => {
			const index: number = parseInt(row.getValue("index"));

			return <div className="text-center">{index}</div>;
		}
	},
	{
		id: "id",
		accessorKey: "id",
		header: (): React.ReactNode => <div className="text-center">Identificador</div>,
		cell: ({ row }: CellContext<AppointmentTable, unknown>): React.ReactNode => {
			const id: string = row.getValue("id");

			return <div className="text-center">{id}</div>;
		}
	},
	{
		accessorKey: "date",
		header: ({ column }: HeaderContext<AppointmentTable, unknown>): React.ReactNode => (
			<Button
				variant="ghost"
				className="w-full text-center font-semibold text-white hover:bg-gray-100/20 hover:text-white"
				onClick={(): void => {
					column.toggleSorting(column.getIsSorted() === "asc");
				}}
			>
				Fecha de la consulta <ArrowUpDown className="ml-2 h-4 w-4" />
			</Button>
		),
		cell: ({ row }: CellContext<AppointmentTable, unknown>): React.ReactNode => {
			const date: Date = row.getValue("date");

			return <div className="text-center">{format(date, "dd-MM-yyyy HH:mm:ss")}</div>;
		}
	},
	{
		accessorKey: "nameDoctor",
		header: ({ column }: HeaderContext<AppointmentTable, unknown>): React.ReactNode => (
			<Button
				variant="ghost"
				className="w-full text-center font-semibold text-white hover:bg-gray-100/20 hover:text-white"
				onClick={(): void => {
					column.toggleSorting(column.getIsSorted() === "asc");
				}}
			>
				Nombres y apellidos del doctor <ArrowUpDown className="ml-2 h-4 w-4" />
			</Button>
		),
		cell: ({ row }: CellContext<AppointmentTable, unknown>): React.ReactNode => {
			const nameDoctor: string = row.getValue("nameDoctor");

			return <div className="text-center">{nameDoctor}</div>;
		}
	},
	{
		accessorKey: "actions",
		header: () => <div className="text-center font-semibold">Acciones</div>,
		cell: ({ row }: CellContext<AppointmentTable, unknown>): React.ReactNode => {
			const id: string = row.getValue("id");

			const navigate: NavigateFunction = useNavigate();

			return (
				<div className="flex items-center justify-center gap-2">
					<Button
						size="icon"
						className="bg-blue-700 hover:bg-blue-600"
						onClick={(): void => {
							navigate(`/patient/appointment/${id}`);
						}}
					>
						<Eye className="h-4 w-4" />
					</Button>
				</div>
			);
		}
	}
];
