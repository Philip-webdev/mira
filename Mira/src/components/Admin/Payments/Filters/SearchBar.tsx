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
        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#180b28]/40"
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
        border-[#180b28]/10
        text-[#180b28]
        bg-white/70
        pl-11
        pr-4
        backdrop-blur-xl
        outline-none
        transition-all
        focus:border-[#5f67ac]
        focus:ring-4
        focus:ring-[#b8bcef]/30"
      />
    </div>
  );
}

