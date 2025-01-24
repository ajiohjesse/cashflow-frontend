import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useNavigate } from "@tanstack/react-router";
import { type ReactNode, useCallback } from "react";

export interface PagePaginationProps {
  pageSizeSelectOptions?: {
    pageSizeSearchParam?: string;
    pageSizeOptions: number[];
  };
  totalCount: number;
  pageSize: number;
  page: number;
}

export function PagePagination({
  pageSizeSelectOptions,
  pageSize,
  totalCount,
  page,
}: PagePaginationProps) {
  const navigate = useNavigate();

  const totalPageCount = Math.ceil(totalCount / pageSize);

  const navToPageSize = useCallback((newPageSize: number) => {
    navigate({
      to: ".",
      search: {
        limit: newPageSize,
      },
      replace: true,
    });
  }, []);

  const renderPageNumbers = () => {
    const items: ReactNode[] = [];
    const maxVisiblePages = 5;

    if (totalPageCount <= maxVisiblePages) {
      for (let i = 1; i <= totalPageCount; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              // href={buildLink(i)}
              search={(prev) => ({
                ...prev,
                page: i,
              })}
              isActive={page === i}
            >
              {i}
            </PaginationLink>
          </PaginationItem>,
        );
      }
    } else {
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            // href={buildLink(1)}
            search={(prev) => ({
              ...prev,
              page: 1,
            })}
            isActive={page === 1}
          >
            1
          </PaginationLink>
        </PaginationItem>,
      );

      if (page > 3) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>,
        );
      }

      const start = Math.max(2, page - 1);
      const end = Math.min(totalPageCount - 1, page + 1);

      for (let i = start; i <= end; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              // href={buildLink(i)}
              replace
              search={(prev) => ({
                ...prev,
                page: 1,
              })}
              isActive={page === i}
            >
              {i}
            </PaginationLink>
          </PaginationItem>,
        );
      }

      if (page < totalPageCount - 2) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>,
        );
      }

      items.push(
        <PaginationItem key={totalPageCount}>
          <PaginationLink
            // href={buildLink(totalPageCount)}
            replace
            search={(prev) => ({
              ...prev,
              page: totalPageCount,
            })}
            isActive={page === totalPageCount}
          >
            {totalPageCount}
          </PaginationLink>
        </PaginationItem>,
      );
    }

    return items;
  };

  return (
    <div className="flex w-full flex-col items-center gap-3 md:flex-row">
      {pageSizeSelectOptions && (
        <div className="flex flex-1 flex-col gap-4">
          <SelectRowsPerPage
            options={pageSizeSelectOptions.pageSizeOptions}
            setPageSize={navToPageSize}
            pageSize={pageSize}
          />
        </div>
      )}
      <Pagination className={cn({ "md:justify-end": pageSizeSelectOptions })}>
        <PaginationContent className="flex-wrap max-sm:gap-0">
          <PaginationItem>
            <PaginationPrevious
              // href={buildLink(Math.max(page - 1, 1))}
              replace
              search={(prev) => ({
                ...prev,
                page: Math.max(page - 1, 1),
              })}
              aria-disabled={page === 1}
              // tabIndex={page === 1 ? -1 : undefined}
              className={
                page === 1 ? "pointer-events-none opacity-50" : undefined
              }
            />
          </PaginationItem>
          {renderPageNumbers()}
          <PaginationItem>
            <PaginationNext
              // href={buildLink(Math.min(page + 1, totalPageCount))}
              replace
              search={(prev) => ({
                ...prev,
                page: Math.min(page + 1, totalPageCount),
              })}
              aria-disabled={page === totalPageCount}
              // tabIndex={page === totalPageCount ? -1 : undefined}
              className={
                page === totalPageCount
                  ? "pointer-events-none opacity-50"
                  : undefined
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

function SelectRowsPerPage({
  options,
  setPageSize,
  pageSize,
}: {
  options: number[];
  setPageSize: (newSize: number) => void;
  pageSize: number;
}) {
  return (
    <div className="flex items-center gap-4">
      <span className="whitespace-nowrap text-sm">Items per page</span>

      <Select
        value={String(pageSize)}
        onValueChange={(value) => setPageSize(Number(value))}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select page size">
            {String(pageSize)}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={String(option)}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
