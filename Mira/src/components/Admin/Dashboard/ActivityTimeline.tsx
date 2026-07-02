import { motion } from "framer-motion";
import { Activity } from "lucide-react";

import ActivityItem from "./ActivityItem";
import ActivitySkeleton from "./ActivitySkeleton";
import EmptyActivity from "./EmptyActivity";

interface Props {
  activities: any[];
  loading: boolean;
}

export default function ActivityTimeline({ activities, loading }: Props) {
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
      backdrop-blur-xl
      shadow-xl"
    >
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#180b28]">Activity Timeline</h2>

          <p className="text-sm text-gray-500">Live payment activity</p>
        </div>

        <div className="flex items-center gap-2 rounded-full bg-green-100 px-3 py-2 text-xs font-medium text-green-700">
          <span className="h-2 w-2 rounded-full bg-green-500 animate-ping" />
          Live
        </div>
      </div>

      {loading ? (
        <ActivitySkeleton />
      ) : activities.length === 0 ? (
        <EmptyActivity />
      ) : (
        <div className="max-h-[520px] overflow-y-auto pr-2">
          {activities.map((activity, index) => (
            <ActivityItem
              key={activity._id}
              activity={activity}
              index={index}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}

