import { ArrowLeft, CalendarDays, CheckCheck, Clock3, Library, PanelRight, User, X } from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BlogSlider from "./BlogSlider";

type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  author: string;
  thumbnail: string;
  content: string[];
};

const posts: BlogPost[] = [
  {
    id: "student-dues",
    title: "How students are simplifying dues payment with Mira",
    excerpt: "A quick look at how digital payments are helping campuses move faster and stay organized.",
    category: "Infra",
    date: "Jun 16, 2026",
    readTime: "4 min read",
    author: "Mira Team",
    thumbnail: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80",
    content: [
      "Mira is changing how students and administrators handle everyday payments. Instead of standing in long lines, users can make payments in minutes from their phones.",
      "The experience is especially useful for hostel fees, departmental dues, and other recurring obligations that previously required manual follow-up. Schools are now getting cleaner records and fewer missed payments.",
      "The main advantage is clarity. Students know what they paid, administrators can track progress quickly, and everyone spends less time on paperwork.",
    ],
  },
  {
    id: "finance-ops",
    title: "Why modern finance teams prefer simple digital receipts",
    excerpt: "Receipts are no longer just proof of payment; they are trusted records that support operations.",
    category: "Finance",
    date: "Jun 10, 2026",
    readTime: "3 min read",
    author: "Ada Okafor",
    thumbnail: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=900&q=80",
    content: [
      "Digital receipts are helping finance teams reduce errors and improve accountability. A clear receipt makes it easier to confirm payment status and resolve disputes quickly.",
      "When every transaction produces a reliable record, teams can spend less time reconciling and more time planning. That makes reporting easier and more accurate.",
      "For institutions, this means better visibility, stronger trust, and less friction for everyone involved.",
    ],
  },
  {
    id: "secure-payments",
    title: "The small habits that keep digital payments secure",
    excerpt: "Security does not need to be complicated. These simple practices make a big difference.",
    category: "Security",
    date: "Jun 4, 2026",
    readTime: "5 min read",
    author: "Micheal Sani",
    thumbnail: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=900&q=80",
    content: [
      "A secure payment experience starts with basic discipline. Users should keep their contact details updated, use strong account passwords, and verify any payment request before approving it.",
      "Organizations also benefit from clear communication. When students know what to expect and where to report issues, trust grows and support requests drop.",
      "Security feels simpler when the process itself is easy to understand. That is why Mira focuses on clean flows and clear confirmation steps.",
    ],
  },
];

function Docus() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  const selectedPost = posts.find((post) => post.id === selectedPostId) ?? null;

  const getIconClass = (path: string) =>
    pathname === path ? "text-white" : "text-[#c9cbed]/70";

  return (
    <div className="min-h-screen bg-[#fbfaff] pb-28 text-slate-100" style={{ fontFamily: "Sora, sans-serif" }}>
      <div className="mx-0 max-w-7xl px-0 py-0 sm:px-0">
        <div className="w-full bg-[#180b28] px-2 py-4">
          <div className="flex items-center justify-between">
            
            <div className="flex-1 text-center">
              <h1 className="text-2xl font-bold tracking-tight text-white">Mira  Stories</h1>
              <p className="mt-0.5 text-xs text-[#b8bcef]">Become Mira-informed</p>
            </div>
            <div className="h-11 w-11" />
          </div>

         
        </div>
 <div className="mt-0 space-y-6">
          <BlogSlider />
          <div className="rounded-[1.5rem] bg-[#5f67ac]/[0.05] p-4 sm:p-5 ring-1 ring-[#5f67ac]/15">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-black tracking-tight">Featured articles</h2>
                <p className="mt-1 text-sm text-black">Hand-picked reads from the Mira team.</p>
              </div>
              <span className="text-xs font-medium text-[#5f67ac]">{posts.length} posts</span>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
     
              {posts.map((post) => (
                <button
                  key={post.id}
                  type="button"
                  onClick={() => setSelectedPostId(post.id)}
                 className={`group w-full overflow-hidden rounded-2xl border text-left transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#180b28]/25 ${
                    selectedPost?.id === post.id
                      ? "border-[#5f67ac] bg-[#180b28]"
                      : "border-[#5f67ac]/20 bg-[#180b28]"
                  }`}
                >
                   <div className="overflow-hidden rounded-[0.9rem]">
                    <img src={post.thumbnail} alt={post.title} className="h-28 w-full object-cover" />
                  </div>
                  <div className="p-4">
                    <h3 className="text-base sm:text-lg font-semibold leading-snug text-white">{post.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-400 line-clamp-2">{post.excerpt}</p>
                    <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <CalendarDays className="h-3.5 w-3.5" />
                        <span>{post.date}</span>
                      </div>
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {selectedPost ? (
            <div className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-2xl rounded-t-[1.5rem] border border-[#5f67ac]/25 bg-[#180b28] p-5 sm:p-6 shadow-2xl">
              <div className="mx-auto mb-3 h-1.5 w-16 rounded-full bg-slate-700" />
              <div className="flex items-start justify-between gap-3">
                <div>
                  
                  <h3 className="mt-1 text-lg font-semibold text-white">{selectedPost.title}</h3>
                   <span className="inline-flex items-center rounded-full bg-[#5f67ac]/20 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#d8daf7]">
                    {selectedPost.category}
                  </span>
                  <h3 className="mt-2 text-xl sm:text-2xl font-bold tracking-tight text-white">{selectedPost.title}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedPostId(null)}
                  className="rounded-full bg-slate-800 p-2 text-slate-300"
                  aria-label="Close reading view"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-4 overflow-hidden rounded-[1rem]">
                  <img src={selectedPost.thumbnail} alt={selectedPost.title} className="h-48 sm:h-64 w-full object-cover" />
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-slate-400">
                <Clock3 className="h-4 w-4" />
                <span>{selectedPost.readTime}</span>
                <span>•</span>
                <span>{selectedPost.date}</span>
                <span>•</span>
                <span>{selectedPost.author}</span>
              </div>

               <div className="mt-4 max-h-[45vh] space-y-4 overflow-y-auto pr-1 text-base leading-relaxed text-slate-300">
                {selectedPost.content.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <nav
        className="fixed bottom-4 left-1/2 z-50 flex items-center gap-10 rounded-full bg-[#5f67ac]/25 px-6 py-3 shadow-xl backdrop-blur-xl"
        style={{
          transform: "translateX(-50%)",
          boxShadow: "0 4px 12px rgba(0,0,0,.15)",
        }}
      >
        <button onClick={() => navigate("/home")} aria-label="Home" className={getIconClass("/home") + " transition"}>
          <PanelRight className="h-5 w-5" />
        </button>
        <button onClick={() => navigate("/Searchreceipts")} aria-label="Receipts" className={getIconClass("/Searchreceipts") + " transition"}>
          <CheckCheck className="h-5 w-5" />
        </button>
        <button onClick={() => navigate("/docs")} aria-label="Docs" className={getIconClass("/docs") + " transition"}>
          <Library className="h-5 w-5" />
        </button>
        <button onClick={() => navigate("/manager")} aria-label="Profile" className={getIconClass("/manager") + " transition"}>
          <User className="h-5 w-5" />
        </button>
      </nav>
    </div>
  );
}

export default Docus;
