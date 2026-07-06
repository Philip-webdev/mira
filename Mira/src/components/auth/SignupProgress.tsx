import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface Props {
  currentStep: number;
}

export default function SignupProgress({ currentStep }: Props) {
  const steps = [1, 2, 3];

  return (
    <div className="flex items-center justify-center gap-4 py-8  mt-5">
      {steps.map((step, index) => {
        const active = step === currentStep;
        const completed = step < currentStep;

        return (
          <div key={step} className="flex items-center">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{
                scale: active ? 1.08 : 1,
              }}
              transition={{
                type: "spring",
                stiffness: 250,
              }}
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300
              
              ${
                completed
                  ? "bg-[rgb(4,173,183)] text-white"
                  : active
                    ? "bg-[rgb(4,173,183)]/15 border border-[rgb(4,173,183)] text-[rgb(4,173,183)]"
                    : "bg-white/35 text-gray-400"
              }
              
              backdrop-blur-3xl
              shadow-[0_8px_32px_rgba(31,38,135,0.08)]
              `}
            >
              {completed ? <Check size={18} /> : step}
            </motion.div>

            {index < steps.length - 1 && (
              <div
                className={`w-14 lg:w-20 h-[2px] mx-2 transition-all duration-300
                ${completed ? "bg-[rgb(4,173,183)]" : "bg-gray-200"}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
