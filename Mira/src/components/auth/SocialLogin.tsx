import { Button } from "@/components/ui/button";

import { Chrome } from "lucide-react";

export default function SocialLogin() {
  return (
    <>
      <div className="flex items-center gap-4 my-8">
        <hr className="flex-1" />

        <p className="text-gray-400 text-sm">or continue with</p>

        <hr className="flex-1" />
      </div>

      <Button
        variant="outline"
        className="w-full h-14 rounded-xl bg-white/35
    backdrop-blur-4xl
    backdrop-saturate-150

    border-0

    shadow-[0_8px_32px_rgba(31,38,135,0.08)]"
      >
        <img
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          alt="google"
          className="w-5 h-5"
        />
        Continue with Google
      </Button>
    </>
  );
}
