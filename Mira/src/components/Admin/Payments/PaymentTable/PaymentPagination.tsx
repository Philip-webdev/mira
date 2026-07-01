import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  page: number;
  pages: number;

  onNext(): void;

  onPrevious(): void;
}

export default function PaymentPagination({
  page,
  pages,
  onNext,
  onPrevious,
}: Props) {
  return (
    <div className="flex items-center justify-between border-t border-[#18311D]/10 text-[#18311D]/80 p-5">
      <button
        disabled={page === 1}
        onClick={onPrevious}
        className="flex items-center gap-2 rounded-xl border px-4 py-2 disabled:opacity-40"
      >
        <ChevronLeft size={18} />
        Previous
      </button>

      <span className="font-medium">
        {page} / {pages}
      </span>

      <button
        disabled={page === pages}
        onClick={onNext}
        className="flex items-center gap-2 rounded-xl border px-4 py-2 disabled:opacity-40"
      >
        Next
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
