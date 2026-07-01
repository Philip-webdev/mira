import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  value: string;
  positive?: boolean;
}

export default function TrendBadge({ value, positive = true }: Props) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium
      ${positive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
    >
      {positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}

      {value}
    </motion.div>
  );
}
