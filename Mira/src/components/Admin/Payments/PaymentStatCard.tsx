import { motion } from "framer-motion";
import AnimatedCounter from "./AnimatedCounter";
import TrendBadge from "./TrendBadge";

interface Props {
  title: string;
  value: number;
  icon: any;
  prefix?: string;
  trend: string;
  positive?: boolean;
  iconBg?: string;
}

export default function PaymentStatCard({
  title,
  value,
  icon: Icon,
  prefix,
  trend,
  positive = true,
  iconBg = "#180b28",
}: Props) {
  return (
    <motion.div
      whileHover={{
        y: -6,
        scale: 1.02,
      }}
      transition={{
        type: "spring",
        stiffness: 250,
      }}
      className="
      group
      relative
      overflow-hidden
      rounded-3xl
      border
      border-[#180b28]/10
      bg-white/70
      p-6
      backdrop-blur-xl
      shadow-lg"
    >
      {/* Background Glow */}

      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#b8bcef]/20 blur-3xl transition-all duration-500 group-hover:scale-125" />

      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-sm text-[#180b28]/60">{title}</p>

          <h2 className="mt-2 text-3xl font-bold text-[#180b28]">
            <AnimatedCounter value={value} prefix={prefix} />
          </h2>

          <div className="mt-3">
            <TrendBadge value={trend} positive={positive} />
          </div>
        </div>

        <div
          style={{ background: iconBg }}
          className="
          rounded-2xl
          p-4
          text-white
          shadow-lg"
        >
          <Icon size={26} />
        </div>
      </div>
    </motion.div>
  );
}

