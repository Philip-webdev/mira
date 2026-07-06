import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";

interface Props {
  back?: () => void;
  next?: () => void;
  submit?: boolean;
  loading?: boolean;
}

export default function SignupButtons({ back, next, submit, loading }: Props) {
  return (
    <div className="flex gap-4 pt-4">
      {back && (
        <Button
          type="button"
          onClick={back}
          className="
          flex-1
          h-14
          rounded-xl

          bg-white/35
          backdrop-blur-4xl

          border-0

          text-[rgb(24,11,40)]
          hover:bg-white/60
        "
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back
        </Button>
      )}

      <motion.div
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        className="flex-1"
      >
        <Button
          type={submit ? "submit" : "button"}
          onClick={next}
          disabled={loading}
          className="
          w-full
          h-14
          rounded-xl

          bg-[rgb(4,173,183)]
          hover:bg-[rgb(3,150,160)]

          text-white
        "
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin mr-2 h-5 w-5" />
              Creating...
            </>
          ) : (
            <>
              {submit ? "Create Account" : "Next"}
              {!submit && <ArrowRight className="ml-2 h-5 w-5" />}
            </>
          )}
        </Button>
      </motion.div>
    </div>
  );
}
