import {
	ColumnDef,
	SortingState,
	ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table"

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/02-components/ui/table"
import { Button } from "@/02-components/ui/button"
import React, { useState } from "react"
import { Input } from "@/02-components/ui/input"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Skeleton } from "@/02-components/ui/skeleton"
import { createSkeletonArray, skeletonUniqueId } from "@/02-components/utils/misc"

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[]
	data: TData[],
	children?: React.ReactNode
}

export function DataTable<TData, TValue>({ columns, data, children }: Readonly<DataTableProps<TData, TValue>>) {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		state: {
			sorting,
			columnFilters
		},
		initialState: {
			pagination: {
				pageSize: 8,
			},
		},
	})

	return (
		<div>
			<div className="flex items-center py-3 gap-2 justify-between">
				<Input
					placeholder="Cerca per nome..."
					value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
					onChange={(event) =>
						table.getColumn("name")?.setFilterValue(event.target.value)
					}
					className="max-w-sm"
				/>

				{children}
			</div>
			<div className="rounded-md border overflow-hidden">
				<Table>
					<TableHeader className="bg-muted/40">
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id} style={{ maxWidth: `${header.column.columnDef.maxSize}%` }}>
											{header.isPlaceholder
												? null
												: flexRender(
													header.column.columnDef.header,
													header.getContext()
												)}
										</TableHead>
									)
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id} style={{ maxWidth: `${cell.column.columnDef.maxSize}%` }}>
											{flexRender(cell.column.columnDef.cell, cell.getContext())}
										</TableCell>
									))}
								</TableRow>
							))
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
			<div className="flex items-center justify-end space-x-2 py-4">
				<Button
					variant="outline"
					size="icon"
					onClick={() => table.previousPage()}
					disabled={!table.getCanPreviousPage()}
				>
					<ChevronLeft />
				</Button>
				<Button
					variant="outline"
					size="icon"
					onClick={() => table.nextPage()}
					disabled={!table.getCanNextPage()}
				>
					<ChevronRight />
				</Button>
			</div>
		</div>
	)
}

export function DataTableSkeleton() {
	return (
		<div>
			<div className="flex items-center py-3 justify-between">
				<Skeleton className="h-9 w-[385px]" />
				<Skeleton className="h-9 w-[150px]" />
			</div>
			<div className="rounded-md border overflow-hidden">
				<Table>
					<TableHeader className="bg-muted/40">
						<TableRow>
							{createSkeletonArray(4).map(() => (
								<TableHead key={skeletonUniqueId()} className="p-0">
									<Skeleton className="h-full w-full rounded-none" />
								</TableHead>
							))}
						</TableRow>
					</TableHeader>
					<TableBody>
						{createSkeletonArray(8).map(() => (
							<TableRow key={skeletonUniqueId()} className="h-[57px]">
								<TableCell>
									<Skeleton className="h-4 w-full" />
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
			<div className="flex items-center justify-end space-x-2 py-4">
				<Skeleton className="h-9 w-9" />
				<Skeleton className="h-9 w-9" />
			</div>
		</div>
	)
}