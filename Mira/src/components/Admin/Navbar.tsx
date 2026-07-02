import { Bell, Search, Menu, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { adminConfig } from "@/data/adminConfig";
import { useParams } from "react-router-dom";
import { memo } from "react";

interface Props {
  toggleSidebar: () => void;
}

const Navbar = memo(({ toggleSidebar }: Props) => {
  const { college } = useParams();
  const config = adminConfig[college as keyof typeof adminConfig];

  return (
    <motion.header
      initial={{ y: -8, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35 }}
      className="mb-6 rounded-[28px] border border-white/70 bg-white/70 px-4 py-4 shadow-[0_12px_45px_rgba(24,49,29,0.08)] backdrop-blur-xl sm:px-6"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <motion.button
            whileTap={{ scale: 0.92 }}
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.3 }}
            onClick={toggleSidebar}
            className="
        lg:hidden

        flex
        items-center
        justify-center

        h-11
        w-11

        rounded-2xl
        bg-white/80
        text-[#180b28]
        border

        shadow-sm
    "
          >
            <Menu size={20} />
          </motion.button>

          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-[#180b28]/60">
              <Sparkles size={14} className="text-[#5f67ac]" />
              Admin portal
            </div>
            <h1 className="text-2xl font-semibold text-[#180b28] sm:text-3xl">
              Dashboard
            </h1>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#180b28]/40"
              size={16}
            />
            <input
              placeholder="Search payments..."
              className="h-11 w-full rounded-2xl border border-[#180b28]/10 bg-white/80 pl-10 pr-4 text-sm text-[#180b28] outline-none transition focus:border-[#b8bcef] focus:ring-2 focus:ring-[#b8bcef]/30 sm:w-[260px]"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.04, rotate: 4 }}
            whileTap={{ scale: 0.97 }}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#180b28]/10 bg-white/80 text-[#180b28] shadow-sm"
          >
            <Bell size={18} />
          </motion.button>

          <div className="flex items-center gap-3 rounded-2xl border border-[#180b28]/10 bg-white/80 px-3 py-2 shadow-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#180b28] to-[#5f67ac] text-sm font-semibold text-white">
              {config?.variant?.slice(0, 2).toUpperCase() ?? "AD"}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#180b28]">
                {config?.title ?? "College Admin"}
              </h3>
              <p className="text-xs text-[#180b28]/60">Administrator</p>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
});

Navbar.displayName = "Navbar";
export default Navbar;

