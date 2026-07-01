import { Outlet } from "react-router-dom";
import Sidebar from "@/components/Admin/Sidebar";
import Navbar from "@/components/Admin/Navbar";
import AnimatedBackground from "@/components/Admin/AnimatedBackground";
import useSidebar from "@/hooks/useSidebar";
import { AnimatePresence, motion } from "framer-motion";
import { memo } from "react";

const MemoSidebar = memo(Sidebar);
const MemoNavbar = memo(Navbar);
const MemoAnimatedBackground = memo(AnimatedBackground);

export default function DashboardShell() {
  const { open, toggle, close } = useSidebar();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(183,243,107,0.22),_transparent_32%),linear-gradient(140deg,_#f8fff0_0%,_#f5fbeb_45%,_#ffffff_100%)]">
      <MemoAnimatedBackground />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-8rem] top-[-4rem] h-56 w-56 rounded-full bg-[#B7F36B]/30 blur-3xl" />
        <div className="absolute bottom-[-3rem] right-[-2rem] h-60 w-60 rounded-full bg-[#18311D]/10 blur-3xl" />
      </div>

      <MemoSidebar 
      isOpen={open}
      closeSidebar={close} />

      <div className="relative ml-0 min-h-screen px-3 py-3 sm:px-6 lg:ml-[288px] lg:px-8 lg:py-6">
        <div className="rounded-[32px] border border-white/70 bg-white/60 p-3 shadow-[0_18px_80px_rgba(24,49,29,0.08)] backdrop-blur-2xl sm:p-5 lg:p-6">
          <MemoNavbar toggleSidebar={toggle} />

          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
