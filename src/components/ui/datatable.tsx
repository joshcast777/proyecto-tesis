// TanStack
import { Cell, ColumnDef, ColumnFiltersState, Header, HeaderGroup, Row, SortingState, Table as TableType, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";

// Components
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table";
import { useState } from "react";

/**
 * Description placeholder
 *
 * @typedef {DataTableProps}
 * @template TData
 * @template TValue
 */
type DataTableProps<TData, TValue> = {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	filterComponent?: (table: TableType<TData>) => React.ReactNode;
};

/**
 * `DataTable` is a component that renders a data table with pagination.
 *
 * @export
 *
 * @template TData - Type of the data.
 * @template TValue - Type of the value.
 *
 * @param {DataTableProps<TData, TValue>} props - The properties for the component.
 * @param {ColumnDef<TData, TValue>[]} props.columns - Array of column definitions for the table.
 * @param {TData[]} props.data - Array of data objects to be displayed in the table.
 *
 * @returns {React.ReactNode}
 */
export function DataTable<TData, TValue>({ columns, data, filterComponent }: DataTableProps<TData, TValue>): React.ReactNode {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

	const table = useReactTable({
		data,
		columns,
		initialState: {
			columnVisibility: {
				id: false
				// },
				// pagination: {
				// 	pageSize: tableSize
			},
			sorting
		},
		state: {
			columnFilters,
			sorting
		},
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		onColumnFiltersChange: setColumnFilters,
		onSortingChange: setSorting
	});

	return (
		<>
			{filterComponent && filterComponent(table)}

			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map(
							(headerGroup: HeaderGroup<TData>): React.ReactNode => (
								<TableRow key={headerGroup.id}>
									{headerGroup.headers.map(
										(header: Header<TData, unknown>): React.ReactNode => (
											<TableHead key={header.id}>{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}</TableHead>
										)
									)}
								</TableRow>
							)
						)}
					</TableHeader>

					<TableBody>
						{table.getRowModel().rows.length ? (
							table.getRowModel().rows.map(
								(row: Row<TData>): React.ReactNode => (
									<TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
										{row.getVisibleCells().map(
											(cell: Cell<TData, unknown>): React.ReactNode => (
												<TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
											)
										)}
									</TableRow>
								)
							)
						) : (
							<TableRow>
								<TableCell colSpan={columns.length} className="h-24 text-center">
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			{/* <div className="flex items-center justify-center space-x-5 py-4">
				<Button
					className="border-blue-700 text-blue-700 hover:bg-blue-50 disabled:border-blue-400 disabled:text-blue-400"
					variant="outline"
					size="icon"
					onClick={async (): Promise<void> => {
						// table.previousPage();
						enableLoading();

						setTablePage(tablePage - 1);

						await getPatients("PREVIOUS");

						disableLoading();
					}}
					// disabled={!table.getCanPreviousPage()}
					disabled={tablePage === 1}
				>
					<ChevronLeft className="h-4 w-4" />
				</Button>

				<p>
					<span className="font-semibold">Página: {tablePage}</span>
				</p>

				<Button
					className="border-blue-700 text-blue-700 hover:bg-blue-50 disabled:border-blue-400 disabled:text-blue-400"
					variant="outline"
					size="icon"
					onClick={async (): Promise<void> => {
						// table.nextPage();
						enableLoading();

						setTablePage(tablePage + 1);

						await getPatients();

						disableLoading();
					}}
					// disabled={!table.getCanNextPage()}
					disabled={patients.length < tableSize}
				>
					<ChevronRight className="h-4 w-4" />
				</Button>
			</div> */}
		</>
	);
}
