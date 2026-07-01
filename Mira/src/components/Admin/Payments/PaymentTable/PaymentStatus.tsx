interface Props {
  status: string;
}

export default function PaymentStatus({ status }: Props) {
  const completed = status === "completed";

  return (
    <div
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold
      ${
        completed
          ? "bg-emerald-100 text-emerald-700"
          : "bg-yellow-100 text-yellow-700"
      }`}
    >
      {completed ? "Completed" : "Pending"}
    </div>
  );
}
