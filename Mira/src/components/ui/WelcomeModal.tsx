import { X, Sparkles } from "lucide-react";
type Props = {
  open: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  ctaLabel?: string;
};
export function WelcomeModal({
  open,
  onClose,
  title = "Welcome to Mira",
  message = "Your world-class cashless payment companion. Pay dues, get receipts, and stay on top of everything in seconds.",
  ctaLabel = "Let's go",
}: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-5">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div className="relative w-full max-w-sm rounded-3xl bg-gradient-to-br from-emerald-950 to-[#0d1a0f] p-6 ring-1 ring-emerald-500/30 shadow-2xl animate-scale-in">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/80 hover:bg-white/20"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/20">
          <Sparkles className="h-8 w-8 text-[#5cad1a]" />
        </div>
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-emerald-100/80">{message}</p>
        <button
          onClick={onClose}
          className="mt-6 w-full rounded-2xl bg-[#5cad1a] px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
        >
          {ctaLabel}
        </button>
      </div>
    </div>
  );
}
export function CompletionModal({
  open,
  onClose,
  title = "All done",
  message = "Your changes were saved successfully.",
}: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-5">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="relative w-full max-w-sm rounded-3xl bg-gradient-to-br from-emerald-950 to-[#0d1a0f] p-6 text-center ring-1 ring-emerald-500/30 shadow-2xl animate-scale-in">
        <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#5cad1a]/20">
          <svg viewBox="0 0 24 24" className="h-9 w-9 text-[#5cad1a]" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12l5 5L20 7" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-white">{title}</h2>
        <p className="mt-2 text-sm text-emerald-100/80">{message}</p>
        <button
          onClick={onClose}
          className="mt-6 w-full rounded-2xl bg-[#5cad1a] px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
        >
          Continue
        </button>
      </div>
    </div>
  );
}