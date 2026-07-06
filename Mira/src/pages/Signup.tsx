import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

import AuthLayout from "../components/auth/AuthLayout";
import AuthNavbar from "../components/auth/AuthNavbar";
import AuthHero from "../components/auth/AuthHero";

import SignupProgress from "../components/auth/SignupProgress";
import UserTypeStep from "../components/auth/UserTypeStep";
import BasicInfoStep from "../components/auth/BasicInfoStep";
import AdditionalInfoStep from "../components/auth/AdditionalInfoStep";

import { useAuth, UserRole } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface SignupStep {
  step: 1 | 2 | 3;
  userType?: UserRole;
}

export default function Signup() {
  const navigate = useNavigate();

  const { signup, loading } = useAuth();

  const { toast } = useToast();

  const [currentStep, setCurrentStep] = useState<SignupStep>({
    step: 1,
  });

  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    phone: "",
    institution: "",
    businessName: "",
    businessCategory: "",
    partnerID: "",
    accountNumber: "",
    bankCode: "",
    accountName: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };
  const handleSelectRole = (role: UserRole) => {
    setCurrentStep({
      step: 2,
      userType: role,
    });

    setErrors({});
  };
  const validateStep = () => {
    const newErrors: Record<string, string> = {};

    // STEP 2

    if (currentStep.step === 2) {
      if (
        !formData.email ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
      ) {
        newErrors.email = "Enter a valid email.";
      }

      if (formData.name.trim().length < 2) {
        newErrors.name = "Enter your full name.";
      }

      if (formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters.";
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match.";
      }
      if (currentStep.userType === "admin") {
        if (!formData.partnerID) {
          newErrors.partnerID = "Partner ID is required.";
        }
      }
    }

    // STEP 3

    if (currentStep.step === 3) {
      if (formData.phone.length < 10) {
        newErrors.phone = "Enter a valid phone number.";
      }

      if (currentStep.userType === "student" && !formData.institution) {
        newErrors.institution = "Institution is required.";
      }

      if (currentStep.userType === "merchant") {
        if (!formData.businessName) {
          newErrors.businessName = "Business name required.";
        }

        if (!formData.businessCategory) {
          newErrors.businessCategory = "Choose a business category.";
        }
      }

      if (currentStep.userType === "admin") {
         if (!formData.accountNumber) {
          newErrors.accountNumber = "Account number is required.";
         }
         if (!formData.bankCode) {
          newErrors.bankCode = "Bank code is required.";
         }
         if (!formData.accountName) {
          newErrors.accountName = "Account name is required.";
         }
         if(formData.accountNumber && !/^\d{10}$/.test(formData.accountNumber)) {
          newErrors.accountNumber = "Account number must be 10 digits.";
         }
         if(formData.bankCode && !/^\d{3}$/.test(formData.bankCode)) {
          newErrors.bankCode = "Bank code must be 3 digits.";
         }
         if(formData.accountName && formData.accountName.trim().length < 2) {
          newErrors.accountName = "Account name must be at least 2 characters.";
         }
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };
  const handleNext = () => {
    if (!validateStep()) return;

    if (currentStep.step === 2) {
      setCurrentStep({
        step: 3,
        userType: currentStep.userType,
      });
    }
  };

  const handleBack = () => {
    if (currentStep.step === 2) {
      setCurrentStep({ step: 1 });
    }

    if (currentStep.step === 3) {
      setCurrentStep({
        step: 2,
        userType: currentStep.userType,
      });
    }
  };
  const handleSubmit = async () => {
    if (!validateStep()) return;

    setIsLoading(true);

    try {
      await signup({
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        name: formData.name,
        phone: formData.phone,

        role: currentStep.userType ?? "student",

        institution: formData.institution,

        businessName: formData.businessName,

        businessCategory: formData.businessCategory,
        partnerID: formData.partnerID,
        accountNumber: formData.accountNumber,
        bankCode: formData.bankCode,
        accountName: formData.accountName,
      });

      toast({
        title: "Welcome to Mira 🎉",
        description: "Your account has been created successfully.",
      });

      if (currentStep.userType === "admin") {
        navigate("/admin");
      } else {
        navigate("/home");
      }
    } catch (error: any) {
      toast({
        title: "Signup Failed",
        description: error.message ?? "Unable to create your account.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <AuthLayout
      navbar={<AuthNavbar />}
      left={<AuthHero />}
      right={
        <div className="flex items-center justify-center px-10 py-14">
          <div className="w-full max-w-md">
            {currentStep.step > 1 && (
              <SignupProgress currentStep={currentStep.step} />
            )}

            <AnimatePresence mode="wait">
              {currentStep.step === 1 && (
                <UserTypeStep
                  key="user-type"
                  selected={currentStep.userType}
                  onSelect={handleSelectRole}
                />
              )}

              {currentStep.step === 2 && (
                <BasicInfoStep
                  key="basic"
                  userRole={currentStep.userType!}
                  formData={formData}
                  errors={errors}
                  onChange={handleChange}
                  onBack={handleBack}
                  onNext={handleNext}
                />
              )}

              {currentStep.step === 3 && (
                <AdditionalInfoStep
                  key="additional"
                  userRole={currentStep.userType!}
                  formData={{
                    phone: formData.phone,
                    businessName: formData.businessName,
                    businessCategory: formData.businessCategory,
                    institution: formData.institution,
                    accountNumber: formData.accountNumber,
                    bankCode: formData.bankCode,
                    accountName: formData.accountName,
                  }}
                  errors={errors}
                  onChange={handleChange}
                  onBack={handleBack}
                  loading={loading || isLoading}
                  onSubmit={handleSubmit}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      }
    />
  );
}
