import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  className?: string;
}

/**
 * 分页控制条组件
 * 提供上一页、下一页、页码跳转功能
 */
export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  className,
}: PaginationProps) {
  const [jumpValue, setJumpValue] = useState("");

  useEffect(() => {
    setJumpValue("");
  }, [currentPage]);

  const canGoPrev = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  const handlePrev = () => {
    if (canGoPrev) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (canGoNext) {
      onPageChange(currentPage + 1);
    }
  };

  const doJump = () => {
    const page = parseInt(jumpValue, 10);
    if (!isNaN(page) && page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
    setJumpValue("");
  };

  const handleJump = (e: React.FormEvent) => {
    e.preventDefault();
    doJump();
  };

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  if (totalPages <= 1) {
    return (
      <div className={cn("flex items-center justify-between text-sm text-muted-foreground", className)}>
        <span>显示 1-{totalItems} 条，共 {totalItems} 条</span>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between", className)}>
      <div className="text-sm text-muted-foreground">
        显示 <span className="text-radio-amber font-semibold">{startItem}-{endItem}</span> 条，
        共 <span className="text-radio-amber font-semibold">{totalItems}</span> 条
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrev}
          disabled={!canGoPrev}
          className="gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          上一页
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleNext}
          disabled={!canGoNext}
          className="gap-1"
        >
          下一页
          <ChevronRight className="h-4 w-4" />
        </Button>

        <form onSubmit={handleJump} className="flex items-center gap-2 ml-2">
          <span className="text-sm text-muted-foreground whitespace-nowrap">跳转至</span>
          <Input
            type="number"
            min={1}
            max={totalPages}
            value={jumpValue}
            onChange={(e) => setJumpValue(e.target.value)}
            placeholder="页码"
            className="w-16 h-8 text-center"
          />
          <span className="text-sm text-muted-foreground">页</span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={doJump}
            disabled={!jumpValue || parseInt(jumpValue, 10) < 1 || parseInt(jumpValue, 10) > totalPages}
          >
            跳转
          </Button>
        </form>
      </div>
    </div>
  );
}
