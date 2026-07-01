import { DollarSign, Users, CreditCard, AlertCircle } from "lucide-react";

import StatCard from "./StatCard";

interface Props {
  revenue: number;
  users: number;
  volume: number;
}

export default function StatsGrid({ revenue, users, volume }: Props) {
  return (
    <div className="grid gap-6 lg:grid-cols-4">
      <StatCard
        title="Revenue"
        value={revenue}
        prefix="₦"
        icon={DollarSign}
        change="+12%"
      />

      <StatCard title="Payments" value={users} icon={Users} change="+5%" />

      <StatCard title="Pending" value={0} icon={AlertCircle} change="0" />

      <StatCard title="Volume" value={volume} icon={CreditCard} change="+8%" />
    </div>
  );
}
