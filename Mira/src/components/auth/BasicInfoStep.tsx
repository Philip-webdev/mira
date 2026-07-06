import { motion } from "framer-motion";

import GlassInput from "./GlassInput";
import PasswordInput from "./PasswordInput";
import SignupButtons from "./SignupButtons";
import { UserRole } from "@/context/AuthContext";

interface Props {
  userRole: UserRole;
  formData: {
    email: string;
    name: string;
    password: string;
    confirmPassword: string;
    partnerID?: string;
    accountNumber?: string;
    bankCode?: string;
    accountName?: string;
  };

  errors: Record<string, string>;

  onChange: (field: string, value: string) => void;

  onBack: () => void;
  onNext: () => void;
}

export default function BasicInfoStep({
  formData,
  errors,
  onChange,
  onBack,
  onNext,
  userRole,
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
        <h2 className="text-xl font-bold text-[rgb(24,11,40)]">
          Create your account
        </h2>

        <p className="mt-2 text-gray-500">Tell us a little about yourself.</p>
      </div>

      {/* Email */}

      {userRole === "student" && (
        <>
          <GlassInput
            type="email"
            placeholder="Enter your email address"
            value={formData.email}
            onChange={(e) => onChange("email", e.target.value)}
            error={errors.email}
          />

          {/* Full Name */}

          <GlassInput
            placeholder="Full name"
            value={formData.name}
            onChange={(e) => onChange("name", e.target.value)}
            error={errors.name}
          />

          {/* Password */}

          <PasswordInput
            placeholder="Password"
            value={formData.password}
            onChange={(e) => onChange("password", e.target.value)}
            error={errors.password}
          />

          {/* Confirm Password */}

          <PasswordInput
            placeholder="Confirm password"
            value={formData.confirmPassword}
            onChange={(e) => onChange("confirmPassword", e.target.value)}
            error={errors.confirmPassword}
          />
        </>
      )}
       {userRole === "merchant" && (
        <>
          <GlassInput
            type="email"
            placeholder="Enter your email address"
            value={formData.email}
            onChange={(e) => onChange("email", e.target.value)}
            error={errors.email}
          />

          {/* Full Name */}

          <GlassInput
            placeholder="Full name"
            value={formData.name}
            onChange={(e) => onChange("name", e.target.value)}
            error={errors.name}
          />

          {/* Password */}

          <PasswordInput
            placeholder="Password"
            value={formData.password}
            onChange={(e) => onChange("password", e.target.value)}
            error={errors.password}
          />

          {/* Confirm Password */}

          <PasswordInput
            placeholder="Confirm password"
            value={formData.confirmPassword}
            onChange={(e) => onChange("confirmPassword", e.target.value)}
            error={errors.confirmPassword}
          />
        </>
      )}

       {userRole === "admin" && (
        <>
         <GlassInput
            type="text"
            placeholder="Partner ID eg. COLERM"
            value={formData.partnerID}
            onChange={(e) => onChange("partnerID", e.target.value)}
            error={errors.partnerID}
          />

          <GlassInput
            type="email"
            placeholder="Partner Email"
            value={formData.email}
            onChange={(e) => onChange("email", e.target.value)}
            error={errors.email}
          />

          {/* Full Name */}

          <GlassInput
            placeholder="Partner College. eg. College of ..."
            value={formData.name}
            onChange={(e) => onChange("name", e.target.value)}
            error={errors.name}
          />

          {/* Password */}

          <PasswordInput
            placeholder="Password"
            value={formData.password}
            onChange={(e) => onChange("password", e.target.value)}
            error={errors.password}
          />

          {/* Confirm Password */}

          <PasswordInput
            placeholder="Confirm password"
            value={formData.confirmPassword}
            onChange={(e) => onChange("confirmPassword", e.target.value)}
            error={errors.confirmPassword}
          />
        </>
      )}

      {/* Buttons */}

      <SignupButtons back={onBack} next={onNext} />
    </motion.div>
  );
}
