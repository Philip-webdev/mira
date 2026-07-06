import { ArrowUpCircle, Download, Wallet, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { apiPost } from "@/lib/api";

const actions = [
  {
    title: "Withdraw",
    icon: ArrowUpCircle,
    route: "withdraw",
  },

  {
    title: "Export CSV",
    icon: Download,
    route: "payments"
  },

  {
    title: "Balance",
    icon: Wallet,
    route: "balance"
  },
];

export default function QuickActions() {
  const navigate = useNavigate();
  const [reconciling, setReconciling] = useState(false);

  const handleReconcile = async () => {
    setReconciling(true);
    try {
      await apiPost("/api/admin/reconcile");
      alert("Reconciliation triggered successfully");
    } catch (err: any) {
      alert(err.message || "Reconciliation failed");
    } finally {
      setReconciling(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-5 lg:grid-cols-3">
        {actions.map((item, index) => (
          <motion.button
            whileHover={{
              scale: 1.03,
            }}
            whileTap={{
              scale: 0.98,
            }}
            key={index}
            className="flex items-center gap-4 rounded-3xl shadow-lg rounded-3xl border border-[#180b28]/10 bg-white/70 p-6 backdrop-blur-xl"
            onClick={() => navigate(item.route)}
          >
            <div className="rounded-2xl bg-[#180b28] p-4 text-white">
              <item.icon />
            </div>

            <div className="text-left">
              <h3 className="font-semibold text-gray-800">{item.title}</h3>

              <p className="text-sm text-gray-500">Quick access</p>
            </div>
          </motion.button>
        ))}
      </div>
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        disabled={reconciling}
        className="flex items-center gap-4 rounded-3xl shadow-lg border border-[#180b28]/10 bg-white/70 p-6 backdrop-blur-xl w-full"
        onClick={handleReconcile}
      >
        <div className="rounded-2xl bg-[#180b28] p-4 text-white">
          <RefreshCw className={reconciling ? "animate-spin" : ""} />
        </div>
        <div className="text-left">
          <h3 className="font-semibold text-gray-800">{reconciling ? "Reconciling..." : "Reconcile"}</h3>
          <p className="text-sm text-gray-500">Sync gateway balances</p>
        </div>
      </motion.button>
    </div>
  );
}

