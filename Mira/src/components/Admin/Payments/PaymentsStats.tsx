import { CreditCard, DollarSign, Wallet, TrendingUp } from "lucide-react";

import PaymentStatCard from "./PaymentStatCard";

interface Props {
  payments: any[];
}

export default function PaymentsStats({ payments }: Props) {
  const revenue = payments.reduce(
    (sum, payment) => sum + Number(payment.amount),
    0,
  );

  const average = payments.length > 0 ? revenue / payments.length : 0;

  const highest =
    payments.length > 0
      ? Math.max(...payments.map((x) => Number(x.amount)))
      : 0;

  const completed = payments.filter(
    (p) => p.paymentStatus === "completed",
  ).length;

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      <PaymentStatCard
        title="Total Revenue"
        value={revenue}
        prefix="₦"
        icon={DollarSign}
        trend="+18%"
        positive
        iconBg="linear-gradient(135deg,#18311D,#5F8F3C)"
      />

      <PaymentStatCard
        title="Completed Payments"
        value={completed}
        icon={CreditCard}
        trend="+8%"
        positive
        iconBg="linear-gradient(135deg,#5F8F3C,#B7F36B)"
      />

      <PaymentStatCard
        title="Average Payment"
        value={average}
        prefix="₦"
        icon={Wallet}
        trend="+4%"
        positive
        iconBg="linear-gradient(135deg,#18311D,#23432D)"
      />

      <PaymentStatCard
        title="Highest Payment"
        value={highest}
        prefix="₦"
        icon={TrendingUp}
        trend="+11%"
        positive
        iconBg="linear-gradient(135deg,#5F8F3C,#18311D)"
      />
    </div>
  );
}
