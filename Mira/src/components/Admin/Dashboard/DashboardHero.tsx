import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface Props {
  title: string;
  image: string;
}

export default function DashboardHero({ title, image }: Props) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="relative overflow-hidden rounded-[36px] h-[340px] shadow-2xl"
    >
      <img
        src={image}
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-[#18311D]/90 via-[#18311D]/60 to-transparent" />

      <div className="absolute inset-0 backdrop-blur-[2px]" />

      <div className="relative flex h-full flex-col justify-end p-10 text-white">
        <div className="mb-4 flex w-fit items-center gap-2 rounded-full bg-white/10 px-5 py-2 backdrop-blur">
          <Sparkles size={15} />
          Dashboard Overview
        </div>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">{title}</h1>

        <p className="mt-3 max-w-lg text-white/80">
          Monitor payments, revenue, withdrawals and student transactions in
          real time.
        </p>
      </div>
    </motion.div>
  );
}
