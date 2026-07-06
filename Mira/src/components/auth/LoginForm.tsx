import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Loader2, GraduationCap, Building2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function LoginForm() {
  const navigate = useNavigate();
  const { login, loginAsStudent, loading } = useAuth();
  const { toast } = useToast();

  const [mode, setMode] = useState<"student" | "admin">("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Enter a valid email";
    }

    if (mode === "admin" && (!password || password.length < 6)) {
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
      if (mode === "student") {
        loginAsStudent(email);
        toast({ title: "Welcome to Mira", description: "You can now make payments." });
        navigate("/home");
      } else {
        await login(email, password);
        toast({ title: "Welcome Back", description: "Logged in successfully." });
        const storedUser = JSON.parse(localStorage.getItem("mira_user") || "{}");
        if (storedUser.role === "admin") {
          const college = localStorage.getItem("adminCollege") || "colerm";
          navigate(`/admin/${college}`);
        } else {
          navigate("/home");
        }
      }
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error?.message || "Incorrect credentials.",
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
        {/* Role Toggle */}
        <div className="flex rounded-xl bg-gray-100 p-1 mb-8">
          <button
            type="button"
            onClick={() => { setMode("student"); setErrors({}); }}
            className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all ${
              mode === "student"
                ? "bg-white text-[rgb(24,11,40)] shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <GraduationCap className="h-4 w-4" />
            Student
          </button>
          <button
            type="button"
            onClick={() => { setMode("admin"); setErrors({}); }}
            className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all ${
              mode === "admin"
                ? "bg-white text-[rgb(24,11,40)] shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Building2 className="h-4 w-4" />
            Institution
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* EMAIL */}
          <div>
            <div className="mt-2">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors({ ...errors, email: "" }); }}
                className="h-14 rounded-xl px-5 bg-white/35 backdrop-blur-4xl backdrop-saturate-150 border-0 shadow-[0_8px_32px_rgba(31,38,135,0.08)] placeholder:text-gray-400 text-[rgb(24,11,40)] focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus:border-transparent transition-all duration-300"
              />
            </div>
            {errors.email && <p className="text-red-500 text-sm mt-2">{errors.email}</p>}
          </div>

          {/* PASSWORD — Admin only */}
          {mode === "admin" && (
            <div>
              <div className="relative mt-2">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors({ ...errors, password: "" }); }}
                  className="h-14 rounded-xl px-5 bg-white/35 backdrop-blur-4xl backdrop-saturate-150 border-0 shadow-[0_8px_32px_rgba(31,38,135,0.08)] placeholder:text-gray-400 text-[rgb(24,11,40)] focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus:border-transparent transition-all duration-300"
                />
                <button
                  type="button"
                  className="absolute right-4 top-4 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-2">{errors.password}</p>}
            </div>
          )}

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
              ) : mode === "student" ? (
                "Continue"
              ) : (
                "Sign In"
              )}
            </Button>
          </motion.div>

          {/* FOOTER */}
          {mode === "admin" && (
            <p className="flex gap-2 items-center justify-center text-gray-500 text-sm">
              Don't have an account?
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 320, damping: 18 }}
              >
                <Link
                  to="/admin/register"
                  className="group relative inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold text-[rgb(4,173,183)] transition-colors duration-300"
                >
                  <span>Register</span>
                  <span className="absolute bottom-1 left-3 h-0.5 w-[calc(100%-1.5rem)] scale-x-0 rounded-full bg-[rgb(4,173,183)] transition-transform duration-300 group-hover:scale-x-100" />
                </Link>
              </motion.div>
            </p>
          )}
        </form>
      </motion.div>
    </div>
  );
}
