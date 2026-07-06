import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, Eye, EyeOff, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { resetPassword } = useAuth();
  const { toast } = useToast();

  const email = searchParams.get('email') || '';
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!password || password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !email || !token) {
      toast({
        title: 'Error',
        description: 'Invalid reset link',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword(email, token, password);
      setSubmitted(true);
      toast({
        title: 'Success!',
        description: 'Your password has been reset',
      });

      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error: any) {
      toast({
        title: 'Reset Failed',
        description: error.message || 'Failed to reset password',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  if (!email || !token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#04ADB7] via-[#0B5E78] to-[#051B2B] overflow-hidden flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-bold text-white mb-4">Invalid Reset Link</h1>
          <p className="text-cyan-100 mb-6">Please request a new password reset.</p>
          <Link
            to="/forgot-password"
            className="text-cyan-400 hover:text-cyan-300 font-semibold"
          >
            Back to Password Reset
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#04ADB7] via-[#0B5E78] to-[#051B2B] overflow-hidden flex items-center justify-center">
      <motion.div
        className="absolute top-0 left-0 w-96 h-96 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        animate={{ y: [0, 100, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      <motion.div
        className="relative z-10 w-full max-w-md px-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="text-center mb-8">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl">
            <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#04ADB7] to-[#0B5E78]">
              M
            </span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Set New Password</h1>
          <p className="text-cyan-100">Create a strong password for your account</p>
        </motion.div>

        {!submitted ? (
          <motion.form
            className="bg-white bg-opacity-10 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border border-white border-opacity-20 space-y-6"
            variants={itemVariants}
            onSubmit={handleSubmit}
          >
            <motion.div variants={itemVariants}>
              <Label className="text-white text-sm font-semibold block mb-2">New Password</Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-cyan-300 w-5 h-5" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors({ ...errors, password: '' });
                  }}
                  className="bg-white bg-opacity-10 border border-cyan-300 border-opacity-30 rounded-xl pl-12 pr-12 text-white placeholder-cyan-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-cyan-300"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-300 text-sm mt-2">{errors.password}</p>
              )}
            </motion.div>

            <motion.div variants={itemVariants}>
              <Label className="text-white text-sm font-semibold block mb-2">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-cyan-300 w-5 h-5" />
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setErrors({ ...errors, confirmPassword: '' });
                  }}
                  className="bg-white bg-opacity-10 border border-cyan-300 border-opacity-30 rounded-xl pl-12 pr-12 text-white placeholder-cyan-100"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-cyan-300"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-300 text-sm mt-2">{errors.confirmPassword}</p>
              )}
            </motion.div>

            <motion.div variants={itemVariants}>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 text-gray-900 font-semibold py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Resetting...
                  </>
                ) : (
                  'Reset Password'
                )}
              </Button>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Link
                to="/login"
                className="flex items-center justify-center gap-2 text-cyan-300 hover:text-cyan-200 font-medium transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Login
              </Link>
            </motion.div>
          </motion.form>
        ) : (
          <motion.div
            className="bg-white bg-opacity-10 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border border-white border-opacity-20 text-center"
            variants={itemVariants}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="w-16 h-16 bg-green-400 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <CheckCircle2 className="w-8 h-8 text-green-900" />
            </motion.div>
            <h2 className="text-2xl font-bold text-white mb-2">Password Reset!</h2>
            <p className="text-cyan-100 mb-6">
              Your password has been successfully reset. You can now log in with your new password.
            </p>
            <Button
              onClick={() => navigate('/login')}
              className="w-full bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 text-gray-900 font-semibold py-3 rounded-xl"
            >
              Go to Login
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default ResetPassword;
