import { motion } from "framer-motion";

import PaymentEmpty from "./PaymentEmpty";
import PaymentPagination from "./PaymentPagination";
import PaymentRow from "./PaymentRow";

interface Props {
  payments: any[];

  page: number;

  pageSize: number;

  setPage: (page: number) => void;
}

export default function PaymentsTable({
  payments,
  page,
  pageSize,
  setPage,
}: Props) {
  const pages = Math.ceil(payments.length / pageSize);

  const paginated = payments.slice((page - 1) * pageSize, page * pageSize);

  if (!payments.length) {
    return <PaymentEmpty />;
  }

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
      overflow-hidden
      rounded-3xl
      border
      border-[#180b28]/10
      bg-white/70
      backdrop-blur-xl
      shadow-xl"
    >
      <div className="overflow-auto">
        <table className="min-w-full text-[#180b28]/80">
          <thead className="sticky top-0 bg-white/90 backdrop-blur-xl z-10">
            <tr className="text-left">
              <th className="px-6 py-5">Matric No</th>

              <th className="px-6 py-5">Student</th>

              <th className="px-6 py-5">Department</th>

              <th className="px-6 py-5">Amount</th>

              <th className="px-6 py-5">Level</th>

              <th className="px-6 py-5">Status</th>

              <th className="px-6 py-5">Date</th>
            </tr>
          </thead>

          <tbody>
            {paginated.map((payment, index) => (
              <PaymentRow key={payment._id} payment={payment} index={index} />
            ))}
          </tbody>
        </table>
      </div>

      <PaymentPagination
        page={page}
        pages={pages}
        onNext={() => setPage(Math.min(page + 1, pages))}
        onPrevious={() => setPage(Math.max(page - 1, 1))}
      />
    </motion.div>
  );
}

