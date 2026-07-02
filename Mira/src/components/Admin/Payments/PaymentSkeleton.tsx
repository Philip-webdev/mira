import { motion } from "framer-motion";

const shimmer =
  "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent";

export default function PaymentSkeleton() {
  return (
    <div className="space-y-8">
      {/* Hero */}
      <div
        className={`rounded-3xl border border-[#180b28]/10 bg-white/70 p-8 backdrop-blur-xl shadow-xl ${shimmer}`}
      >
        <div className="h-4 w-40 rounded-full bg-[#180b28]/10" />

        <div className="mt-4 h-10 w-72 rounded-xl bg-[#180b28]/10" />

        <div className="mt-4 h-4 w-80 rounded-full bg-[#180b28]/10" />
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.08 }}
            className={`rounded-3xl border border-[#180b28]/10 bg-white/70 p-6 backdrop-blur-xl shadow-lg ${shimmer}`}
          >
            <div className="flex items-center justify-between">
              <div className="h-3 w-24 rounded-full bg-[#180b28]/10" />

              <div className="h-10 w-10 rounded-2xl bg-[#180b28]/10" />
            </div>

            <div className="mt-8 h-8 w-28 rounded-xl bg-[#180b28]/10" />

            <div className="mt-4 h-3 w-32 rounded-full bg-[#180b28]/10" />
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div
        className={`rounded-3xl border border-[#180b28]/10 bg-white/70 p-5 backdrop-blur-xl shadow-lg ${shimmer}`}
      >
        <div className="flex flex-wrap gap-4">
          <div className="h-12 flex-1 rounded-2xl bg-[#180b28]/10" />

          <div className="h-12 w-44 rounded-2xl bg-[#180b28]/10" />

          <div className="h-12 w-44 rounded-2xl bg-[#180b28]/10" />

          <div className="h-12 w-40 rounded-2xl bg-[#180b28]/10" />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-3xl border border-[#180b28]/10 bg-white/70 backdrop-blur-xl shadow-xl">
        {/* Header */}
        <div className="grid grid-cols-6 gap-6 border-b border-[#180b28]/10 px-6 py-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-3 rounded-full bg-[#180b28]/10" />
          ))}
        </div>

        {/* Rows */}
        {[...Array(8)].map((_, row) => (
          <motion.div
            key={row}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: row * 0.04 }}
            className={`grid grid-cols-6 gap-6 border-b border-[#180b28]/5 px-6 py-5 ${shimmer}`}
          >
            {/* Student */}
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-[#180b28]/10" />

              <div className="space-y-2">
                <div className="h-3 w-28 rounded-full bg-[#180b28]/10" />

                <div className="h-3 w-20 rounded-full bg-[#180b28]/10" />
              </div>
            </div>

            <div className="h-3 w-20 self-center rounded-full bg-[#180b28]/10" />

            <div className="h-3 w-24 self-center rounded-full bg-[#180b28]/10" />

            <div className="h-3 w-16 self-center rounded-full bg-[#180b28]/10" />

            <div className="h-8 w-24 self-center rounded-full bg-[#180b28]/10" />

            <div className="h-3 w-16 self-center rounded-full bg-[#180b28]/10" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

