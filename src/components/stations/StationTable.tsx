import {
  type ColumnDef,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Fuse from "fuse.js";
import { ArrowDown, ArrowUp, ArrowUpDown, ExternalLink, Search } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FavoriteButton } from "@/components/ui/favorite-button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatFrequency } from "@/types/station";
import type { FrequencyBand, Station } from "@/types/station";
import { BAND_OPTIONS } from "@/types/station";

interface StationTableProps {
  data: Station[];
  emptyText?: string;
  initialBandFilter?: FrequencyBand | "all";
}

/**
 * 台站列表 TanStack Table，支持频段筛选、模糊搜索与列排序
 */
export function StationTable({
  data,
  emptyText = "未找到匹配的台站，请调整筛选条件",
  initialBandFilter = "all",
}: StationTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [bandFilter, setBandFilter] = useState<FrequencyBand | "all">(initialBandFilter);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setBandFilter(initialBandFilter);
  }, [initialBandFilter]);

  const fuse = useMemo(
    () =>
      new Fuse(data, {
        keys: ["callSign", "language", "timeSlot", "band"],
        threshold: 0.4,
      }),
    [data]
  );

  const filteredData = useMemo(() => {
    let result = data;

    if (bandFilter !== "all") {
      result = result.filter((s) => s.band === bandFilter);
    }

    if (searchQuery.trim()) {
      const ids = new Set(fuse.search(searchQuery.trim()).map((r) => r.item.id));
      result = result.filter((s) => ids.has(s.id));
    }

    return result;
  }, [data, bandFilter, searchQuery, fuse]);

  const columns = useMemo<ColumnDef<Station>[]>(
    () => [
      {
        accessorKey: "callSign",
        header: ({ column }) => (
          <SortButton column={column} label="呼号" />
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <FavoriteButton id={row.original.id} size="sm" />
            <Link
              to={`/station/${row.original.id}`}
              className="font-semibold text-radio-amber hover:underline"
            >
              {row.original.callSign}
            </Link>
          </div>
        ),
      },
      {
        accessorKey: "frequency",
        header: ({ column }) => (
          <SortButton column={column} label="频率" />
        ),
        cell: ({ row }) => (
          <span className="frequency-display text-sm">{formatFrequency(row.original.frequency)}</span>
        ),
      },
      {
        accessorKey: "band",
        header: ({ column }) => (
          <SortButton column={column} label="频段" />
        ),
        cell: ({ row }) => (
          <Badge variant="band">{row.original.band}</Badge>
        ),
      },
      {
        accessorKey: "language",
        header: ({ column }) => (
          <SortButton column={column} label="语言" />
        ),
      },
      {
        accessorKey: "timeSlot",
        header: ({ column }) => (
          <SortButton column={column} label="时段" />
        ),
        cell: ({ row }) => (
          <span className="text-muted-foreground text-xs">{row.original.timeSlot}</span>
        ),
      },
      {
        id: "actions",
        header: () => <span className="sr-only">操作</span>,
        cell: ({ row }) => (
          <Button variant="ghost" size="sm" asChild>
            <Link to={`/station/${row.original.id}`}>
              详情
              <ExternalLink className="ml-1 h-3 w-3" />
            </Link>
          </Button>
        ),
        enableSorting: false,
      },
    ],
    []
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const selectedBand = BAND_OPTIONS.find((b) => b.value === bandFilter);

  return (
    <div className="space-y-4">
      <div className="radio-panel flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <label htmlFor="band-filter" className="text-sm text-muted-foreground whitespace-nowrap">
              频段筛选
            </label>
            <Select
              value={bandFilter}
              onValueChange={(v) => setBandFilter(v as FrequencyBand | "all")}
            >
              <SelectTrigger id="band-filter" className="w-[180px]">
                <SelectValue placeholder="选择频段" />
              </SelectTrigger>
              <SelectContent>
                {BAND_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                    {opt.range && ` (${opt.range})`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="搜索呼号、语言、时段..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          共 <span className="text-radio-amber font-semibold">{filteredData.length}</span> 个台站
          {selectedBand && selectedBand.range && (
            <span className="ml-2 hidden sm:inline">· {selectedBand.range}</span>
          )}
        </div>
      </div>

      <div className="radio-panel overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                  {emptyText}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

/** 列排序按钮 */
function SortButton({
  column,
  label,
}: {
  column: { getIsSorted: () => false | "asc" | "desc"; toggleSorting: (desc?: boolean) => void };
  label: string;
}) {
  const sorted = column.getIsSorted();
  return (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-3 h-8 hover:bg-accent/20"
      onClick={() => column.toggleSorting(sorted === "asc")}
    >
      {label}
      {sorted === "asc" ? (
        <ArrowUp className="ml-1 h-3 w-3" />
      ) : sorted === "desc" ? (
        <ArrowDown className="ml-1 h-3 w-3" />
      ) : (
        <ArrowUpDown className="ml-1 h-3 w-3 opacity-50" />
      )}
    </Button>
  );
}
