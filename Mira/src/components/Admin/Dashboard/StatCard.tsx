import { motion } from "framer-motion";
import AnimatedCounter from "./AnimatedCounter";
import { TrendingUp } from "lucide-react";

interface Props {
  title: string;
  value: number;
  icon: any;
  prefix?: string;
  change: string;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  prefix,
  change,
}: Props) {
  return (
    <motion.div
      whileHover={{
        y: -8,
        scale: 1.03,
      }}
      transition={{
        type: "spring",
        stiffness: 250,
      }}
      className="relative overflow-hidden rounded-3xl border border-[#18311D]/10 bg-white/70 p-6 backdrop-blur-xl shadow-lg"
    >
      <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-[#B7F36B]/20 blur-3xl" />

      <div className="flex justify-between">
        <div>
          <p className="text-sm text-[#18311D]/60">{title}</p>

          <h2 className="mt-2 text-3xl font-bold text-[#18311D]">
            <AnimatedCounter value={value} prefix={prefix} />
          </h2>

          <div className="mt-3 flex items-center gap-2 text-sm text-green-600">
            <TrendingUp size={15} />

            {change}
          </div>
        </div>

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#18311D] to-[#5F8F3C] text-white shadow-lg">
          <Icon />
        </div>
      </div>
    </motion.div>
  );
}
