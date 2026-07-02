import { Clock } from "lucide-react";
import { motion } from "framer-motion";

import TransactionItem from "./TransactionItem";
import EmptyTransactions from "./EmptyTransactions";
import TransactionSkeleton from "./TransactionSkeleton";

interface Props {
  loading: boolean;
  transactions: any[];
}

export default function RecentTransactions({ loading, transactions }: Props) {
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
      p-6
      shadow-xl
      backdrop-blur-xl"
    >
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#180b28]">
            Recent Transactions
          </h2>

          <p className="text-sm text-[#180b28]/60">
            Latest successful payments.
          </p>
        </div>

        <div
          className="
          flex
          h-12
          w-12
          items-center
          justify-center
          rounded-2xl
          bg-[#180b28]/5"
        >
          <Clock />
        </div>
      </div>

      {loading ? (
        <TransactionSkeleton />
      ) : transactions.length === 0 ? (
        <EmptyTransactions />
      ) : (
        <div
          className="
          max-h-[420px]
          space-y-4
          overflow-y-auto
          pr-2"
        >
          {transactions.map((transaction, index) => (
            <TransactionItem
              key={transaction._id}
              transaction={transaction}
              index={index}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}

