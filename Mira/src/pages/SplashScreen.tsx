import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function SplashScreen() {
  const navigate = useNavigate();
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setFadeOut(true), 2400);
    const navTimer = setTimeout(() => {
      if (window.location.pathname === "/splash") {
        navigate("/home", { replace: true });
      }
    }, 2800);
    return () => {
      clearTimeout(timer);
      clearTimeout(navTimer);
    };
  }, [navigate]);

  return (
    <div
      className={`min-h-screen bg-[#0d1a0f] flex flex-col items-center justify-center transition-opacity duration-700 ${fadeOut ? "opacity-0" : "opacity-100"}`}
      style={{ fontFamily: "Sora, sans-serif" }}
      onClick={() => navigate("/home", { replace: true })}
    >
      {/* Logo */}
      <div className="relative mb-8">
        <div className="w-24 h-24  flex items-center justify-center">
          <img
            src= '/MiraLogo.png'
            alt="Mira"
            className="w-14 h-14 object-contain"
          />
        </div>
      </div>

      {/* Brand name */}
      <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
        Mira<span className="text-green-500">Pay</span>
      </h1>

      {/* Tagline */}
      <p className="text-sm text-white/50 tracking-wide">
        cashless way to live
      </p>

      {/* Progress bar */}
      <div className="w-48 h-1 bg-white/10 rounded-full mt-10 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#5cad1a] to-green-500 rounded-full"
          style={{
            animation: "splash-progress 2.5s ease-out forwards",
          }}
        />
      </div>

      <style>{`
        @keyframes splash-progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
}

export default SplashScreen;
