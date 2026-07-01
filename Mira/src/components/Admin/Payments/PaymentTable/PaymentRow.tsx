import { motion } from "framer-motion";
import { format } from "date-fns";
import PaymentStatus from "./PaymentStatus";

interface Props {
  payment: any;
  index: number;
}

export default function PaymentRow({ payment, index }: Props) {
  return (
    <motion.tr
      initial={{
        opacity: 0,
        y: 10,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        delay: index * 0.03,
      }}
      whileHover={{
        backgroundColor: "rgba(183,243,107,.08)",
      }}
      className="border-b border-[#18311D]/10 last:border-none transition-all"
    >
      <td className="px-6 py-5 font-medium">{payment.matricNumber}</td>

      <td className="px-6 py-5">{payment.fullname}</td>

      <td className="px-6 py-5">{payment.departmentAbbrv}</td>

      <td className="px-6 py-5 font-semibold">
        ₦{Number(payment.amount).toLocaleString()}
      </td>

      <td className="px-6 py-5">
        {payment.level === "None" ? payment.fresherLevel : payment.level}
      </td>

      <td className="px-6 py-5">
        <PaymentStatus status={payment.paymentStatus} />
      </td>

      <td className="px-6 py-5 whitespace-nowrap">
        {format(new Date(payment.dateOfPayment), "dd MMM yyyy")}
      </td>
    </motion.tr>
  );
}
