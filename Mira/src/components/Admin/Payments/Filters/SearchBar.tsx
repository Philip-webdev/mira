import { Search } from "lucide-react";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: Props) {
  return (
    <div className="relative flex-1 min-w-[240px]">
      <Search
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#18311D]/40"
      />

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search payments..."
        className="
        h-12
        w-full
        rounded-2xl
        border
        border-[#18311D]/10
        text-[#18311D]
        bg-white/70
        pl-11
        pr-4
        backdrop-blur-xl
        outline-none
        transition-all
        focus:border-[#5F8F3C]
        focus:ring-4
        focus:ring-[#B7F36B]/30"
      />
    </div>
  );
}
