import { ArrowUpCircle, Download, Wallet } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

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
  return (
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
  );
}

