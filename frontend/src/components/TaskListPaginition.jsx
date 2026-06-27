import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

const TaskListPaginition = ({
  handleNext,
  handlePrev,
  handlePageChange,
  page,
  totalPages,
}) => {
  // Hàm vẽ phân trang dựa vào trang hiện tại
  const generatePages = () => {
    // 1. Trường hợp quá ít trang: hiển thị toàn bộ số trang
    if (totalPages <= 4) {
      const pages = [];
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    // 2. Trường hợp đang ở những trang đầu tiên (Trang 1)
    if (page <= 2) {
      return [1, 2, 3, "...", totalPages];
    }

    // 3. Trường hợp đang ở những trang cuối cùng
    if (page >= totalPages - 1) {
      return [1, "...", totalPages - 2, totalPages - 1, totalPages];
    }

    // 4. Trường hợp ở giữa (Mặc định)
    return [1, "...", page, "...", totalPages];
  };

  const pagesToShow = generatePages();

  return (
    <div className="flex justify-center mt-2">
      <Pagination>
        <PaginationContent>
          {/* Trước */}
          <PaginationItem>
            <PaginationPrevious
              onClick={page === 1 ? undefined : handlePrev}
              className={cn(
                "cursor-pointer",
                page === 1 && "pointer-events-none opacity-50",
              )}
            />
          </PaginationItem>

          {/* Vẽ phân trang dựa vào hàm generatePages() */}
          {pagesToShow.map((p, index) => (
            <PaginationItem key={index}>
              {p === "..." ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  isActive={p === page}
                  onClick={() => {
                    if (p != page) handlePageChange(p);
                  }}
                  className="cursor-pointer "
                >
                  {p}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          {/* Sau */}
          <PaginationItem>
            <PaginationNext
              onClick={page === totalPages ? undefined : handleNext}
              className={cn(
                "cursor-pointer",
                page === totalPages && "pointer-events-none opacity-50",
              )}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default TaskListPaginition;
