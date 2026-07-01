import { motion } from "framer-motion";

export default function AnimatedBackground() {
  return (
    <>
      <div className="fixed inset-0 -z-10 overflow-hidden bg-[#F5F9F2]">
        <motion.div
          animate={{
            x: [0, 120, 0],
            y: [0, -80, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
          }}
          className="absolute w-[500px] h-[500px]
          bg-[#B7F36B]/20
          blur-[140px]
          rounded-full
          top-[-120px]
          right-[-100px]"
        />

        <motion.div
          animate={{
            x: [0, -120, 0],
            y: [0, 80, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
          }}
          className="absolute w-[600px] h-[600px]
          bg-[#18311D]/10
          blur-[170px]
          rounded-full
          bottom-[-200px]
          left-[-150px]"
        />
      </div>
    </>
  );
}
