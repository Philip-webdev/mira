import { motion } from "framer-motion";

import Illustration from "@/assets/download__1_-removebg-preview.png";
import Rocket from "@/assets/Rocket_design-removebg-preview.png";

export default function AuthHero() {
  return (
    <div className="relative px-12 py-12 flex flex-col justify-between">
      {/* Radial Gradient Background */}
      

      {/* Content */}
      <div className="z-10">
        <div
        className="absolute -top-1/2 -left-1/2 lg:-top-14 lg:left-10 w-[600px] h-[600px] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(4,173,183,0.2) 0%, rgba(4,173,183,0.11) 35%, rgba(248,245,238,0) 75%)",
        }}
      />
        <h1 className="mt-6 text-5xl font-black leading-tight text-[rgb(4,173,183)]">
          Welcome
          <span className="block text-[rgb(4,173,183)]">to Mira</span>
        </h1>

        <p className="mt-2 max-w-xs text-gray-500 text-base leading-8">
          Campus payments, receipts, food, tickets all in one.
        </p>
      </div>

      <motion.img
        src={Illustration}
        alt=""
        className="absolute top-60 left-44 lg:top-64 lg:left-36 z-10 w-[200px] lg:w-[320px] mx-auto"
      />
      <motion.img
        src={Rocket}
        alt=""
        className="absolute -top-20 left-48 lg:top-20 lg:right-10 z-10 w-[130px] lg:w-[200px] mx-auto"
      />
    </div>
  );
}
