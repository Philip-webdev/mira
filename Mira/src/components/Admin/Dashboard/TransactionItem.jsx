import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function TransactionItem({ transaction, index }) {
  const initials = transaction.fullname
    ?.split(" ")
    .map((name) => name[0])
    .slice(0, 2)
    .join("");

  return (
    <motion.div
      initial={{ opacity: 0, x: -15 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{
        y: -4,
        scale: 1.01,
      }}
      className="
        group
        rounded-2xl
        border
        border-[#180b28]/10
        bg-white/70
        p-4
        backdrop-blur-xl
        transition-all
        hover:shadow-lg
      "
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Left */}
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="
              flex
              h-11
              w-11
              sm:h-12
              sm:w-12
              shrink-0
              items-center
              justify-center
              rounded-2xl
              bg-gradient-to-br
              from-[#180b28]
              to-[#5f67ac]
              font-bold
              text-white
            "
          >
            {initials}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="truncate font-semibold text-[#180b28]">
              {transaction.fullname}
            </h3>

            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs sm:text-sm text-[#180b28]/60">
              <span>{transaction.matricNumber}</span>

              <span className="hidden sm:inline">•</span>

              <span>
                {formatDistanceToNow(new Date(transaction.dateOfPayment), {
                  addSuffix: true,
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center justify-between sm:block sm:text-right">
          <div>
            <h2 className="text-lg font-bold text-[#180b28] sm:text-xl">
              ₦{Number(transaction.amount).toLocaleString()}
            </h2>

            <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-[11px] sm:text-xs font-medium text-green-700">
              <CheckCircle2 size={12} />
              Completed
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

