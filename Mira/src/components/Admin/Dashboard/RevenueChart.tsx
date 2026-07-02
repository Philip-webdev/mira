import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip } from "recharts";

import { motion } from "framer-motion";

interface Props {
  data: {
    month: string;
    revenue: number;
  }[];
}

export default function RevenueChart({ data }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl
bg-white/70
border
border-[#180b28]/10
p-6
backdrop-blur-xl
shadow-xl"
    >
      <h2 className="text-xl font-semibold mb-6">Revenue Analytics</h2>

      <div className="h-[320px]">
        <ResponsiveContainer>
          <AreaChart data={data}>
            <XAxis dataKey="month" />

            <Tooltip />

            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#180b28"
              fill="#b8bcef"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

