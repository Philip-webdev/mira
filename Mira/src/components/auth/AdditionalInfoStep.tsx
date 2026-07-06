import { motion } from "framer-motion";

import GlassInput from "./GlassInput";
import SignupButtons from "./SignupButtons";

import { UserRole } from "@/context/AuthContext";

interface Props {
  userRole: UserRole;

  formData: {
    phone: string;
    institution: string;
    businessName: string;
    businessCategory: string;
    accountNumber: string;
    bankCode: string;
    accountName: string;
  };

  errors: Record<string, string>;

  onChange: (field: string, value: string) => void;

  onBack: () => void;

  onSubmit?: () => Promise<void> | void;

  loading?: boolean;
}

export default function AdditionalInfoStep({
  userRole,
  formData,
  errors,
  onChange,
  onBack,
  onSubmit,
  loading,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.35 }}
      className="space-y-6"
    >
      {/* Heading */}

      <div>
        <h2 className="text-xl font-bold text-[rgb(24,11,40)]">Almost there</h2>

        <p className="mt-2 text-gray-500">Complete your profile to continue.</p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit && onSubmit();
        }}
        className="space-y-6"
      >
        {/* Phone */}

        {userRole !== "admin" && (
          <GlassInput
            type="tel"
            placeholder="Phone number"
            value={formData.phone}
            error={errors.phone}
            onChange={(e) => onChange("phone", e.target.value)}
          />
        )}

        {/* Student */}

        {userRole === "student" && (
          <GlassInput
            placeholder="Institution"
            value={formData.institution}
            error={errors.institution}
            onChange={(e) => onChange("institution", e.target.value)}
          />
        )}

        {/* Merchant */}

        {userRole === "merchant" && (
          <>
            <GlassInput
              placeholder="Business name"
              value={formData.businessName}
              error={errors.businessName}
              onChange={(e) => onChange("businessName", e.target.value)}
            />

            <div>
              <select
                value={formData.businessCategory}
                onChange={(e) => onChange("businessCategory", e.target.value)}
                className="
                w-full
                h-14
                rounded-xl
                px-5

                bg-white/35
                backdrop-blur-4xl
                backdrop-saturate-150

                border-0

                shadow-[0_8px_32px_rgba(31,38,135,0.08)]

                text-[rgb(24,11,40)]

                focus:outline-none
                focus:ring-0
                focus-visible:ring-0

                transition-all
                duration-300
              "
              >
                <option value="">Select business category</option>

                <option value="Retail">Retail</option>

                <option value="Food">Food & Beverage</option>

                <option value="Services">Services</option>

                <option value="Technology">Technology</option>

                <option value="Others">Others</option>
              </select>

              {errors.businessCategory && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.businessCategory}
                </p>
              )}
            </div>
          </>
        )}

        {/* Admin */}

        {userRole === "admin" && (
          <>
            {/* <GlassInput
          placeholder="Institution name"
          value={formData.institution}
          error={errors.institution}
          onChange={(e) => onChange("institution", e.target.value)}
        /> */}
            <GlassInput
              placeholder="Account number"
              value={formData.accountNumber}
              error={errors.accountNumber}
              onChange={(e) => onChange("accountNumber", e.target.value)}
            />
            <GlassInput
              placeholder="Bank code"
              value={formData.bankCode}
              error={errors.bankCode}
              onChange={(e) => onChange("bankCode", e.target.value)}
            />
            <GlassInput
              placeholder="Account name"
              value={formData.accountName}
              error={errors.accountName}
              onChange={(e) => onChange("accountName", e.target.value)}
            />
          </>
        )}

        {/* Buttons */}

        <SignupButtons back={onBack} submit loading={loading} next={onSubmit} />
      </form>
    </motion.div>
  );
}
