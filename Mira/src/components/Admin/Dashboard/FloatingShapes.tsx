import { motion } from "framer-motion";

export default function FloatingShapes() {
  return (
    <>
      <motion.div
        animate={{
          y: [0, -25, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 7,
        }}
        className="absolute left-10 top-10 h-56 w-56 rounded-full bg-[#b8bcef]/20 blur-[120px]"
      />

      <motion.div
        animate={{
          y: [0, 25, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 8,
        }}
        className="absolute right-20 bottom-0 h-64 w-64 rounded-full bg-[#180b28]/10 blur-[120px]"
      />
    </>
  );
}

