import { FileText } from "lucide-react";

export default function EmptyTransactions() {
  return (
    <div
      className="
      flex
      h-72
      flex-col
      items-center
      justify-center
      rounded-3xl
      border
      border-dashed
      border-[#18311D]/15"
    >
      <FileText
        className="text-[#18311D]/30"
        size={50}
      />

      <p className="mt-4 text-[#18311D]/60">
        No recent transactions.
      </p>
    </div>
  );
}