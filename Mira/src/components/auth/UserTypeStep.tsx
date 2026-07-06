import { motion } from "framer-motion";
import { GraduationCap, Store, ShieldCheck, CheckCircle2 } from "lucide-react";

import { UserRole } from "@/context/AuthContext";
import studentImage from "@/assets/3D_Woman_studying_at_home_illustration-removebg-preview.png";
import merchantImage from "@/assets/merchant-ppl.png";
import adminImage from "@/assets/VAGO-removebg-preview.png";

interface Props {
  selected?: UserRole;

  onSelect: (role: UserRole) => void;
}

const userTypes = [
  {
    id: "student" as UserRole,
    title: "Student",
    description: "Pay school fees and campus bills.",
    image: studentImage,
    icon: GraduationCap,
  },
  {
    id: "merchant" as UserRole,
    title: "Merchant",
    description: "Receive payments from students.",
    image: merchantImage,   
    icon: Store,
  },
  {
    id: "admin" as UserRole,
    title: "Institution",
    description: "Manage campus payments.",
    image: adminImage,
    icon: ShieldCheck,
  },
];

export default function UserTypeStep({ selected, onSelect }: Props) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        x: 40,
      }}
      animate={{
        opacity: 1,
        x: 0,
      }}
      transition={{
        duration: 0.5,
      }}
      className="space-y-5 mt-5"
    >
      <div>
        <h2 className="text-xl font-black text-[rgb(24,11,40)]">
          Create Account
        </h2>

        <p className="mt-2 text-gray-500">Select how you'll use Mira.</p>
      </div>

      {userTypes.map((type) => {
        const Icon = type.icon;

        const active = selected === type.id;

        return (
          <motion.button
            key={type.id}
            whileHover={{
              scale: 1.02,
              y: -2,
            }}
            whileTap={{
              scale: 0.98,
            }}
            transition={{
              type: "spring",
              stiffness: 320,
              damping: 18,
            }}
            onClick={() => onSelect(type.id)}
            type="button"
            className={`
            relative

            w-full

            rounded-2xl

            p-5

            text-left

            bg-white/35

            backdrop-blur-3xl

            shadow-[0_8px_32px_rgba(31,38,135,0.08)]

            transition-all duration-300

            ${active ? "ring-2 ring-[rgb(4,173,183)]" : "hover:bg-white/50"}
            `}
          >
            {active && (
              <CheckCircle2
                size={22}
                className="absolute right-5 top-5 text-[rgb(4,173,183)]"
              />
            )}

            <div className="flex gap-4 items-start">
              {/* <div
                className={`
                rounded-xl

                p-3

                ${
                  active
                    ? "bg-[rgb(4,173,183)] text-white"
                    : "bg-[rgb(4,173,183)]/10 text-[rgb(4,173,183)]"
                }
                `}
              >
                <Icon size={24} />
              </div> */}
                <img src={type.image} alt={type.title} className="w-20 h-20 rounded-lg object-contain" />

              <div>
                <h3 className="font-bold text-base text-[rgb(24,11,40)]">
                  {type.title}
                </h3>

                <p className="mt-1 text-xs text-gray-500">{type.description}</p>
              </div>
            </div>
          </motion.button>
        );
      })}
    </motion.div>
  );
}
