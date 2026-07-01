import { motion } from "framer-motion";
import { CheckCircle2, ArrowUpRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Props {
  activity: any;
  index: number;
}

export default function ActivityItem({ activity, index }: Props) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        x: -20,
      }}
      animate={{
        opacity: 1,
        x: 0,
      }}
      transition={{
        delay: index * 0.07,
      }}
      whileHover={{
        x: 5,
      }}
      className="relative flex gap-5 pb-8"
    >
      {/* Timeline */}

      <div className="relative flex flex-col items-center">
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
          }}
          transition={{
            repeat: Infinity,
            duration: 2,
          }}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100"
        >
          <CheckCircle2 className="text-green-600" size={18} />
        </motion.div>

        <div className="absolute top-10 h-full w-[2px] bg-gradient-to-b from-[#B7F36B] to-transparent" />
      </div>

      <div className="flex-1 rounded-2xl border border-[#18311D]/10 bg-white/60 p-4 backdrop-blur-xl transition-all duration-300 hover:shadow-lg">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-[#18311D]">Payment Received</h3>

          <ArrowUpRight className="text-[#18311D]/40" size={16} />
        </div>

        <p className="mt-2 text-sm font-medium">{activity.fullname}</p>

        <div className="mt-3 flex items-center justify-between">
          <span className="font-bold text-[#18311D]">
            ₦{Number(activity.amount).toLocaleString()}
          </span>

          <span className="text-xs text-gray-500">
            {formatDistanceToNow(new Date(activity.dateOfPayment), {
              addSuffix: true,
            })}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
