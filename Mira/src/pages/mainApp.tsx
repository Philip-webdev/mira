import {
  ArrowUpRight,
  ArrowDownLeft,
  ScanLine,
  Plus,
  Building2,
  Layers,
  Coins,
  Ticket,
  UtensilsCrossed,
  Bus,
  BellDot,
  ChevronRight,
  Home,
  Activity,
  CreditCard,
  Settings,
  User,
  Search,
  Headphones,
  Eye,
  EyeOff,
} from "lucide-react";
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

type TxnType = "credit" | "debit";

interface Transaction {
  id: string;
  label: string;
  category: string;
  time: string;
  amount: number;
  type: TxnType;
  icon: typeof Building2;
}

const TRANSACTIONS: Transaction[] = [
  { id: "1", label: "College Dues", category: "Tuition", time: "Today, 2:30 PM", amount: 500, type: "debit", icon: Building2 },
  { id: "2", label: "Mirapoints Top-up", category: "Deposit", time: "Today, 11:15 AM", amount: 2000, type: "credit", icon: Coins },
  { id: "3", label: "Department Dues", category: "Academic", time: "Yesterday", amount: 350, type: "debit", icon: Layers },
  { id: "4", label: "Food Order", category: "Canteen", time: "Yesterday", amount: 120, type: "debit", icon: UtensilsCrossed },
  { id: "5", label: "Transport Pass", category: "Transit", time: "Jan 28", amount: 80, type: "debit", icon: Bus },
];

function formatAmount(n: number) {
  return n.toLocaleString("en-NG", { minimumFractionDigits: 0 });
}

function MainApp() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [IsVisible, setIsVisible] = useState(false);
  const [IsDeptVisible, setDeptIsVisible] = useState(false);
  const [IsFossuVisible, setFossuIsVisible] = useState(false);
  const [balanceVisible, setBalanceVisible] = useState(true);

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

  const quickActions = [
    { label: "Send", icon: ArrowUpRight, color: "bg-[rgb(4,173,183)]/15 text-[rgb(4,173,183)] dark:bg-[rgb(4,173,183)]/20", onClick: () => {} },
    { label: "Get", icon: ArrowDownLeft, color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400", onClick: () => {} },
    { label: "Scan", icon: ScanLine, color: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400", onClick: () => {} },
    { label: "Top Up", icon: Plus, color: "bg-[rgb(4,173,183)]/15 text-[rgb(4,173,183)] dark:bg-[rgb(4,173,183)]/20", onClick: () => navigate("/manager") },
  ];

  const categories = [
    { label: "College", icon: Building2, onClick: () => setIsVisible(true) },
    { label: "Dept", icon: Layers, onClick: () => setDeptIsVisible(true) },
    { label: "FOSSU", icon: Coins, onClick: () => setFossuIsVisible(true) },
    { label: "Tickets", icon: Ticket, onClick: () => navigate("/tickets") },
    { label: "Food", icon: UtensilsCrossed, onClick: () => navigate("/food") },
    { label: "Transport", icon: Bus, onClick: () => navigate("/rest") },
  ];

  const navItems = [
    { label: "Home", icon: Home, path: "/home" },
    { label: "Receipts", icon: Activity, path: "/Searchreceipts" },
    { label: "Profile", icon: User, path: "/manager" },
  ];

  const navigateToWhatsApp = () => {
    const message = `Hello Mira I need your assistance`;
    const whatsappURL = `https://wa.me/2348183853295?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#f8f5ee] dark:bg-[rgb(24,11,40)] text-[rgb(24,11,40)] dark:text-white font-['Sora',sans-serif] pb-28 max-w-md mx-auto">
      {/* Header */}
      <header className="px-5 pt-12 pb-3 sm:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/manager")}
              aria-label="Open profile"
              className="relative"
            >
              <span className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full ring-2 ring-[rgb(4,173,183)]/25">
                <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
              </span>
            </button>
            <div>
              <p className="text-[13px] font-medium text-gray-400 dark:text-gray-500 leading-none mb-0.5">Welcome back</p>
              <p className="text-[17px] font-semibold leading-tight">Hi {fullName}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/Searchreceipts")}
              aria-label="Search"
              className="h-10 w-10 flex items-center justify-center rounded-full bg-white dark:bg-white/10 shadow-sm transition active:scale-95"
            >
              <Search className="w-[18px] h-[18px] text-gray-600 dark:text-gray-300" />
            </button>
            <button
              onClick={() => navigate("/news")}
              aria-label="Notifications"
              className="h-10 w-10 flex items-center justify-center rounded-full bg-white dark:bg-white/10 shadow-sm transition active:scale-95"
            >
              <BellDot className="w-[18px] h-[18px] text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        </div>
      </header>

      {/* Balance Card */}
      <section className="px-5 sm:px-6 mt-2">
        <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[rgb(24,11,40)] via-[rgb(30,18,55)] to-[rgb(4,173,183)] p-6 pb-5 shadow-xl shadow-[rgb(4,173,183)]/15">
          {/* Decorative circles */}
          <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-[rgb(4,173,183)]/[0.08]" />
          <div className="absolute -bottom-14 -left-14 h-44 w-44 rounded-full bg-white/[0.04]" />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[13px] font-medium text-white/60">Total Balance</span>
              <button
                onClick={() => setBalanceVisible((v) => !v)}
                className="h-8 w-8 flex items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"
                aria-label={balanceVisible ? "Hide balance" : "Show balance"}
              >
                {balanceVisible ? (
                  <Eye className="w-4 h-4 text-white/80" />
                ) : (
                  <EyeOff className="w-4 h-4 text-white/80" />
                )}
              </button>
            </div>

            <div className="flex items-end gap-3 mb-5">
              <h1 className="text-[40px] font-bold leading-none tracking-tight text-white">
                {balanceVisible ? "₦0.00" : "•••••"}
              </h1>
              <span className="mb-1.5 flex items-center gap-1 rounded-full bg-[rgb(4,173,183)]/25 px-2 py-0.5 text-[11px] font-semibold text-[rgb(4,173,183)]">
                +3.50%
              </span>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center justify-between gap-3">
              {quickActions.map(({ label, icon: Icon, color, onClick }) => (
                <button
                  key={label}
                  onClick={onClick}
                  className="flex flex-1 flex-col items-center gap-1.5"
                >
                  <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${color} transition active:scale-90`}>
                    <Icon className="w-5 h-5" strokeWidth={2.2} />
                  </span>
                  <span className="text-[11px] font-medium text-white/70">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mt-6 px-5 sm:px-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[15px] font-semibold">Pay Dues</h2>
          <button className="flex items-center gap-0.5 text-[13px] font-medium text-[rgb(4,173,183)] transition hover:opacity-70">
            See all
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-1 -mx-5 px-5 sm:-mx-6 sm:px-6 scrollbar-hide">
          {categories.map(({ label, icon: Icon, onClick }) => (
            <button
              key={label}
              onClick={onClick}
              className="flex flex-col items-center gap-2 min-w-[68px] flex-shrink-0"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white dark:bg-white/[0.07] shadow-sm ring-1 ring-gray-100 dark:ring-white/[0.06] transition active:scale-90 hover:shadow-md">
                <Icon className="w-6 h-6 text-[rgb(4,173,183)]" strokeWidth={1.8} />
              </span>
              <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400">{label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Recent Transactions */}
      <section className="mt-6 px-5 sm:px-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[15px] font-semibold">Recent Activity</h2>
          <button
            onClick={() => navigate("/Searchreceipts")}
            className="flex items-center gap-0.5 text-[13px] font-medium text-[rgb(4,173,183)] transition hover:opacity-70"
          >
            See all
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-2">
          {TRANSACTIONS.map((txn) => {
            const Icon = txn.icon;
            return (
              <button
                key={txn.id}
                className="flex w-full items-center gap-3.5 rounded-2xl bg-white dark:bg-white/[0.05] px-4 py-3.5 text-left shadow-sm ring-1 ring-gray-100/80 dark:ring-white/[0.06] transition active:scale-[0.98]"
              >
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[rgb(4,173,183)]/10 dark:bg-[rgb(4,173,183)]/15">
                  <Icon className="w-5 h-5 text-[rgb(4,173,183)]" strokeWidth={1.8} />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-semibold leading-tight truncate">{txn.label}</p>
                  <p className="text-[12px] text-gray-400 dark:text-gray-500 mt-0.5">{txn.time}</p>
                </div>
                <span
                  className={`text-[15px] font-bold tabular-nums ${
                    txn.type === "credit"
                      ? "text-emerald-500 dark:text-emerald-400"
                      : "text-[rgb(24,11,40)] dark:text-gray-100"
                  }`}
                >
                  {txn.type === "credit" ? "+" : "-"}₦{formatAmount(txn.amount)}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Support CTA */}
      <section className="mt-6 px-5 sm:px-6">
        <button
          onClick={navigateToWhatsApp}
          className="flex w-full items-center gap-3.5 rounded-2xl bg-gradient-to-r from-[rgb(24,11,40)] to-[rgb(30,18,55)] p-4 text-left transition active:scale-[0.98] shadow-lg shadow-[rgb(24,11,40)]/15"
        >
          <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-[rgb(4,173,183)]/15">
            <Headphones className="w-5 h-5 text-[rgb(4,173,183)]" />
          </span>
          <div className="flex-1">
            <p className="text-[14px] font-semibold text-white">Need help?</p>
            <p className="text-[12px] text-white/50">Chat with Mira support</p>
          </div>
          <ChevronRight className="w-5 h-5 text-white/40" />
        </button>
      </section>

      {/* Modals */}
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

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 z-50 w-full max-w-md">
        <div className="mx-4 mb-4 flex items-center justify-around rounded-[22px] bg-white/90 dark:bg-[rgb(24,11,40)]/90 backdrop-blur-xl shadow-lg shadow-black/10 dark:shadow-black/30 px-2 py-2 ring-1 ring-gray-200/60 dark:ring-white/[0.08]">
          {navItems.map(({ label, icon: Icon, path }) => {
            const active = pathname === path;
            return (
              <a
                key={label}
                href={path}
                aria-label={label}
                className="relative flex flex-col items-center gap-0.5 py-1.5 px-3"
              >
                {active && (
                  <span className="absolute -top-1 left-1/2 -translate-x-1/2 h-[3px] w-5 rounded-full bg-[rgb(4,173,183)]" />
                )}
                <Icon
                  className={`w-[22px] h-[22px] transition ${
                    active ? "text-[rgb(4,173,183)]" : "text-gray-400 dark:text-gray-500"
                  }`}
                  strokeWidth={active ? 2.2 : 1.8}
                />
                <span
                  className={`text-[10px] font-medium transition ${
                    active ? "text-[rgb(4,173,183)]" : "text-gray-400 dark:text-gray-500"
                  }`}
                >
                  {label}
                </span>
              </a>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

export default MainApp;
