import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Wallet, RefreshCw, ArrowLeft, Building2, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { apiGet } from "@/lib/api";

export default function BalancePage() {
  const navigate = useNavigate();
  const [balance, setBalance] = useState<{ ledgerBalance: number; gatewayBalance: number; gateway: string; subAccountId: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiGet("/api/admin/partner/balance");
      setBalance(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch balance");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();
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
            <h1 className="text-2xl font-bold text-[#180b28]">Balance</h1>
            <p className="text-sm text-[#180b28]/60">Overview of your accounts</p>
          </div>
        </div>
        <button
          onClick={fetchBalance}
          disabled={loading}
          className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#180b28]/10 bg-white/70 text-[#180b28] backdrop-blur-xl transition hover:bg-white/90 disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-red-200 bg-red-50 px-5 py-3 text-sm text-red-700"
        >
          {error}
        </motion.div>
      )}

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2].map((i) => (
            <div key={i} className="animate-pulse rounded-3xl border border-[#180b28]/10 bg-white/70 p-8 backdrop-blur-xl">
              <div className="h-4 w-32 rounded-full bg-[#b8bcef]/30" />
              <div className="mt-4 h-10 w-48 rounded-full bg-[#b8bcef]/30" />
              <div className="mt-3 h-3 w-40 rounded-full bg-[#b8bcef]/20" />
            </div>
          ))}
        </div>
      ) : balance ? (
        <div className="grid gap-6 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative overflow-hidden rounded-3xl border border-[#180b28]/10 bg-white/70 p-8 backdrop-blur-xl shadow-lg"
          >
            <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-[#b8bcef]/20 blur-3xl" />
            <div className="relative flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-[#180b28]/60">Internal Ledger Balance</p>
                <h2 className="mt-3 text-4xl font-extrabold text-[#180b28]">
                  ₦{balance.ledgerBalance?.toLocaleString() || "0.00"}
                </h2>
                <p className="mt-2 flex items-center gap-1.5 text-xs text-[#5f67ac]">
                  <Shield size={12} />
                  Double-entry audited
                </p>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#180b28] to-[#5f67ac] text-white shadow-lg">
                <Wallet size={22} />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative overflow-hidden rounded-3xl border border-[#180b28]/10 bg-white/70 p-8 backdrop-blur-xl shadow-lg"
          >
            <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-[#5f67ac]/15 blur-3xl" />
            <div className="relative flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-[#180b28]/60">Gateway Settlement Wallet</p>
                <h2 className="mt-3 text-4xl font-extrabold text-[#180b28]">
                  ₦{balance.gatewayBalance?.toLocaleString() || "0.00"}
                </h2>
                <p className="mt-2 flex items-center gap-1.5 text-xs text-[#5f67ac]">
                  <Building2 size={12} />
                  Via {balance.gateway} ({balance.subAccountId?.slice(0, 8)}...)
                </p>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#5f67ac] to-[#b8bcef] text-white shadow-lg">
                <Building2 size={22} />
              </div>
            </div>
          </motion.div>
        </div>
      ) : null}
    </div>
  );
}
