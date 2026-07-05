import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { useRef } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

const SHARE_OPTIONS = [
  {
    label: "₦100,000",
    value: 100000,
    equity: "0.5% Stake",
    bonus: "Early supporter access",
  },
  {
    label: "₦200,000",
    value: 200000,
    equity: "1% Stake",
    bonus: "Priority investor updates",
  },
  {
    label: "₦300,000",
    value: 300000,
    equity: "1.5% Stake",
    bonus: "Private investor community",
  },
  {
    label: "₦500,000",
    value: 500000,
    equity: "2% Stake",
    bonus: "Founding investor recognition",
  },
];

const WHATSAPP_NUMBER = "2348166959162";


const SharePurchaseForm = () => {
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    amount: 100000,
  });
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  // const disableButton = useMemo(() => {
  //   if (step === 1) return false;
  //   if (step === 2) {
  //     return (
  //       !formData.fullName.trim() ||
  //       !formData.email.trim() ||
  //       !formData.phone.trim()
  //     );
  //   } else {
  //     return false;
  //   }
  // }, [formData, step]);

  const selectedTier = useMemo(() => {
    return SHARE_OPTIONS.find((x) => x.value === formData.amount);
  }, [formData.amount]);

  const nextStep = () => {
    if (step === 2) {
      const newErrors = {
        fullName: "",
        email: "",
        phone: "",
      };

      if (!formData.fullName.trim()) {
        newErrors.fullName = "Full name is required";
      }

      if (!formData.email.trim()) {
        newErrors.email = "Email address is required";
      } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
      ) {
        newErrors.email = "Enter a valid email address";
      }

      if (!formData.phone.trim()) {
        newErrors.phone = "Phone number is required";
      } else if (formData.phone.length < 11) {
        newErrors.phone = "Enter a valid phone number";
      }

      setErrors(newErrors);

      const hasErrors = Object.values(newErrors).some((value) => value !== "");

      if (hasErrors) return;
    }

    if (step < 3) {
      setStep((prev) => prev + 1);
    }
  };
  const prevStep = () => {
    if (step > 1) setStep((prev) => prev - 1);
  };

  const cardRef = useRef<HTMLDivElement | null>(null);

  // TILT EFFECT
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  const springX = useSpring(rotateX, {
    stiffness: 150,
    damping: 15,
  });

  const springY = useSpring(rotateY, {
    stiffness: 150,
    damping: 15,
  });

  const glowX = useTransform(springY, [-15, 15], ["35%", "65%"]);
  const glowY = useTransform(springX, [-15, 15], ["35%", "65%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();

    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const rotateYValue = ((mouseX - width / 2) / width) * 18;
    const rotateXValue = -((mouseY - height / 2) / height) * 18;

    rotateX.set(rotateXValue);
    rotateY.set(rotateYValue);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };


  const handlePay = async () => {
    // @ts-ignore
    // const NombaPop = window.NombaPop;

    // const handler = NombaPop.setup({
    //   key: Nomba_PUBLIC_KEY,
    //   email: formData.email,
    //   amount: formData.amount * 100,
    //   currency: "NGN",

    //   callback: function (response: any) {
    console.log("Payment successful!", formData);

    const message = `Hello Mira

A new investment payment was completed successfully.

Name: ${formData.fullName}
Email: ${formData.email}
Phone: ${formData.phone}
Investment Amount: ₦${formData.amount.toLocaleString()}`;

    const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      message,
    )}`;
    
    window.open(whatsappURL, "_blank");
    //   },
    // });

    // handler.openIframe();
  };

  return (
    <>
      {/* <script src="https://js.Nomba.co/v1/inline.js"></script> */}

      <div
        className="min-h-screen overflow-hidden relative flex items-center justify-center px-4 py-10"
        style={{
          background: "rgb(201,221,176)",
          fontFamily: "Geom, sans-serif",
        }}
      >
        {/* BACKGROUND LINES */}
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="h-full w-full bg-[linear-gradient(to_right,#a9ba96_1px,transparent_1px)] bg-[size:120px_100%]" />
        </div>

        {/* FLOATING BLOBS */}
        <motion.div
          animate={{
            y: [0, -30, 0],
            x: [0, 20, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
          }}
          className="absolute top-[-150px] right-[-80px] w-[450px] h-[450px] rounded-full bg-[#5f67ac]/20 blur-3xl"
        />

        {/* STACKED CARD */}
        <motion.div
          animate={{
            rotate: -6,
            y: [0, -10, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
          }}
          className="absolute hidden md:block w-[620px] h-[690px] rounded-[38px] bg-white/40 backdrop-blur-sm"
        />

        {/* MAIN CARD */}
        <motion.div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            rotateX: springX,
            rotateY: springY,
            transformStyle: "preserve-3d",
          }}
          initial={{
            opacity: 0,
            y: 40,
            scale: 0.95,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          transition={{
            duration: 0.7,
            ease: "easeOut",
          }}
          className="relative w-full max-w-[560px] rounded-[36px] bg-white px-7 md:px-10 py-8 md:py-10 overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.12)]"
        >
          {/* ANIMATED GLOW */}
          <motion.div
            style={{
              left: glowX,
              top: glowY,
            }}
            className="absolute w-[280px] h-[280px] bg-[#b7f36b]/30 blur-3xl rounded-full pointer-events-none"
          />

          {/* TOP BAR */}
          <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-[#18311d] via-[#7BC043] to-[#18311d]" />

          {/* CLOSE */}
          <motion.button
            whileHover={{
              rotate: 90,
              scale: 1.08,
            }}
            whileTap={{
              scale: 0.9,
            }}
            className="absolute top-6 right-6 w-9 h-9 rounded-full bg-[#f2f2f2] flex items-center justify-center text-[#7d7d7d]"
          >
            <X size={18} />
          </motion.button>

          {/* PROGRESS */}
          <div className="flex gap-2 mb-12 relative z-10">
            {[1, 2, 3].map((item) => (
              <motion.div
                key={item}
                animate={{
                  width: step >= item ? 42 : 30,
                  backgroundColor: step >= item ? "#1d3a22" : "#d9d9d9",
                }}
                transition={{
                  duration: 0.4,
                }}
                className="h-[5px] rounded-full"
              />
            ))}
          </div>

          {/* STEP SWITCHING */}
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{
                  opacity: 0,
                  x: 60,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                exit={{
                  opacity: 0,
                  x: -60,
                }}
                transition={{
                  duration: 0.45,
                }}
                className="relative z-10"
              >
                <div className="uppercase tracking-[0.2em] text-[12px] font-bold text-[#1f3b22] mb-5">
                  Question 01
                </div>

                <h1 className="text-[38px] leading-[1.05] font-semibold text-[#162117] max-w-[420px]">
                  How much would you like to invest into Mira?
                </h1>

                <div className="mt-10">
                  <div className="uppercase text-[12px] tracking-[0.18em] text-[#8f8f8f] font-semibold mb-6">
                    Select only one
                  </div>

                  <div className="space-y-4">
                    {SHARE_OPTIONS.map((option, i) => (
                      <motion.label
                        key={option.value}
                        initial={{
                          opacity: 0,
                          y: 20,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        transition={{
                          delay: i * 0.08,
                        }}
                        whileHover={{
                          y: -4,
                          scale: 1.01,
                        }}
                        className={`group relative flex cursor-pointer items-center justify-between rounded-2xl border px-5 py-5 transition-all duration-300 overflow-hidden ${
                          formData.amount === option.value
                            ? "border-[#7BC043] bg-[#eef8e6]"
                            : "border-[#ececec] bg-white"
                        }`}
                      >
                        {/* HOVER GLOW */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-[radial-gradient(circle_at_top_right,rgba(183,243,107,0.25),transparent_50%)]" />

                        <input
                          type="radio"
                          className="hidden"
                          checked={formData.amount === option.value}
                          onChange={() =>
                            setFormData({
                              ...formData,
                              amount: option.value,
                            })
                          }
                        />

                        <div className="flex items-start gap-4 relative z-10">
                          <motion.div
                            animate={{
                              scale: formData.amount === option.value ? 1.1 : 1,
                            }}
                            className={`mt-1 h-5 w-5 rounded-full border flex items-center justify-center ${
                              formData.amount === option.value
                                ? "border-[#1f3b22]"
                                : "border-[#bdbdbd]"
                            }`}
                          >
                            {formData.amount === option.value && (
                              <motion.div
                                layoutId="radio"
                                className="w-2.5 h-2.5 rounded-full bg-[#1f3b22]"
                              />
                            )}
                          </motion.div>

                          <div>
                            <h3 className="text-[20px] font-semibold text-[#182518]">
                              {option.label}
                            </h3>

                            <div className="flex items-center gap-2 mt-1">
                              <ShieldCheck
                                size={14}
                                className="text-[#7BC043]"
                              />

                              <span className="text-sm text-[#5b5b5b]">
                                {option.equity}
                              </span>
                            </div>
                          </div>
                        </div>

                        <motion.div
                          whileHover={{
                            scale: 1.04,
                          }}
                          className="hidden md:flex items-center gap-2 rounded-full bg-[#f7f7f7] px-4 py-2 text-[12px] font-medium text-[#1f3b22] relative z-10"
                        >
                          <Sparkles size={14} />
                          {option.bonus}
                        </motion.div>
                      </motion.label>
                    ))}
                  </div>
                </div>

                {/* MAGNETIC BUTTON */}
                <MagneticButton onClick={nextStep}>
                  Next
                  <ArrowRight size={18} />
                </MagneticButton>
              </motion.div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{
                  opacity: 0,
                  x: 60,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                exit={{
                  opacity: 0,
                  x: -60,
                }}
                transition={{
                  duration: 0.45,
                }}
                className="relative z-10"
              >
                <div className="uppercase tracking-[0.2em] text-[12px] font-bold text-[#1f3b22] mb-5">
                  Question 02
                </div>

                <h1 className="text-[38px] leading-[1.05] font-semibold text-[#162117]">
                  Tell us a bit about yourself.
                </h1>

                <div className="space-y-5 mt-10">
                  {[
                    {
                      key: "fullName",
                      placeholder: "Full Name",
                      type: "text",
                    },
                    {
                      key: "email",
                      placeholder: "Email Address",
                      type: "email",
                    },
                    {
                      key: "phone",
                      placeholder: "Phone Number",
                      type: "tel",
                    },
                  ].map((field, i) => (
                    <motion.div
                      key={field.key}
                      initial={{
                        opacity: 0,
                        y: 20,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        delay: i * 0.1,
                      }}
                    >
                      <input
                        type={field.type}
                        placeholder={field.placeholder}
                        value={
                          formData[field.key as keyof typeof formData] as string
                        }
                        onChange={(e) => {
                          setFormData((prev) => ({
                            ...prev,
                            [field.key]: e.target.value,
                          }));

                          setErrors((prev) => ({
                            ...prev,
                            [field.key]: "",
                          }));
                        }}
                        className={`w-full h-[62px] rounded-2xl border px-5 outline-none transition bg-white/80 backdrop-blur
        ${
          errors[field.key as keyof typeof errors]
            ? "border-red-400 focus:border-red-500"
            : "border-[#e8e8e8] focus:border-[#7BC043]"
        }`}
                      />

                      <AnimatePresence>
                        {errors[field.key as keyof typeof errors] && (
                          <motion.p
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            className="text-red-500 text-sm mt-2 ml-1"
                          >
                            {errors[field.key as keyof typeof errors]}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>

                <div className="flex items-center justify-between mt-12">
                  <motion.button
                    whileHover={{
                      x: -4,
                    }}
                    onClick={prevStep}
                    className="flex items-center gap-2 text-[#1f3b22] font-medium"
                  >
                    <ArrowLeft size={16} />
                    Back
                  </motion.button>

                  <MagneticButton onClick={nextStep}>
                    Continue
                    <ArrowRight size={18} />
                  </MagneticButton>
                </div>
              </motion.div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{
                  opacity: 0,
                  x: 60,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                exit={{
                  opacity: 0,
                  x: -60,
                }}
                transition={{
                  duration: 0.45,
                }}
                className="relative z-10"
              >
                <div className="uppercase tracking-[0.2em] text-[12px] font-bold text-[#1f3b22] mb-5">
                  Confirmation
                </div>

                <h1 className="text-[38px] leading-[1.05] font-semibold text-[#162117]">
                  Confirm your investment.
                </h1>

                <motion.div
                  initial={{
                    opacity: 0,
                    scale: 0.9,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  className="mt-10 rounded-[28px] bg-[#f7fbf2] border border-[#dceccf] p-6"
                >
                  <div className="flex justify-between items-center pb-5 border-b border-[#e4eddc]">
                    <div>
                      <p className="text-sm text-[#7a7a7a]">
                        Investment Amount
                      </p>

                      <motion.h2
                        initial={{
                          scale: 0.8,
                        }}
                        animate={{
                          scale: 1,
                        }}
                        className="text-[34px] font-bold text-[#180b28]"
                      >
                        ₦{formData.amount.toLocaleString()}
                      </motion.h2>
                    </div>

                    <motion.div
                      animate={{
                        rotate: [0, 10, -10, 0],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                      }}
                      className="w-16 h-16 rounded-2xl bg-[#b8bcef] flex items-center justify-center"
                    >
                      <Check className="text-[#180b28]" />
                    </motion.div>
                  </div>

                  <div className="space-y-4 mt-6">
                    <div className="flex justify-between">
                      <span className="text-[#757575]">Share Package</span>

                      <span className="font-medium">
                        {selectedTier?.equity}
                      </span>
                    </div>
                  </div>
                </motion.div>

                <div className="mt-6 rounded-2xl bg-[#f5f5f5] px-5 py-4 flex items-center gap-3">
                  <MessageCircle className="text-[#1f3b22]" size={18} />

                  <p className="text-sm text-[#4d4d4d] leading-relaxed">
                    After successful payment, you'll automatically redirect to
                    Mira WhatsApp.
                  </p>
                </div>

                <div className="flex items-center justify-between mt-12">
                  <motion.button
                    whileHover={{
                      x: -4,
                    }}
                    onClick={prevStep}
                    className="flex items-center gap-2 text-[#1f3b22] font-medium"
                  >
                    <ArrowLeft size={16} />
                    Back
                  </motion.button>

                  <MagneticButton onClick={handlePay}>
                    Pay ₦{formData.amount.toLocaleString()}
                    <ArrowRight size={18} />
                  </MagneticButton>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </>
  );
};

/* MAGNETIC BUTTON */
function MagneticButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  const ref = useRef<HTMLButtonElement | null>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, {
    stiffness: 150,
    damping: 10,
  });

  const springY = useSpring(y, {
    stiffness: 150,
    damping: 10,
  });

  const handleMouseMove = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();

    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const moveX = (mouseX - width / 2) * 0.18;
    const moveY = (mouseY - height / 2) * 0.18;

    x.set(moveX);
    y.set(moveY);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      style={{
        x: springX,
        y: springY,
      }}
      whileTap={{
        scale: 0.94,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleLeave}
      onClick={onClick}
      className="group mt-12 bg-[#b8bcef] hover:bg-[#d8daf7] transition-all duration-300 text-[#180b28] h-[58px] px-8 rounded-2xl font-semibold text-lg flex items-center gap-3 shadow-[0_10px_30px_rgba(95,103,172,0.35)]"
    >
      {children}
    </motion.button>
  );
}

export default SharePurchaseForm;
