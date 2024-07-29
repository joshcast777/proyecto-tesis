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
		</>
	);
}
