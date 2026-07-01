import { FileX2 } from "lucide-react";

export default function PaymentEmpty() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <FileX2 size={70} className="text-[#18311D]/30" />

      <h2 className="mt-5 text-xl font-semibold">No Payments Found</h2>

      <p className="mt-2 text-[#18311D]/50">Try changing your filters.</p>
    </div>
  );
}
