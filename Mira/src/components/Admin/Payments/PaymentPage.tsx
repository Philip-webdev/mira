import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import { adminConfig } from "@/data/adminConfig";
import PaymentsHeader from "./PaymentsHeader";
import PaymentSkeleton from "./PaymentSkeleton";
import PaymentsStats from "./PaymentsStats";
import PaymentFilters from "./PaymentFilters";
import PaymentsTable from "./PaymentTable/PaymentsTable";
import { apiGet } from "@/lib/api";

// import PaymentsHeader from "./PaymentsHeader";
// import PaymentsStats from "./PaymentsStats";
// import PaymentFilters from "./PaymentFilters";
// import PaymentsTable from "./PaymentsTable";
// import PaymentSkeleton from "./PaymentSkeleton";

export default function PaymentsPage() {
  const { college } = useParams();

  const config = adminConfig[college as keyof typeof adminConfig];

  const [loading, setLoading] = useState(true);

  const [payments, setPayments] = useState<any[]>([]);

  const [search, setSearch] = useState("");

  const [level, setLevel] = useState("All");
  const [date, setDate] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 12;

  useEffect(() => {
    async function load() {
      setLoading(true);

      try {
        const data = await apiGet('/api/admin/partner/payments');
        const payments = Array.isArray(data) ? data : data.payments || [];
        setPayments(payments.reverse());
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [college]);

  const filtered = useMemo(() => {
    return payments.filter((payment) => {
      const matchesSearch =
        payment.fullname.toLowerCase().includes(search.toLowerCase()) ||
        payment.reference.toLowerCase().includes(search.toLowerCase()) ||
        payment.matricNumber.toLowerCase().includes(search.toLowerCase());

      const matchesLevel =
        level === "All"
          ? true
          : payment.level === level || payment.fresherLevel === level;

      const matchesDate =
        date === "" ? true : payment.dateOfPayment.startsWith(date);

      return matchesSearch && matchesLevel && matchesDate;
    });
  }, [payments, search, level, date]);

  const exportCSV = () => {
    const headers = [
      "Matric Number",
      "Full Name",
      "Department",
      "Amount",
      "Reference",
      "Date",
    ];

    const rows = filtered.map((payment) => [
      payment.matricNumber,
      payment.fullname,
      payment.department,
      payment.amount,
      payment.reference,
      payment.dateOfPayment,
    ]);

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");

    const blob = new Blob([csv], {
      type: "text/csv",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = `${college}-payments.csv`;

    link.click();

    URL.revokeObjectURL(url);
  };

  const paginated = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  if (loading) return <PaymentSkeleton />;

  return (
    <div className="space-y-8">
      <PaymentsHeader title={config.title} count={filtered.length} />
      <PaymentsStats payments={filtered} />
      <PaymentFilters
        search={search}
        level={level}
        date={date}
        setSearch={setSearch}
        setLevel={setLevel}
        setDate={setDate}
        onExport={exportCSV}
      />
      <PaymentsTable
        payments={filtered}
        page={currentPage}
        pageSize={pageSize}
        setPage={setCurrentPage}
      />
    </div>
  );
}
