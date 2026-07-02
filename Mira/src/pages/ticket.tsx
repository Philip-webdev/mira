import { ArrowLeft, TicketIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

function TicketsPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#180b28] px-6 py-8 text-white" style={{ fontFamily: "Sora, sans-serif" }}>
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
        aria-label="Go back"
      >
        <ArrowLeft className="h-5 w-5" />
      </button>
      <div className="mx-auto flex min-h-[78vh] max-w-md flex-col items-center justify-center text-center">
        <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-[#5f67ac]/25 ring-1 ring-white/10">
          <TicketIcon className="h-10 w-10 text-[#d8daf7]" />
        </div>
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#b8bcef]">Mira Tickets</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight">Event tickets are coming soon</h1>
        <p className="mt-3 text-sm leading-6 text-white/65">
          We are preparing a cleaner way to buy, verify, and manage campus event tickets.
        </p>
      </div>
    </div>
  );
}

export default TicketsPage;
