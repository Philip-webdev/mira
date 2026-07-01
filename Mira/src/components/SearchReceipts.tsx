import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Download, Home, Library, User, CheckCheck, PanelRight } from "lucide-react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const SearchReceipts = () => {
  const [matricNumber, setMatricNumber] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearched, setIsSearched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState("Department");
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    if (matricNumber.trim() === "") {
      setSearchResults([]);
      setIsSearched(false);
    }
  }, [matricNumber]);

  const handleSearch = async () => {
    if (!matricNumber.trim()) return;
    setSubmitting(true);

    try {
      const res = await axios.get(
        `https://Mira-backend-main.onrender.com/api/find-receipt?matricNumber=${encodeURIComponent(matricNumber)}`
      );
      setSearchResults(res.data);
      setIsSearched(true);
    } catch (error) {
      console.error("Error fetching receipts:", error);
      setSearchResults([]);
      setIsSearched(true);
    } finally {
      setSubmitting(false);
    }
  };

  const getIconClass = (path: string) =>
    pathname === path ? "text-[#5cad1a]" : "text-emerald-600/60";

  const displayResult = () => {
    if (searchResults.length === 0) {
      return <p className="text-sm text-slate-500">No receipts found for this number.</p>;
    }

    const index = filter === "College" ? 1 : 0;
    const result = searchResults[index];

    if (!result) {
      return <p className="text-sm text-red-500">No data available for the selected filter.</p>;
    }

    return (
      <div className="space-y-3 rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm dark:border-emerald-900 dark:bg-[#122613]">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-slate-500">Student</p>
            <p className="text-lg font-semibold text-slate-950 dark:text-white">{result.fullname}</p>
          </div>
          <Badge variant={result.status === "Paid" ? "default" : "secondary"}>{result.status}</Badge>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-white p-4 shadow-sm dark:bg-[#0c1b10]">
            <p className="text-xs uppercase text-slate-400">Matric Number</p>
            <p className="mt-2 font-semibold text-slate-900 dark:text-white">{result.matricNumber}</p>
          </div>
          <div className="rounded-2xl bg-white p-4 shadow-sm dark:bg-[#0c1b10]">
            <p className="text-xs uppercase text-slate-400">Department</p>
            <p className="mt-2 font-semibold text-slate-900 dark:text-white">{result.department}</p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-white p-4 shadow-sm dark:bg-[#0c1b10]">
            <p className="text-xs uppercase text-slate-400">College</p>
            <p className="mt-2 font-semibold text-slate-900 dark:text-white">{result.collegeName}</p>
          </div>
          <div className="rounded-2xl bg-white p-4 shadow-sm dark:bg-[#0c1b10]">
            <p className="text-xs uppercase text-slate-400">Amount Paid</p>
            <p className="mt-2 font-semibold text-slate-900 dark:text-white">{result.amount || "N/A"}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Button size="sm" onClick={() => navigate("/receipt", { state: { searchResult: result } })}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button size="sm" variant="secondary" onClick={() => setFilter(filter === "College" ? "Department" : "College")}>
            Switch to {filter === "College" ? "Department" : "College"}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0d1a0f] dark:bg-[#0d1a0f] text-black dark:text-white px-5 pb-28" style={{ fontFamily: "Sora, sans-serif" }}>
      <div className="max-w-4xl mx-auto py-6 space-y-8">
       

        <Card className="rounded-[2rem] border border-slate-200 bg-[#0d1a0f] p-6 shadow-sm dark:border-emerald-900 dark:bg-[#102014]">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-emerald-700 dark:text-emerald-300">
              <Search className="h-5 w-5" />
              Receipt Search
            </CardTitle>
            <CardDescription className="text-white dark:text-white">
              Enter your matriculation number to locate your latest payment receipts.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-3 md:grid-cols-[1.4fr,_0.6fr]">
              <Input
                placeholder="e.g. 20201735"
                value={matricNumber}
                onChange={(e) => {
                  setMatricNumber(e.target.value);
                  setIsSearched(false);
                }}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="w-full bg-none"
              />
              <Button onClick={handleSearch} className="w-full bg-emerald-600 text-white hover:bg-emerald-700">
                <Search className="h-4 w-4 mr-2" />
                Search receipts
              </Button>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
           
              <select
                id="select"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="rounded-2xl border border-slate-200 bg-white px-6 py-3 text-slate-900 shadow-sm outline-none focus:border-emerald-500 dark:border-emerald-800 dark:bg-[#0b1a10] dark:text-slate-100"
              >
                <option value="Department">Department</option>
                <option value="College">College</option>
              </select>
            </div>

            {isSearched && (
              <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 shadow-sm dark:border-emerald-900 dark:bg-[#122613]">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Search results for</p>
                    <p className="text-lg font-semibold text-slate-950 dark:text-white">{matricNumber}</p>
                  </div>
                  <div className="rounded-3xl bg-emerald-100 px-3 py-2 text-[11px] font-semibold text-emerald-700">{searchResults.length} found</div>
                </div>
                <div className="relative mt-6">
                  {submitting && (
                    <div className="absolute inset-0 rounded-[1.5rem] bg-black/30 backdrop-blur-sm flex items-center justify-center z-20">
                      <div className="flex flex-col items-center gap-4 rounded-3xl bg-white p-6 text-slate-900 shadow-lg">
                        <div className="h-12 w-12 rounded-full border-4 border-emerald-200 border-t-emerald-600 animate-spin" />
                        <p className="font-semibold">Fetching receipt...</p>
                      </div>
                    </div>
                  )}
                  {displayResult()}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
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

export default SearchReceipts;
