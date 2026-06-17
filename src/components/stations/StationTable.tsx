import {
  type ColumnDef,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown, ExternalLink, GitCompare, Search, X } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FavoriteButton } from "@/components/ui/favorite-button";
import { HighlightText } from "@/components/ui/highlight-text";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
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
import { extractLanguageOptions } from "@/lib/band-stats";
import { useCompare, useCompareItem } from "@/hooks/useCompare";
import { removeFromCompare } from "@/lib/compare";
import { cn } from "@/lib/utils";
import { stationMatchesSearch } from "@/lib/highlight";

const PAGE_SIZE = 10;

interface StationTableProps {
  data: Station[];
  emptyText?: string;
  initialBandFilter?: FrequencyBand | "all";
}

/**
 * 台站列表 TanStack Table，支持频段筛选、语言筛选、模糊搜索与列排序
 * 语言选项由台站数据自动提取去重生成；筛选条件取交集，台站计数随结果实时更新
 */
export function StationTable({
  data,
  emptyText = "未找到匹配的台站，请调整筛选条件",
  initialBandFilter = "all",
}: StationTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [bandFilter, setBandFilter] = useState<FrequencyBand | "all">(initialBandFilter);
  const [languageFilter, setLanguageFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { selectedIds, count, canAdd, clear } = useCompare();
  const navigate = useNavigate();

  useEffect(() => {
    setBandFilter(initialBandFilter);
    setCurrentPage(1);
  }, [initialBandFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [bandFilter, languageFilter, searchQuery]);

  const languageOptions = useMemo(() => extractLanguageOptions(data), [data]);

  const filteredData = useMemo(() => {
    let result = data;

    if (bandFilter !== "all") {
      result = result.filter((s) => s.band === bandFilter);
    }

    if (languageFilter !== "all") {
      result = result.filter((s) => s.language === languageFilter);
    }

    if (searchQuery.trim()) {
      result = result.filter((s) => stationMatchesSearch(s, searchQuery));
    }

    return result;
  }, [data, bandFilter, languageFilter, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / PAGE_SIZE));

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredData.slice(start, start + PAGE_SIZE);
  }, [filteredData, currentPage]);

  const selectedStations = useMemo(() => {
    return data.filter((s) => selectedIds.includes(s.id));
  }, [data, selectedIds]);

  const columns = useMemo<ColumnDef<Station>[]>(
    () => [
      {
        id: "select",
        header: () => <span className="sr-only">选择对比</span>,
        cell: ({ row }) => (
          <CompareCheckbox id={row.original.id} callSign={row.original.callSign} canAdd={canAdd} />
        ),
        enableSorting: false,
        size: 40,
      },
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
              <HighlightText text={row.original.callSign} keyword={searchQuery} />
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
        cell: ({ row }) => (
          <HighlightText text={row.original.language} keyword={searchQuery} />
        ),
      },
      {
        accessorKey: "timeSlot",
        header: ({ column }) => (
          <SortButton column={column} label="时段" />
        ),
        cell: ({ row }) => (
          <span className="text-muted-foreground text-xs">
            <HighlightText text={row.original.timeSlot} keyword={searchQuery} />
          </span>
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
    [canAdd, searchQuery]
  );

  const table = useReactTable({
    data: paginatedData,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const selectedBand = BAND_OPTIONS.find((b) => b.value === bandFilter);

  const handleCompare = () => {
    if (count > 0) {
      const ids = selectedIds.join(",");
      navigate(`/对比?ids=${ids}`);
    }
  };

  return (
    <div className="space-y-4">
      <div className="radio-panel flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center flex-1">
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
          <div className="flex items-center gap-2">
            <label htmlFor="language-filter" className="text-sm text-muted-foreground whitespace-nowrap">
              语言筛选
            </label>
            <Select
              value={languageFilter}
              onValueChange={(v) => setLanguageFilter(v)}
            >
              <SelectTrigger id="language-filter" className="w-[150px]">
                <SelectValue placeholder="选择语言" />
              </SelectTrigger>
              <SelectContent>
                {languageOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
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
      </div>

      {count > 0 && (
        <div className="radio-panel flex flex-wrap items-center gap-3 p-3 bg-radio-amber/10 border-radio-amber/30">
          <div className="flex items-center gap-2">
            <GitCompare className="h-4 w-4 text-radio-amber" />
            <span className="text-sm font-medium text-radio-amber">
              已选择 {count}/3 个台站
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedStations.map((station) => (
              <Badge key={station.id} variant="secondary" className="gap-1">
                {station.callSign}
                <button
                  onClick={(e) => {
                  e.stopPropagation();
                  removeFromCompare(station.id);
                }}
                  aria-label={`从对比列表中移除 ${station.callSign}`}
                  className="ml-1 hover:text-radio-amber transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={clear}
              className="text-muted-foreground hover:text-foreground"
            >
              清空选择
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleCompare}
              className="bg-radio-amber hover:bg-radio-amber/90 text-radio-wood"
            >
              <GitCompare className="h-4 w-4" />
              对比台站
            </Button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between px-1">
        <div className="text-sm text-muted-foreground">
          共 <span className="text-radio-amber font-semibold">{filteredData.length}</span> 个台站
          {selectedBand && selectedBand.range && (
            <span className="ml-2 hidden sm:inline">· {selectedBand.range}</span>
          )}
        </div>
        <div className="text-sm text-muted-foreground">
          第 <span className="text-radio-amber font-semibold">{currentPage}</span> / {totalPages} 页
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

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredData.length}
        pageSize={PAGE_SIZE}
        onPageChange={setCurrentPage}
        className="px-1"
      />
    </div>
  );
}

/** 对比复选框组件 */
function CompareCheckbox({ id, callSign, canAdd }: { id: string; callSign: string; canAdd: boolean }) {
  const { isSelected, toggle } = useCompareItem(id);
  const isDisabled = !isSelected && !canAdd;
  return (
    <div className="flex items-center justify-center">
      <input
        type="checkbox"
        checked={isSelected}
        disabled={isDisabled}
        onChange={(e) => {
          e.stopPropagation();
          toggle();
        }}
        aria-label={isSelected ? `从对比列表中移除 ${callSign}` : `添加 ${callSign} 到对比列表`}
        className={cn(
          "h-4 w-4 rounded border-radio-brass/50 text-radio-amber focus:ring-radio-amber",
          "bg-radio-wood/30 cursor-pointer",
          isDisabled && "opacity-50 cursor-not-allowed"
        )}
      />
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
