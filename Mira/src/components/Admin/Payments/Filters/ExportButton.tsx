import { Download } from "lucide-react";

interface Props {
  onExport: () => void;
}

export default function ExportButton({ onExport }: Props) {
  return (
    <button
      onClick={onExport}
      className="
      flex
      h-12
      items-center
      gap-2
      rounded-2xl
      bg-[#18311D]
      px-5
      text-white
      transition-all
      hover:scale-[1.03]
      hover:bg-[#254d2f]"
    >
      <Download size={18} />
      Export CSV
    </button>
  );
}
