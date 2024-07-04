import { Button } from "@/components/ui";
import { Sex } from "@/enums";
import { cn } from "@/lib";
import { PatientTable } from "@/types";
import { CellContext, ColumnDef } from "@tanstack/react-table";
import { CircleUserRound, Eye } from "lucide-react";
import { NavigateFunction, useNavigate } from "react-router-dom";

export const columns: ColumnDef<PatientTable>[] = [
	{
		accessorKey: "index",
		header: (): React.ReactNode => <div className="text-center">N°</div>,
		cell: ({ row }: CellContext<PatientTable, unknown>): React.ReactNode => {
			const index: number = parseInt(row.getValue("index"));

			return <div className="text-center">{index}</div>;
		}
	},
	{
		accessorKey: "id",
		enableHiding: true
	},
	{
		accessorKey: "dni",
		header: (): React.ReactNode => <div className="text-center">Cédula</div>,
		cell: ({ row }: CellContext<PatientTable, unknown>): React.ReactNode => {
			const dni: string = row.getValue("dni");

			return <div className="text-center">{dni}</div>;
		}
	},
	{
		accessorKey: "fullName",
		header: (): React.ReactNode => <div className="text-center">Nombres y apellidos</div>,
		cell: ({ row }: CellContext<PatientTable, unknown>): React.ReactNode => {
			const fullName: string = row.getValue("fullName");

			return <div className="text-center">{fullName}</div>;
		}
	},
	{
		accessorKey: "age",
		header: (): React.ReactNode => <div className="text-center">Edad</div>,
		cell: ({ row }: CellContext<PatientTable, unknown>): React.ReactNode => {
			const age: number = row.getValue("age");

			return <div className="text-center">{age}</div>;
		}
	},
	{
		accessorKey: "sex",
		header: (): React.ReactNode => <div className="text-center">Sexo</div>,
		cell: ({ row }: CellContext<PatientTable, unknown>): React.ReactNode => {
			const sex: Sex = row.getValue("sex");

			return (
				<CircleUserRound
					className={cn("mx-auto h-4 w-4", {
						"text-blue-500": sex === Sex.Male,
						"text-pink-500": sex === Sex.Female
					})}
				/>
			);
		}
	},
	{
		accessorKey: "actions",
		header: () => <div className="text-center">Acciones</div>,
		cell: ({ row }: CellContext<PatientTable, unknown>): React.ReactNode => {
			const id: string = row.getValue("id");

			const navigate: NavigateFunction = useNavigate();

			return (
				<div className="flex items-center justify-center gap-2">
					<Button
						size="icon"
						className="bg-blue-500 hover:bg-blue-400"
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
