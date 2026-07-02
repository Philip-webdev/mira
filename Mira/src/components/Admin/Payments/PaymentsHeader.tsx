import { motion } from "framer-motion";
import { CreditCard, TrendingUp } from "lucide-react";

interface Props {
  title: string;
  count: number;
}

export default function PaymentsHeader({ title, count }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="
        relative overflow-hidden
        rounded-[32px]
        border border-[#180b28]/10
        bg-white/70
        p-5
        shadow-xl
        backdrop-blur-2xl
        sm:p-6
        lg:p-8
      "
    >
      {/* Decorative Gradient */}
      <div className="absolute -right-24 -top-24 h-52 w-52 rounded-full bg-[#b8bcef]/20 blur-3xl" />
      <div className="absolute -bottom-24 left-0 h-44 w-44 rounded-full bg-[#180b28]/10 blur-3xl" />

      <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        {/* Left */}
        <div className="max-w-2xl">
          <span className="inline-flex items-center rounded-full bg-[#b8bcef]/20 px-3 py-1 text-xs font-semibold text-[#180b28]">
            Payment Management
          </span>

          <h1 className="mt-4 text-3xl font-bold leading-tight text-[#180b28] sm:text-4xl lg:text-5xl">
            {title} Payments
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-7 text-[#180b28]/65 sm:text-base">
            Manage, monitor and export every successful student payment from a
            single dashboard.
          </p>
        </div>

        {/* Right */}
        <motion.div
          whileHover={{
            y: -5,
            scale: 1.02,
          }}
          transition={{
            type: "spring",
            stiffness: 300,
          }}
          className="
            w-full
            rounded-3xl
            bg-gradient-to-br
            from-[#180b28]
            via-[#241436]
            to-[#5f67ac]
            p-5
            text-white
            shadow-2xl
            sm:w-[260px]
            lg:w-[280px]
          "
        >
          <div className="flex items-center justify-between">
            <div className="rounded-2xl bg-white/15 p-3 backdrop-blur-lg">
              <CreditCard size={28} />
            </div>

            <div className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs">
              <TrendingUp size={14} />
              Active
            </div>
          </div>

          <h2 className="mt-8 text-4xl font-bold sm:text-5xl">{count}</h2>

          <p className="mt-2 text-sm text-white/75">
            Total Successful Payments
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

