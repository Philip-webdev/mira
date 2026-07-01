import { Activity } from "lucide-react";

export default function EmptyActivity() {
  return (
    <div className="flex h-72 flex-col items-center justify-center">
      <Activity className="text-[#18311D]/30" size={50} />

      <h3 className="mt-4 font-semibold">No Activity Yet</h3>

      <p className="text-sm text-gray-500">Transactions will appear here.</p>
    </div>
  );
}
