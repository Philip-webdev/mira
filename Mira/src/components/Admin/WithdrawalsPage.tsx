import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, RefreshCw, ArrowUpCircle, Clock, CheckCircle, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { apiGet } from "@/lib/api";

const statusConfig: Record<string, { icon: any; color: string; bg: string; label: string }> = {
  completed: { icon: CheckCircle, color: "text-green-600", bg: "bg-green-100", label: "Completed" },
  processing: { icon: Clock, color: "text-amber-600", bg: "bg-amber-100", label: "Processing" },
  pending: { icon: Clock, color: "text-blue-600", bg: "bg-blue-100", label: "Pending" },
  failed: { icon: XCircle, color: "text-red-600", bg: "bg-red-100", label: "Failed" },
};

export default function WithdrawalsPage() {
  const navigate = useNavigate();
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWithdrawals = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiGet("/api/admin/partner/withdrawals");
      setWithdrawals(Array.isArray(data) ? data : data.withdrawals || []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch withdrawals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#180b28]/10 bg-white/70 text-[#180b28] backdrop-blur-xl transition hover:bg-white/90"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-[#180b28]">Withdrawal History</h1>
            <p className="text-sm text-[#180b28]/60">Track your withdrawal requests</p>
          </div>
        </div>
        <button
          onClick={fetchWithdrawals}
          disabled={loading}
          className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#180b28]/10 bg-white/70 text-[#180b28] backdrop-blur-xl transition hover:bg-white/90 disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="rounded-2xl border border-red-200 bg-red-50 px-5 py-3 text-sm text-red-700"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse rounded-3xl border border-[#180b28]/10 bg-white/70 p-6 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-5 w-24 rounded-full bg-[#b8bcef]/30" />
                  <div className="h-3 w-32 rounded-full bg-[#b8bcef]/20" />
                </div>
                <div className="h-6 w-20 rounded-full bg-[#b8bcef]/30" />
              </div>
            </div>
          ))}
        </div>
      ) : withdrawals.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl border border-[#180b28]/10 bg-white/70 p-12 text-center backdrop-blur-xl shadow-lg"
        >
          <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-[#b8bcef]/20 blur-3xl" />
          <div className="relative">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#180b28]/5 text-[#180b28]/40">
              <ArrowUpCircle size={32} />
            </div>
            <h3 className="mt-4 text-lg font-bold text-[#180b28]">No Withdrawals Yet</h3>
            <p className="mt-1 text-sm text-[#180b28]/60">Your withdrawal history will appear here</p>
            <button
              onClick={() => navigate("withdraw")}
              className="mt-6 rounded-2xl bg-gradient-to-r from-[#180b28] to-[#5f67ac] px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:shadow-xl"
            >
              Make a Withdrawal
            </button>
          </div>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {withdrawals.map((w: any, i: number) => {
            const status = statusConfig[w.status] || statusConfig.pending;
            const StatusIcon = status.icon;
            return (
              <motion.div
                key={w.id || i}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="relative overflow-hidden rounded-3xl border border-[#180b28]/10 bg-white/70 p-5 backdrop-blur-xl shadow-lg transition hover:shadow-xl"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${status.bg}`}>
                      <StatusIcon size={20} className={status.color} />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-[#180b28]">₦{w.amount?.toLocaleString()}</p>
                      <p className="text-xs text-[#180b28]/60">
                        {w.initiated_at ? new Date(w.initiated_at).toLocaleDateString("en-NG", {
                          year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
                        }) : w.createdAt ? new Date(w.createdAt).toLocaleDateString("en-NG", {
                          year: "numeric", month: "short", day: "numeric"
                        }) : "N/A"}
                      </p>
                    </div>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${status.bg} ${status.color}`}>
                    {status.label}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
