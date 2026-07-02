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
        iconBg="linear-gradient(135deg,#180b28,#5f67ac)"
      />

      <PaymentStatCard
        title="Completed Payments"
        value={completed}
        icon={CreditCard}
        trend="+8%"
        positive
        iconBg="linear-gradient(135deg,#5f67ac,#b8bcef)"
      />

      <PaymentStatCard
        title="Average Payment"
        value={average}
        prefix="₦"
        icon={Wallet}
        trend="+4%"
        positive
        iconBg="linear-gradient(135deg,#180b28,#241436)"
      />

      <PaymentStatCard
        title="Highest Payment"
        value={highest}
        prefix="₦"
        icon={TrendingUp}
        trend="+11%"
        positive
        iconBg="linear-gradient(135deg,#5f67ac,#180b28)"
      />
    </div>
  );
}

