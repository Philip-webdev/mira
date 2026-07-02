import { motion } from "framer-motion";

import SearchBar from "./Filters/SearchBar";
import LevelFilter from "./Filters/LevelFilter";
import DateFilter from "./Filters/DateFilter";
import ExportButton from "./Filters/ExportButton";

interface Props {
  search: string;
  level: string;
  date: string;

  setSearch: (value: string) => void;
  setLevel: (value: string) => void;
  setDate: (value: string) => void;

  onExport: () => void;
}

export default function PaymentFilters({
  search,
  level,
  date,
  setSearch,
  setLevel,
  setDate,
  onExport,
}: Props) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="
      rounded-3xl
      border
      border-[#180b28]/10
      bg-white/70
      p-5
      backdrop-blur-xl
      shadow-lg"
    >
      <div className="flex flex-wrap gap-4">
        <SearchBar value={search} onChange={setSearch} />

        <LevelFilter value={level} onChange={setLevel} />

        <DateFilter value={date} onChange={setDate} />

        <ExportButton onExport={onExport} />
      </div>
    </motion.div>
  );
}

