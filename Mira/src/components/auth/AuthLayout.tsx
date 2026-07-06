import { ReactNode } from "react";
import { motion } from "framer-motion";

interface Props {
  left: ReactNode;
  right: ReactNode;
  navbar: ReactNode;
}

export default function AuthLayout({ left, right, navbar }: Props) {
  return (
    <div className="min-h-screen bg-[#F8F5EE] overflow-hidden relative flex items-center justify-center px-6 py-6">
      {/* Decorative blobs */}

      {/* <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-[rgb(4,173,183)]/10 blur-3xl" /> */}

      {/* <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-[rgb(24,11,40)]/5 blur-3xl" /> */}
      {/* <div
        className="absolute inset-0"
        style={{
          background: `
        radial-gradient(circle at 15% 15%, rgba(4,173,183,.18), transparent 35%),
        radial-gradient(circle at 85% 20%, rgba(4,173,183,.10), transparent 30%),
        radial-gradient(circle at 50% 90%, rgba(24,11,40,.06), transparent 40%)
      `,
        }}
      /> */}

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className=" relative
      z-10
      mx-auto
      mt-6
      w-full
      max-w-7xl
      rounded-[36px]
      bg-white/40
      backdrop-blur-[30px]
      backdrop-saturate-150
      shadow-[0_25px_80px_rgba(0,0,0,.08)]"
      >
        {navbar}

        <div className="grid lg:grid-cols-2">
          {left}

          {right}
        </div>
      </motion.div>
    </div>
  );
}
