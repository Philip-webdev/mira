import { BellDotIcon, CheckCheck, Library, PanelRight, RecycleIcon, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const NEWS_ENDPOINT =
  "https://newsdata.io/api/1/news?apikey=pub_fec197185f08412689edea86003151af&country=ng,us,cn,gb,ae&language=en";

const NewsComponent = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(NEWS_ENDPOINT)
      .then((response) => response.json())
      .then((data) => {
        if (data?.results?.length) {
          setItems(data.results.slice(0, 6));
        } else {
          setError("No notifications available.");
        }
      })
      .catch(() => setError("Unable to load notifications."))
      .finally(() => setLoading(false));
  }, []);

  const isActive = (path: string) => pathname === path;
  const getIconClass = (path: string) =>
    isActive(path) ? "text-[#5cad1a]" : "text-emerald-600/60";

  return (
    <div className="min-h-screen bg-[#0d1a0f] dark:bg-[#0d1a0f] text-white dark:text-white px-5 pb-28" style={{ fontFamily: "Sora, sans-serif" }}>
      <div className="max-w-md mx-auto pt-5">
        <header className="flex items-center justify-between pb-4">
          <button
            type="button"
            onClick={() => navigate("/home")}
            aria-label="Go home"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 transition"
          >
            <PanelRight className="w-5 h-5 text-emerald-600" />
          </button>
          <div className="text-center">
          <h1 className="text-xl font-semibold">Notifications</h1>
        </div>
        <button
          type="button"
          onClick={() => setItems([])}
          aria-label="Clear notifications"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 transition"
        >
          <RecycleIcon className="w-6 h-6 text-emerald-600" />
        </button>
      </header>

      <div className="rounded-2xl bg-[#102014] p-4 text-sm text-slate-300 shadow-sm dark:border-emerald-900">
        {loading ? (
          <div>Loading notifications...</div>
        ) : error ? (
          <div className="rounded-2xl border border-red-300 bg-red-50 p-4 text-sm text-red-700 shadow-sm">{error}</div>
        ) : items.length === 0 ? (
          <div className="rounded-2xl border border-slate-700 bg-slate-950/80 p-4 text-sm text-slate-300 shadow-sm">
            No notifications available.
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item, index) => (
              <article
                key={index}
                className="rounded-2xl border border-none bg-emerald-600 p-4 shadow-sm dark:border-emerald-900 dark:bg-[#122613]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white dark:text-white">
                      {item.title || item.description || "New notification"}
                    </p>
                    <p className="mt-1 text-[11px] text-white dark:text-white">
                      {item.pubDate ? new Date(item.pubDate).toLocaleDateString() : item.source_id || "Mira"}
                    </p>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-semibold text-emerald-700">Alert</span>
                </div>
                <p className="mt-3 text-xs leading-6 text-slate-100 dark:text-slate-300">
                  {item.description || item.link || "Review this alert and take action if needed."}
                </p>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>

      <nav
        className="fixed bottom-4 left-1/2 z-50 flex items-center gap-10 rounded-full bg-white/90 px-6 py-3 shadow-xl backdrop-blur-xl dark:bg-[#081207]/95"
        style={{
          transform: "translateX(-50%)",
          boxShadow: "0 4px 12px rgba(0,0,0,.15)",
        }}
      >
        <button onClick={() => navigate("/home")} aria-label="Home" className={getIconClass("/home") + " transition"}>
          <PanelRight className="w-5 h-5" />
        </button>
        <button onClick={() => navigate("/Searchreceipts")} aria-label="Receipts" className={getIconClass("/Searchreceipts") + " transition"}>
          <CheckCheck className="w-5 h-5" />
        </button>
        <button onClick={() => navigate("/docs")} aria-label="Docs" className={getIconClass("/docs") + " transition"}>
          <Library className="w-5 h-5" />
        </button>
        <button onClick={() => navigate("/manager")} aria-label="Profile" className={getIconClass("/manager") + " transition"}>
          <User className="w-5 h-5" />
        </button>
      </nav>
    </div>
  );
};

export default NewsComponent;
