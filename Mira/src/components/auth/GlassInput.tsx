import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export default function GlassInput({ className, error, ...props }: GlassInputProps) {
  return (
    <div>
      <Input
        {...props}
        className={cn(
          `
        h-14
        rounded-xl
        px-5

        bg-white/35
        backdrop-blur-3xl
        backdrop-saturate-150

        border-0

        shadow-[0_8px_32px_rgba(31,38,135,0.08)]

        placeholder:text-gray-400
        text-[rgb(24,11,40)]

        transition-all
        duration-300

        focus:outline-none
        focus:ring-0
        focus-visible:ring-0
        focus-visible:outline-none
        focus:border-transparent
        `,
          className,
        )}
      />

      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
}
