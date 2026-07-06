import {
  LayoutDashboard,
  Wallet,
  CreditCard,
  ArrowUpCircle,
  Settings,
  LogOut,
  ShieldCheck,
  Sparkles,
  X,
  Building2,
} from "lucide-react";
import { memo, useEffect } from "react";
import NavItem from "./NavItem";
import { useNavigate, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { adminConfig } from "@/data/adminConfig";
import { clearToken } from "@/lib/api";

interface SidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
}

const Sidebar = memo(({ isOpen, closeSidebar }: SidebarProps) => {
  const navigate = useNavigate();
  const { college } = useParams();

  const base = `/admin/${college ?? "colerm"}`;

  const config = adminConfig[(college as keyof typeof adminConfig) ?? "colerm"];

  const handleLogout = () => {
    clearToken();
    localStorage.removeItem("mira_user");
    localStorage.removeItem("mira_token");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("adminCollege");
    navigate("/login");
  };
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

  const menu = (
    <>
      {/* Header */}
      <motion.div
        initial={{ y: 8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.05 }}
        className="rounded-3xl border border-[#180b28]/10 bg-white/70 p-4 shadow-sm"
      >
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl  text-white">
               <img
            src= '/MiraLogo.png'
            alt="Mira"
            className="w-14 h-14 object-contain"
          />
            </div>

            <div>
             
              <h2 className="text-lg font-semibold text-[#180b28]">
                Admin
              </h2>
            </div>
          </div>

          {/* Mobile Close */}
          <button
            onClick={closeSidebar}
            className="rounded-xl p-2 hover:bg-black/5 lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex items-center gap-2 rounded-2xl bg-[#180b28]/5 px-3 py-2 text-sm text-[#180b28]/70">
          <Sparkles size={14} className="text-[#5f67ac]" />
          <span>{config?.title}</span>
        </div>
      </motion.div>

      {/* Navigation */}
      <div className="mt-6 flex-1">
     

        <div className="space-y-2">
          <NavItem
            title="Dashboard"
            href={`${base}`}
            icon={LayoutDashboard}
            onClick={closeSidebar}
          />

          <NavItem
            title="Balance"
            href={`${base}/balance`}
            icon={Wallet}
            onClick={closeSidebar}
          />

          <NavItem
            title="Payments"
            href={`${base}/payments`}
            icon={CreditCard}
            onClick={closeSidebar}
          />

          <NavItem
            title="Withdrawals"
            href={`${base}/withdrawals`}
            icon={ArrowUpCircle}
            onClick={closeSidebar}
          />

          <NavItem
            title="Bank Settings"
            href={`${base}/bank-settings`}
            icon={Building2}
            onClick={closeSidebar}
          />
        </div>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="rounded-3xl border border-[#180b28]/10 bg-[#180b28] p-4 text-white"
      >
        <p className="text-sm font-semibold">{config?.title}</p>

        <p className="mt-1 text-sm text-white/70">
          Secure dashboard for your college operations.
        </p>

        <button
          onClick={handleLogout}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-3 py-2.5 transition hover:bg-white/20"
        >
          <LogOut size={16} />
          Logout
        </button>
      </motion.div>
    </>
  );

  return (
    <>
      {/* ---------------- Desktop Sidebar ---------------- */}

      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-[288px] flex-col border-r border-[#180b28]/10 bg-[radial-gradient(circle_at_top_left,_rgba(95,103,172,0.24),_transparent_45%),linear-gradient(135deg,_rgba(255,255,255,0.92),_rgba(248,247,255,0.9))] px-5 py-6 shadow-[20px_0_60px_rgba(24,11,40,0.12)] backdrop-blur-2xl lg:flex">
        {menu}
      </aside>

      {/* ---------------- Mobile Sidebar ---------------- */}

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeSidebar}
              className="fixed inset-0 z-40 bg-black/45 backdrop-blur-sm lg:hidden"
            />

            {/* Sidebar */}

            <motion.aside
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{
                type: "spring",
                stiffness: 280,
                damping: 30,
              }}
              className="fixed left-0 top-0 z-50 flex h-screen w-[288px] flex-col border-r border-[#180b28]/10 bg-[radial-gradient(circle_at_top_left,_rgba(95,103,172,0.24),_transparent_45%),linear-gradient(135deg,_rgba(255,255,255,0.92),_rgba(248,247,255,0.9))] px-5 py-6 shadow-2xl backdrop-blur-2xl lg:hidden"
            >
              {menu}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
});

Sidebar.displayName = "Sidebar";

export default Sidebar;

