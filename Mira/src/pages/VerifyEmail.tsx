import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Mail, ArrowRight, Loader2, CheckCircle2, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { InputOTP } from '@/components/ui/input-otp';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyEmail, resendVerification } = useAuth();
  const { toast } = useToast();

  const email = (location.state?.email as string) || '';
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [verified, setVerified] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (!email) {
      navigate('/signup');
    }
  }, [email, navigate]);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      toast({
        title: 'Invalid Code',
        description: 'Please enter all 6 digits',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      await verifyEmail(otp);
      setVerified(true);
      toast({
        title: 'Success!',
        description: 'Your email has been verified',
      });

      setTimeout(() => {
        navigate('/home');
      }, 2000);
    } catch (error: any) {
      toast({
        title: 'Verification Failed',
        description: error.message || 'Invalid verification code',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      await resendVerification(email);
      setResendCooldown(60);
      toast({
        title: 'Code Sent',
        description: 'Verification code sent to your email',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to resend code',
        variant: 'destructive',
      });
    } finally {
      setIsResending(false);
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

  if (!email) return null;

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
          <h1 className="text-4xl font-bold text-white mb-2">Verify Your Email</h1>
          <p className="text-cyan-100">We sent a code to {email}</p>
        </motion.div>

        {!verified ? (
          <motion.div
            className="bg-white bg-opacity-10 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border border-white border-opacity-20 space-y-6"
            variants={itemVariants}
          >
            <motion.div variants={itemVariants}>
              <label className="text-white text-sm font-semibold block mb-4">
                Enter Verification Code
              </label>
              <div className="flex justify-center mb-6">
                <InputOTP
                  maxLength={6}
                  pattern="^\d*$"
                  value={otp}
                  onChange={setOtp}
                  render={({ slots }) => (
                    <div className="flex gap-3">
                      {slots.map((slot, idx) => (
                        <motion.div
                          key={idx}
                          whileFocus={{ scale: 1.1 }}
                        >
                          <input
                            {...slot}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            className="w-12 h-12 text-center text-2xl font-bold bg-white bg-opacity-10 border-2 border-cyan-300 border-opacity-30 rounded-lg text-white focus:border-cyan-200 focus:bg-opacity-20 transition-all outline-none"
                          />
                        </motion.div>
                      ))}
                    </div>
                  )}
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Button
                onClick={handleVerify}
                disabled={isLoading || otp.length !== 6}
                className="w-full bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 text-gray-900 font-semibold py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    Verify Email
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </Button>
            </motion.div>

            <motion.div variants={itemVariants} className="text-center">
              <p className="text-cyan-100 text-sm mb-4">Didn't receive the code?</p>
              <Button
                onClick={handleResend}
                disabled={isResending || resendCooldown > 0}
                className="w-full bg-white bg-opacity-10 hover:bg-opacity-20 text-cyan-300 border border-cyan-300 border-opacity-30 rounded-xl py-3 font-medium flex items-center justify-center gap-2"
              >
                {isResending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending...
                  </>
                ) : resendCooldown > 0 ? (
                  <>
                    <RotateCcw className="w-5 h-5" />
                    Retry in {resendCooldown}s
                  </>
                ) : (
                  <>
                    <Mail className="w-5 h-5" />
                    Resend Code
                  </>
                )}
              </Button>
            </motion.div>
          </motion.div>
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
            <h2 className="text-2xl font-bold text-white mb-2">Verified!</h2>
            <p className="text-cyan-100 mb-6">Your email has been successfully verified. Redirecting to dashboard...</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default VerifyEmail;
