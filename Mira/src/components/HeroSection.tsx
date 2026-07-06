import { Button } from "@/components/ui/button";
import { ArrowRight, Shield } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const PARTNERS = [

  { name: "Nomba",       logo: "/nomba.webp" },
    { name: "NAPS",       logo: "/assets/ALPHA TEAM 20230603_181509.jpg" },
  { name: "GEO",  logo: "/WhatsApp Image 2025-09-18 at 15.47.19_2301f853.jpg" },
  { name: "FOSSU",  logo: "/assets/WhatsApp Image 2025-11-25 at 10.05.09 AM.jpeg" },
  { name: "EMT",     logo: "/WhatsApp Image 2025-09-18 at 15.48.19_33eb4084.jpg" },
  { name: "CPT",          logo: "/WhatsApp Image 2025-09-18 at 15.48.19_33eb4084.jpg" },
  { name: "Acquaculture",  logo: "https://i.imgur.com/GLqKucy.jpeg" },
  { name: "COLERM",          logo: "/WhatsApp Image 2025-09-14 at 21.44.11_eebaeded.jpg" },
  
];

function useCountUp(target: number, duration: number = 2500) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;

    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out cubic for a fast start, smooth finish
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));

      if (progress < 1) requestAnimationFrame(tick);
      else setCount(target);
    };

    requestAnimationFrame(tick);
  }, [started, target, duration]);

  return { count, ref };
}

function formatNaira(value: number): string {
  return "₦" + value.toLocaleString("en-NG");
}

const TransactionCounter = () => {
  const TARGET = 30_500_690;
  const { count, ref } = useCountUp(TARGET, 2800);

  return (
    <div
      ref={ref}
      className="absolute scale-80 bottom-[85%] right-0 bg-none rounded-2xl shadow-xl px-3 py-2 flex flex-col items-start gap-1 z-10 min-w-[100px] border border-gray-100"
      style={{ backdropFilter: "blur(8px)" }}
    >
      {/* Pulsing  dot */}
      <div className="flex items-center gap-2 mb-1">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
        </span>
        <span className="text-xs text-gray-500 font-medium">Total Transacted</span>
      </div>

      {/* Animated amount */}
      <span
        className="text-2xl font-extrabold text-black tracking-tight tabular-nums"
        style={{ fontFamily: "monospace" }}
      >
        {formatNaira(count)}
      </span>

      {/* Subtitle */}
      <span className="text-[11px] text-black-500 font-semibold flex items-center gap-1">
        ▲ 1.4% this month
      </span>
    </div>
  );
};

 
const PartnerCarousel = () => {
  // Duplicate for seamless loop
  const logos = [...PARTNERS, ...PARTNERS];

  return (
    <div className="w-full overflow-hidden bg-white border-y border-gray-100 py-5">
      <p className="text-center text-xs text-gray-400 font-semibold uppercase tracking-widest mb-4">
        Trusted Partners
      </p>

      <div className="relative">
        {/* Left fade */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        {/* Right fade */}
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <div
          className="flex gap-12 items-center"
          style={{
            animation: "scroll-left 22s linear infinite",
            width: "max-content",
          }}
        >
          {logos.map((partner, index) => (
            <div
              key={index}
              className="flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100"
              style={{ minWidth: "200px" }}
            >
              <img
                src={partner.logo}
                alt={partner.name}
                className="h-12 object-contain"
                onError={(e) => {
                  // Fallback to text if logo fails
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = `<span class="text-sm font-bold text-gray-500">${partner.name}</span>`;
                  }
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

 
const HeroSection = () => {
  return (
    <>
      <section
        className="min-h-screen flex items-center"
        style={{ backgroundColor: "rgb(4, 173, 183)" }}
      >
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

          {/* LEFT — COPY */}
          <div className="space-y-6 text-center md:text-left">

            <h1 className="text-4xl md:text-6xl font-bold text-black leading-tight">
              Accept Campus Payments <br className="hidden md:block" />
              Without Stress
            </h1>

            <p className="text-base md:text-lg text-black-600 max-w-xl mx-auto md:mx-0">
              A Simple and Secure Infrastructure Designed for Students and Institutions.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button
                className="px-8 py-5 text-lg rounded-full hover:bg-black"
                style={{ backgroundColor: "black" }}
              >
                <a href="/login" className="flex items-center gap-2">
                  Pay with Mira
                  <ArrowRight className="w-5 h-5" />
                </a>
              </Button>

              <div className="flex items-center gap-2 text-sm text-gray-500 justify-center md:justify-start">
                <Shield className="w-4 h-4" />
                Bank-level security
              </div>
            </div>
          </div>

          {/* RIGHT — IMAGE + COUNTER */}
          <div className="flex justify-center md:justify-end">
            <div className="relative inline-block">
              <img
                src='/d21983fc-5db5-424d-ba17-a2824b82aceb-removebg-preview.png'
                alt="Mira for growth"
                className="max-w-md w-full animate-float"
                style={{ filter: "brightness(0) saturate(0%)" }}
              />

              {/* Animated transaction counter */}
              <TransactionCounter />
            </div>
          </div>

        </div>
      </section>

      {/* Partner carousel below hero */}
      <PartnerCarousel />

      {/* Keyframe animation */}
      <style>{`
        @keyframes scroll-left {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </>
  );
};

export default HeroSection;