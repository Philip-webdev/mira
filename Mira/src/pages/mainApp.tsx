import {
  CheckCheck,
  NewspaperIcon,
  Building,
  Layers,
  TicketIcon,
  Utensils,
  Coins,
  BellDotIcon,
  Bus,
  User,
  Flame,
  Library,
  Home as HomeIcon,
  Search,
  PanelRight,
  HeadsetIcon,
} from "lucide-react";

import HowToCard from "@/components/HowToCard";
import ImageSlider from "@/components/ImageSlider";
import { useState, useEffect } from "react";
import "../index.css";
import CollegePaymentForm from "@/components/collegeDues";
import DepartmentalPaymentForm from "@/components/departmentaldue";
import FossuPaymentForm from "@/components/fossaDue";
import { useLocation, useNavigate } from "react-router-dom";
import { WelcomeModal } from "@/components/ui/WelcomeModal";
const PROFILE_STORAGE_KEY = "Mira_profile_settings";
const DEFAULT_AVATAR_URL = "/profile-avatar_18931206.png";
const WELCOME_SEEN_KEY = "Mira_welcome_seen";

function MainApp() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => pathname === path;
  const getIconClass = (path: string) =>
    isActive(path) ? "text-[#ffffff]" : "text-[#c9cbed]/70";

  const [IsVisible, setIsVisible] = useState(false);
  const [IsDeptVisible, setDeptIsVisible] = useState(false);
  const [IsFossuVisible, setFossuIsVisible] = useState(false);
  const [darkMode] = useState(true);

  const [avatarUrl, setAvatarUrl] = useState<string>(DEFAULT_AVATAR_URL);
  const [fullName, setFullName] = useState<string>("there");
  const [showWelcome, setShowWelcome] = useState(false);
  useEffect(() => {
    const loadProfile = () => {
      try {
        const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed?.avatarDataUrl) setAvatarUrl(parsed.avatarDataUrl);
          if (parsed?.fullName) setFullName(String(parsed.fullName).split(" ")[0] || "there");
        }
      } catch {
        /* ignore */
      }
    };
    loadProfile();
    const onStorage = (e: StorageEvent) => {
      if (e.key === PROFILE_STORAGE_KEY) loadProfile();
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", loadProfile);
    if (!localStorage.getItem(WELCOME_SEEN_KEY)) {
      setShowWelcome(true);
    }
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", loadProfile);
    };
  }, []);
  const dismissWelcome = () => {
    localStorage.setItem(WELCOME_SEEN_KEY, "1");
    setShowWelcome(false);
  };


  const navigateToWhatsApp = () => {
   const message = `Hello Mira I need your assistance`;
    const whatsappURL = `https://wa.me/2348183853295?text=${encodeURIComponent(
      message,
    )}`;
    
    window.open(whatsappURL, "_blank");
  }
  const tiles = [
    { label: "College", icon: Building, bg: "bg-[#f4f2ff]", onClick: () => setIsVisible(true) },
    { label: "Department", icon: Layers, bg: "bg-[#edeaff]", onClick: () => setDeptIsVisible(true) },
    { label: "FOSSU", icon: Coins, bg: "bg-[#f8f7ff]", onClick: () => setFossuIsVisible(true) },
    { label: "Tickets", icon: TicketIcon, bg: "bg-[#f1efff]", onClick: () => navigate("/tickets") },
    { label: "Food", icon: Utensils, bg: "bg-[#faf9ff]", onClick: () => navigate("/food") },
    { label: "Move", icon: Bus, bg: "bg-[#efedff]", onClick: () => navigate("/rest") },
  ];

  return (
    <div
      className={darkMode ? "dark" : ""}
      style={{
        fontFamily: "Sora, sans-serif",
        background:
          "radial-gradient(circle at top left, rgba(95,103,172,.34), transparent 34%), #180b28",
      }}
    >
      <div className="min-h-screen bg-[#fbfaff] dark:bg-[#180b28] text-[#180b28] dark:text-white pb-28 max-w-md mx-auto px-5 sm:max-w-lg sm:px-6">
        {/* Header */}
        <header className="flex items-center justify-between pt-5 pb-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate("/manager")}
              aria-label="Open profile settings"
              className="inline-flex h-8 w-8 items-center justify-center overflow-hidden rounded-full ring-2 ring-[#5f67ac]/30 focus:outline-none focus:ring-2 focus:ring-[#5f67ac]"
            >
             <img src={avatarUrl} alt="Mira-profile" className="h-full w-full object-cover" />
            </button>
            <div>
              <div className="text-xs opacity-70 leading-none">Welcome back</div>
              <div className="text-lg font-semibold leading-tight">Hi {fullName} 👋</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/Searchreceipts")}
              aria-label="Search receipts"
              className="w-10 h-10 grid place-items-center rounded-full bg-[#5f67ac]/15 hover:bg-[#5f67ac]/25 transition"
            >
              <Search className="w-5 h-5 text-[#c9cbed]" />
            </button>
            <button
              onClick={() => navigate("/news")}
              aria-label="Notifications"
              className="w-10 h-10 grid place-items-center rounded-full bg-[#5f67ac]/15 hover:bg-[#5f67ac]/25 transition"
            >
              <BellDotIcon className="w-5 h-5 text-[#c9cbed]" />
            </button>

            <button
              onClick={() => navigateToWhatsApp()}
              aria-label="customer-support"
              className="w-10 h-10 grid place-items-center rounded-full bg-[#5f67ac]/15 hover:bg-[#5f67ac]/25 transition"
            >
              <HeadsetIcon className="w-5 h-5 text-[#c9cbed]" />
            </button>
          </div>
        </header>

        {/* Wallet */}
        <div className="rounded-2xl shadow-md shadow-[#5f67ac]/30 mb-8">
        <div className="w-full bg-gradient-to-r from-[#180b28] via-[#5f67ac] to-[#b8bcef] rounded-2xl p-6 flex items-center justify-between ring-1 ring-white/10">
            <div>
               <div className="text-sm text-white/90">Wallet Balance</div>
              <div className="text-3xl font-bold text-white mt-1 tracking-tight">0.00</div>
              <div className="text-xs text-white/80 mt-1">Mirapoints</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="p-3 bg-white/20 rounded-full">
                <Coins className="w-7 h-7 text-white" />
              </div>
              <button
                onClick={() => navigate("#/")}
                 className="mt-3 text-sm bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-full transition"
              >
                Top up
              </button>
            </div>
          </div>
        </div>

        {/* WhatsApp CTA, this is meant to open a form for users to insert their whatsapp details */}
        <button  onClick={()=> navigate("/manager")}
        
          className="w-full bg-[#12081f] rounded-tr-2xl rounded-bl-2xl p-4 flex items-center gap-3 hover:bg-[#241436] transition mb-8 text-left text-white ring-1 ring-[#5f67ac]/25"
        >
          <img src="/whatsapp_3983953.png" alt="WhatsApp" className="w-10 h-10" />
           <span className="text-base">Add your WhatsApp for exciting offers</span>
        </button>

        {/* Feature grid */}
        <div className="mb-8">
        <p className="font-medium mb-4 text-[#180b28] dark:text-gray-200 text-base">
            Here are some dues you can pay
          </p>
          <div className="grid grid-cols-3 gap-4">
            {tiles.map(({ label, icon: Icon, bg, onClick }) => (
              <button
                key={label}
                onClick={onClick}
                className={`${bg} dark:bg-[#241436] aspect-square rounded-2xl flex flex-col items-center justify-center gap-2 hover:scale-[1.03] active:scale-95 transition shadow-sm ring-1 ring-[#5f67ac]/10`}
              >
                <Icon className="w-7 h-7 text-[#5f67ac]" />
                 <span className="text-sm font-semibold text-black dark:text-white">{label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div id="howto">
            <HowToCard />
          </div>

          <button
            onClick={() => navigate("#/")}
            className="w-full bg-[#12081f] rounded-2xl p-4 flex items-center gap-3 hover:bg-[#241436] transition text-left text-white ring-1 ring-[#5f67ac]/25"
          >
            <img src="/gift-box_10963148.png" alt="gifts" className="w-10 h-10" />
            <span className="text-base">Enjoy special gifting today!</span>
          </button>

            <p className="flex items-center gap-2 pt-2 text-base font-medium text-black dark:text-gray-200">
            <Flame className="w-5 h-5 text-[#5f67ac]" />
            <span>Trending topics to read</span>
          </p>
          <ImageSlider />
        </div>

        <CollegePaymentForm IsVisible={IsVisible} setIsVisible={setIsVisible} />
        <DepartmentalPaymentForm IsDeptVisible={IsDeptVisible} setDeptIsVisible={setDeptIsVisible} />
        <FossuPaymentForm IsFossuVisible={IsFossuVisible} setFossuIsVisible={setFossuIsVisible} />
<WelcomeModal
          open={showWelcome}
          onClose={dismissWelcome}
          title={`Welcome, ${fullName}!`}
          message="Your world-class cashless payment hub. Pay dues, generate receipts, and explore campus services — all in one place."
          ctaLabel="Get started"
        />
        {/* Bottom Nav */}
        <nav
          className="fixed bottom-4 left-1/2 -translate-x-1/2 px-6 py-3 z-50 flex items-center gap-10 rounded-full"
          style={{
          backdropFilter: "blur(15px)",
            backgroundColor: "rgba(95,103,172,.28)",
            boxShadow: "0 14px 32px rgba(24,11,40,.32)",
          }}
        >
          <a href="/home" aria-label="Home"><PanelRight className={getIconClass("/home")} /></a>
          <a href="/Searchreceipts" aria-label="Receipts"><CheckCheck className={getIconClass("/Searchreceipts")} /></a>
          <a href="/docs" aria-label="Docs"><Library className={getIconClass("/docs")} /></a>
          <a href="/manager" aria-label="Profile"><User className={getIconClass("/manager")} /></a>
        </nav>
      </div>
    </div>
  );
}

export default MainApp;
