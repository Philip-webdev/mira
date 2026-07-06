import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUpCircle, ArrowLeft, CheckCircle, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { apiPost } from "@/lib/api";

export default function WithdrawPage() {
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await apiPost("/api/admin/partner/withdraw", { amount: numAmount });
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Withdrawal failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#180b28]/10 bg-white/70 text-[#180b28] backdrop-blur-xl transition hover:bg-white/90"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-[#180b28]">Withdraw</h1>
          <p className="text-sm text-[#180b28]/60">Transfer funds to your bank account</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {success ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative overflow-hidden rounded-3xl border border-[#180b28]/10 bg-white/70 p-10 text-center backdrop-blur-xl shadow-lg"
          >
            <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-green-100/50 blur-3xl" />
            <div className="relative">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-green-600 text-white shadow-lg">
                <CheckCircle size={36} />
              </div>
              <h2 className="mt-6 text-2xl font-bold text-[#180b28]">Withdrawal Initiated</h2>
              <p className="mt-2 text-[#180b28]/60">
                Your withdrawal of <span className="font-semibold text-[#180b28]">₦{parseFloat(amount).toLocaleString()}</span> has been submitted for processing.
              </p>
              <div className="mt-8 flex gap-3 justify-center">
                <button
                  onClick={() => navigate("/admin/withdrawals")}
                  className="rounded-2xl border border-[#180b28]/10 bg-white/70 px-6 py-3 text-sm font-semibold text-[#180b28] backdrop-blur-xl transition hover:bg-white/90"
                >
                  View History
                </button>
                <button
                  onClick={() => navigate(-1)}
                  className="rounded-2xl bg-gradient-to-r from-[#180b28] to-[#5f67ac] px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:shadow-xl"
                >
                  Back
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="relative overflow-hidden rounded-3xl border border-[#180b28]/10 bg-white/70 p-8 backdrop-blur-xl shadow-lg"
          >
            <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-[#b8bcef]/20 blur-3xl" />
            <div className="relative">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#180b28] to-[#5f67ac] text-white shadow-lg">
                  <ArrowUpCircle size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#180b28]">Initiate Withdrawal</h2>
                  <p className="text-xs text-[#180b28]/60">Funds will be sent to your registered bank account</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#180b28]">Amount (₦)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#180b28]/40 font-semibold">₦</span>
                    <input
                      type="number"
                      min="1"
                      step="0.01"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => { setAmount(e.target.value); setError(null); }}
                      required
                      className="w-full rounded-2xl border border-[#180b28]/10 bg-white/80 py-3.5 pl-10 pr-4 text-[#180b28] outline-none transition focus:border-[#b8bcef] focus:ring-2 focus:ring-[#b8bcef]/30 text-lg font-semibold"
                    />
                  </div>
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="rounded-2xl border border-red-200 bg-red-50 px-5 py-3 text-sm text-red-700"
                    >
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-2xl bg-gradient-to-r from-[#180b28] to-[#5f67ac] py-3.5 text-sm font-bold text-white shadow-lg transition hover:shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} />
                      Submit Withdrawal
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
