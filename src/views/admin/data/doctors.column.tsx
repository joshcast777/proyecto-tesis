import { Button, TooltipLayout } from "@/components/ui";
import { ToastIcons } from "@/constants/ui";
import { ToastTitles, ToastTypes } from "@/enums";
import { cn, showToast } from "@/lib";
import { doctorStore, globalStore } from "@/store";
import { DoctorTable } from "@/types";
import { CellContext, ColumnDef } from "@tanstack/react-table";
import { ArchiveRestore, CircleCheck, CircleX, Pencil, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";

export const columns: ColumnDef<DoctorTable>[] = [
	{
		accessorKey: "id",
		enableHiding: true
	},
	{
		accessorKey: "index",
		header: (): React.ReactNode => <div className="text-center">N°</div>,
		cell: ({ row }: CellContext<DoctorTable, unknown>): React.ReactNode => {
			const index: number = parseInt(row.getValue("index"));

			return <div className="text-center">{index}</div>;
		}
	},
	{
		accessorKey: "dni",
		header: (): React.ReactNode => <div className="text-center">Cédula</div>,
		cell: ({ row }: CellContext<DoctorTable, unknown>): React.ReactNode => {
			const dni: string = row.getValue("dni");

			return <div className="text-center">{dni}</div>;
		}
	},
	{
		accessorKey: "firstName",
		header: (): React.ReactNode => <div className="text-center">Nombres</div>,
		cell: ({ row }: CellContext<DoctorTable, unknown>): React.ReactNode => {
			const firstName: string = row.getValue("firstName");

			return <div className="text-center">{firstName}</div>;
		}
	},
	{
		accessorKey: "lastName",
		header: (): React.ReactNode => <div className="text-center">Apellidos</div>,
		cell: ({ row }: CellContext<DoctorTable, unknown>): React.ReactNode => {
			const lastName: string = row.getValue("lastName");

			return <div className="text-center">{lastName}</div>;
		}
	},
	{
		accessorKey: "phone",
		header: (): React.ReactNode => <div className="text-center">Celular</div>,
		cell: ({ row }: CellContext<DoctorTable, unknown>): React.ReactNode => {
			const phone: string = row.getValue("phone");

			return <div className="text-center">{phone}</div>;
		}
	},
	{
		accessorKey: "email",
		header: (): React.ReactNode => <div className="text-center">Correo</div>,
		cell: ({ row }: CellContext<DoctorTable, unknown>): React.ReactNode => {
			const email: string = row.getValue("email");

			return <div className="text-center">{email}</div>;
		}
	},
	{
		accessorKey: "status",
		header: (): React.ReactNode => <div className="text-center">Estado</div>,
		cell: ({ row }: CellContext<DoctorTable, unknown>): React.ReactNode => {
			const status: boolean = row.getValue("status");

			return status ? <CircleCheck className="mx-auto text-green-500" /> : <CircleX className="mx-auto text-red-500" />;
		}
	},
	{
		accessorKey: "updateDate",
		header: (): React.ReactNode => <div className="text-center">Fecha de creación/actualización</div>,
		cell: ({ row }: CellContext<DoctorTable, unknown>): React.ReactNode => {
			const updateDate: string = row.getValue("updateDate");

			return <div className="text-center">{updateDate}</div>;
		}
	},
	{
		accessorKey: "actions",
		header: () => <div className="text-center">Acciones</div>,
		cell: ({ row }: CellContext<DoctorTable, unknown>): React.ReactNode => {
			const { deleteDoctor, getDoctors } = doctorStore();
			const { errorMessage, clearErrorMessage, disableLoading, enableLoading, setErrorMessage } = globalStore();

			const navigate: NavigateFunction = useNavigate();

			const id: number = row.getValue("id");
			const status: boolean = row.getValue("status");

			const onDeleteDoctor = async (): Promise<void> => {
				enableLoading();

				const response: string = await deleteDoctor(id.toString());

				if (response !== "") {
					setErrorMessage(response);
					disableLoading();

					return;
				}

				getDoctors();

				disableLoading();
			};

			useEffect((): void => {
				if (errorMessage !== "") {
					showToast({
						type: ToastTypes.Error,
						title: ToastTitles.Error,
						message: errorMessage,
						icon: ToastIcons.Error,
						onDismissAndOnAutoCloseFunctions: clearErrorMessage
					});
				}
			}, [errorMessage]);

			return (
				<div className="flex items-center justify-center gap-2">
					<TooltipLayout
						triggerContent={(): React.ReactNode => (
							<Button
								size="icon"
								className="bg-yellow-500 hover:bg-yellow-400"
								onClick={(): void => {
									navigate(`/admin/doctor/form/${id}`);
								}}
							>
								<Pencil className="h-4 w-4" />
							</Button>
						)}
						content={(): React.ReactNode => <p>Editar</p>}
					/>

					<TooltipLayout
						triggerContent={(): React.ReactNode => (
							<Button
								size="icon"
								className={cn({
									"bg-red-500 hover:bg-red-400": status,
									"bg-green-500 hover:bg-green-400": !status
								})}
								onClick={onDeleteDoctor}
							>
								{status ? <Trash2 className="h-4 w-4" /> : <ArchiveRestore className="h-4 w-4" />}
							</Button>
						)}
						content={(): React.ReactNode => <p>{status ? "Eliminar" : "Restaurar"}</p>}
					/>
				</div>
			);
		}
	}
];
