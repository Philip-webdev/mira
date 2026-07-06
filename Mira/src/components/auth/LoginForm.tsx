import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

import SocialLogin from "./SocialLogin";

export default function LoginForm() {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [remember, setRemember] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Enter a valid email";
    }

    if (!password || password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      await login(email, password);

      if (remember) {
        localStorage.setItem("remember_email", email);
      } else {
        localStorage.removeItem("remember_email");
      }

      toast({
        title: "Welcome Back 👋",
        description: "You have successfully logged in.",
      });

      navigate("/home");
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error?.message || "Incorrect email or password.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center px-10 py-14">
      <motion.div
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <form onSubmit={handleSubmit} className="mt-10 space-y-6">
          {/* EMAIL */}

          <div>
            <div className="mt-2">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);

                  if (errors.email) {
                    setErrors({
                      ...errors,
                      email: "",
                    });
                  }
                }}
                className="
    h-14
    rounded-xl
    px-5

    bg-white/35
    backdrop-blur-4xl
    backdrop-saturate-150

    border-0

    shadow-[0_8px_32px_rgba(31,38,135,0.08)]

    placeholder:text-gray-400
    text-[rgb(24,11,40)]

    focus:outline-none
    focus:ring-0
    focus-visible:ring-0
    focus-visible:outline-none
    focus:border-transparent

    transition-all
    duration-300
  "
              />
            </div>

            {errors.email && (
              <p className="text-red-500 text-sm mt-2">{errors.email}</p>
            )}
          </div>

          {/* PASSWORD */}

          <div>
            <div className="relative mt-2">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);

                  if (errors.password)
                    setErrors({
                      ...errors,
                      password: "",
                    });
                }}
                className=" h-14
    rounded-xl
    px-5

    bg-white/35
    backdrop-blur-4xl
    backdrop-saturate-150

    border-0

    shadow-[0_8px_32px_rgba(31,38,135,0.08)]

    placeholder:text-gray-400
    text-[rgb(24,11,40)]

    focus:outline-none
    focus:ring-0
    focus-visible:ring-0
    focus-visible:outline-none
    focus:border-transparent

    transition-all
    duration-300"
              />

              <button
                type="button"
                className="absolute right-4 top-4 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {errors.password && (
              <p className="text-red-500 text-sm mt-2">{errors.password}</p>
            )}
          </div>

          {/* REMEMBER */}

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="accent-[rgb(4,173,183)] text-white"
              />

              <span className="text-xs text-gray-600">Remember me</span>
            </label>
          </div>

          {/* BUTTON */}

          <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
            <Button
              disabled={loading || isLoading}
              className="w-full h-14 rounded-xl bg-[rgb(4,173,183)] hover:bg-[rgb(3,150,160)] text-white font-semibold shadow-[0_8px_32px_rgba(31,38,135,0.08)] flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading || isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Signing In...
                </>
              ) : (
                <>Sign In</>
              )}
            </Button>
          </motion.div>

          {/* SOCIAL */}

          <SocialLogin />

          {/* FOOTER */}

          <p className="flex gap-2 items-center justify-center text-gray-500 text-sm">
            Don't have an account?
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 320, damping: 18 }}
            >
              <Link
                to="/signup"
                className="group relative inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold text-[rgb(4,173,183)] transition-colors duration-300"
              >
                <span>Create one</span>
                <span className="absolute bottom-1 left-3 h-0.5 w-[calc(100%-1.5rem)] scale-x-0 rounded-full bg-[rgb(4,173,183)] transition-transform duration-300 group-hover:scale-x-100" />
              </Link>
            </motion.div>
          </p>
        </form>
      </motion.div>
    </div>
  );
}
