import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";

interface Props {
  title: string;
  icon: any;
  href: string;
  onClick?: () => void;
}

export default function NavItem({ title, icon: Icon, href, onClick }: Props) {
  const { pathname } = useLocation();
  const active = pathname === href;

  return (
    <Link to={href} onClick={onClick}>
      <motion.div
        whileHover={{ x: 4, scale: 1.01 }}
        transition={{ type: "spring", stiffness: 320, damping: 24 }}
        className={`relative flex items-center gap-3 overflow-hidden rounded-2xl border px-4 py-3.5 transition ${
          active
            ? " bg-[#180b28] text-white  "
            : "border-transparent bg-white/70 text-[#180b28]/80 hover:border-[#5f67ac]/20 hover:bg-[#5f67ac]/15"
        }`}
      >
        {active && (
          <motion.div
            layoutId="active-sidebar"
            className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#180b28] via-[#241436] to-[#5f67ac]"
            transition={{ type: "spring", stiffness: 250, damping: 28 }}
          />
        )}

        <div className="relative z-10 flex items-center gap-3">
          <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${active ? "bg-white/15" : "bg-[#5f67ac]/10"}`}>
            <Icon size={14} />
          </div>
          <span className="font-medium">{title}</span>
        </div>
      </motion.div>
    </Link>
  );
}
