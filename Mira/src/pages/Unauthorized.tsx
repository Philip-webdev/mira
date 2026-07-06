import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ShieldX, ArrowLeft } from 'lucide-react';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#04ADB7] via-[#0B5E78] to-[#051B2B] overflow-hidden flex items-center justify-center">
      <motion.div
        className="absolute top-0 left-0 w-96 h-96 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        animate={{ y: [0, 100, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      <motion.div
        className="relative z-10 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="flex justify-center mb-6"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ShieldX className="w-24 h-24 text-red-400" />
        </motion.div>

        <h1 className="text-5xl font-bold text-white mb-4">Access Denied</h1>
        <p className="text-cyan-100 text-xl mb-8 max-w-md">
          You don't have permission to access this resource. Please contact your administrator if you believe this is an error.
        </p>

        <div className="flex gap-4 justify-center">
          <Button
            onClick={() => navigate(-1)}
            className="bg-white bg-opacity-10 hover:bg-opacity-20 text-white border border-cyan-300 border-opacity-30 rounded-xl px-8 py-3 flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </Button>
          <Button
            onClick={() => navigate('/home')}
            className="bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 text-gray-900 font-semibold rounded-xl px-8 py-3"
          >
            Go to Home
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default Unauthorized;
